import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import joi from 'joi';
import jwt from 'jsonwebtoken';
const { verify, sign } = jwt;

import { Request, Response } from '../utils';
import { User } from '../models';
import { UsersRepository } from '../repositories';

const users: User[] = [];

export const login = async (req: Request) => {
  const credentials: { username: string; password: string } = req.body;
  const { error } = joi
    .object({
      username: joi.string().min(3).max(30).required(),
      password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
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

    accessToken = sign(result.user, process.env.ACCESS_SECRET_KEY!);
  } catch (err) {
    if (err instanceof Error) {
      return Response.unauthorized({ message: err.message });
    }
  }

  return Response.success({
    token: accessToken,
  });
};

export const register = (req: Request) => {
  const user: User = req.body;
  // TODO()
  return Response.success({
    token: '12345',
    user,
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
) => {
  // TODO()
  next();
};
