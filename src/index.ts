import express from 'express';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import 'dotenv/config';

import { migrate } from './db';
import { UsersRepository } from './repositories';
import { LobbyRepository } from './repositories';
import { Lobby } from './models';
import { login, register, getProfile, auth } from './controllers/userController';
import { Request, createRequest } from './utils/Request';
import { Response } from './utils/Response';


const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

migrate();

app.use(express.json());

const handleRequest = (handler: (request: any) => any) => (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  const response = handler(createRequest(req));
  res.status(response.status).json(response.data);
};

app.post('/login', handleRequest(login));
app.post('/register', handleRequest(register));
app.get('/profile/:userId', auth, getProfile);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
