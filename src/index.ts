import express from 'express';
import 'dotenv/config';

import { migrate } from './db';
import { UsersRepository } from './repositories';
import { LobbyRepository } from './repositories';
import { Lobby } from './models';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

migrate();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
