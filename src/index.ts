import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { migrate } from './db';
import {} from './types/express/index';
import {
  LobbiesController,
  UsersController,
  WillController,
  MessageController,
} from './controllers';
import { handleRequest } from './utils/Request';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/login', handleRequest(UsersController.login));
app.post('/register', handleRequest(UsersController.register));
app.get(
  '/profile',
  UsersController.auth,
  handleRequest(UsersController.getProfile),
);

app.post(
  '/state/:lobbyId',
  UsersController.auth,
  handleRequest(LobbiesController.act),
);
app.post(
  `/lobbies/:lobbyId`,
  UsersController.auth,
  handleRequest(LobbiesController.join),
);
app.get(
  '/state/:lobbyId',
  UsersController.auth,
  handleRequest(LobbiesController.getState),
);
app.delete(
  '/lobbies/:lobbyId',
  UsersController.auth,
  handleRequest(LobbiesController.quit),
);
app.post('/state/:lobbyId/start_game', handleRequest(LobbiesController.start));

app.put(
  '/lobbies/:lobbyId/will',
  UsersController.auth,
  handleRequest(WillController.update),
);
app.get(
  '/lobbies/:lobbyId/will',
  UsersController.auth,
  handleRequest(WillController.getWill),
);

app.get(
  '/lobbies/:lobbyId/messages',
  UsersController.auth,
  handleRequest(MessageController.getChat),
);
app.post(
  '/lobbies/:lobbyId/messages',
  UsersController.auth,
  handleRequest(MessageController.postMessage),
);
app.post(
  '/lobbies/:lobbyId/announce',
  handleRequest(MessageController.postGlobalMessage),
);

migrate();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
