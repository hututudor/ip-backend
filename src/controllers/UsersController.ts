import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import joi from 'joi';
import jwt from 'jsonwebtoken';
const { verify, sign, JsonWebTokenError, TokenExpiredError } = jwt;
import bcrypt from 'bcrypt';

import { Request, Response } from '../utils';
import { User } from '../models';
import { UsersRepository } from '../repositories';

const users: User[] = [];

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
      result.user.password,
      credentials.password,
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
      username: joi.string().min(3).max(30).required(),
      password: joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
        .required(),
      email: joi.string().email().required(),
    })
    .validate(user);

  if (error) {
    return Response.badRequest({ message: error.message });
  }
  let repository = new UsersRepository();
  let result = await repository.insert(user);
  let accessToken = sign(result, process.env.ACCESS_SECRET_KEY!);
  try {
    return Response.success({
      token: accessToken,
      user: result,
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

export const getProfile = (req: Request) => {
  // TODO()
  const userId = req.params.userId;
  return Response.success('User profile for user with id: ' + userId);
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
    /* We should store the payload (user info) somewhere, instead of decoding the token on every request */
    /* e.g. req.user = JSON.parse(decoded.user); */
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return Response.unauthorized({ message: err.message });
    } else if (err instanceof TokenExpiredError) {
      return Response.unauthorized({ message: err.message });
    }
  }
};
