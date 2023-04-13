import { Request, Response } from 'express';

type User = string; // UserModel
type Credentials = string;

const users: User[] = [];

export const login = (req: Request, res: Response) => {
  const credentials: Credentials = req.body;
  // TODO()
  res.send('Login successful');
};

export const register = (req: Request, res: Response) => {
  const user: User = req.body;
  // TODO()
  res.send('Registration successful for user ' + user);
};

export const getProfile = (req: Request, res: Response) => {
  // TODO()
  const userId = req.params.userId;
  res.send('User profile for user with id: ' + userId);
};
export const auth = (req: Request, res: Response, next: () => void) => {
  // TODO()
  next();
};