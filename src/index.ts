import express from 'express';
import 'dotenv/config';

import { migrate } from './db';
import { UserController } from './controllers';
import { handleRequest } from './utils/Request';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());

app.post('/login', handleRequest(UserController.login));
app.post('/register', handleRequest(UserController.register));
app.get(
  '/profile',
  UserController.auth,
  handleRequest(UserController.getProfile),
);

migrate();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
