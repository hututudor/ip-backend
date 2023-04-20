import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { Request, Response } from '../utils';
import { User } from '../models';

const users: User[] = [];

export const login = (req: Request) => {
  const credentials: string = req.body;
  // TODO()
  return Response.success({
    token: '12345',
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