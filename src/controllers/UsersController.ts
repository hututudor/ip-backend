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

    const { password, ...tokenData } = result.user;
    accessToken = sign(tokenData, process.env.ACCESS_SECRET_KEY!, {
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
    })
    .validate(user);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  const existingUser = await new UsersRepository().findByUserName(
    user.username,
  );

  if (existingUser.user) {
    return Response.unauthorized({
      message: `User ${user.username} already exists`,
    });
  }

  let accessToken;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    let repository = new UsersRepository();
    const { password, ...result } = await repository.insert(user);
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
    };
  } catch (err: any) {
    return Response.badRequest({ message: err.message });
  }

  return Response.success({
    profile,
  });
};

export const auth = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: () => void,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Missing authorization token', error: true });
  }

  try {
    const decoded = verify(token, process.env.ACCESS_SECRET_KEY!);
    req.userId = (decoded as JwtPayload).id;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: err.message, error: true });
  }
};
