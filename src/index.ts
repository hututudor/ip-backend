import express from 'express';
import 'dotenv/config';

import { migrate } from './db';
import {
  login,
  register,
  getProfile,
  auth,
} from './controllers/UserController';
import { handleRequest } from './utils/Request';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());

app.post('/login', handleRequest(login));
app.post('/register', handleRequest(register));
app.get('/profile', auth, handleRequest(getProfile));

migrate();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
