import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import joi from 'joi';
import jwt, { JwtPayload } from 'jsonwebtoken';
const { verify, sign, JsonWebTokenError, TokenExpiredError } = jwt;
import bcrypt from 'bcrypt';

import { Request, Response } from '../utils';
import { User } from '../models';
import { UsersRepository } from '../repositories';

export const login = async (req: Request) => {
  const credentials: { username: string; password: string } = req.body;
  const { error } = joi
    .object({
      username: joi.string().min(5).max(30).required(),
      password: joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
        .required(),
    })
    .validate(credentials);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  let accessToken;
  try {
    const result = await new UsersRepository().findByUserName(
      credentials.username,
    );
    if (!result.user) {
      throw new Error(`User ${credentials.username} has not been found`);
    }

    const match = await bcrypt.compare(
      credentials.password,
      result.user.password,
    );
    if (!match) {
      throw new Error('Incorrect password');
    }

    accessToken = sign(result.user, process.env.ACCESS_SECRET_KEY!, {
      expiresIn: '7d',
    });
  } catch (err) {
    if (err instanceof Error) {
      return Response.unauthorized({ message: err.message });
    }
  }

  return Response.success({
    token: accessToken,
  });
};

export const register = async (req: Request) => {
  const user: User = req.body;
  const { error } = joi
    .object({
      firstName: joi.string().min(3).max(30).required(),
      lastName: joi.string().min(3).max(30).required(),
      username: joi.string().min(3).max(30).required(),
      password: joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
        .required(),
    })
    .validate(user);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  let result, accessToken;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    let repository = new UsersRepository();
    result = await repository.insert(user);
    accessToken = sign(result, process.env.ACCESS_SECRET_KEY!, {
      expiresIn: '7d',
    });
  } catch (err) {
    if (err instanceof Error) {
      return Response.unauthorized({ message: err.message });
    }
  }
  return Response.success({
    token: accessToken,
    user: result,
  });
};

export const getProfile = async (req: Request) => {
  const userId = req.query.userId ?? req.userId;
  let user, profile;

  try {
    user = await new UsersRepository().getById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    profile = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (err) {
    if (err instanceof Error) {
      return Response.badRequest({ message: err.message });
    }
  }
  return Response.success({
    message: 'User profile for user with id: ' + userId,
    profile,
  });
};

export const auth = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: () => void,
): { status: number; data: any } | void => {
  const { token } = req.body;

  if (!token) {
    return Response.badRequest({ message: 'Missing auhentication token' });
  }

  try {
    const decoded = verify(token, process.env.ACCESS_SECRET_KEY!);
    req.userId = (decoded as JwtPayload).id;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return Response.unauthorized({ message: err.message });
    } else if (err instanceof TokenExpiredError) {
      return Response.unauthorized({ message: err.message });
    }
  }
};
