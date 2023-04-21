import express from 'express';
import 'dotenv/config';

import { migrate } from './db';
import { LobbiesController, UsersController } from './controllers';
import { handleRequest } from './utils/Request';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());

app.post('/login', handleRequest(UsersController.login));
app.post('/register', handleRequest(UsersController.register));
app.get(
  '/profile',
  UsersController.auth,
  handleRequest(UsersController.getProfile),
);

app.post('/state/:lobbyId', handleRequest(LobbiesController.act));
app.post(`/lobbies`, handleRequest(LobbiesController.join));

migrate();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
