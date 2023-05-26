import {
  LobbiesRepository,
  MessageRepository,
  PlayersRepository,
  UsersRepository,
  WillRepository,
} from '../repositories';
import { GameEngineManager } from '../services/GameEngineManager';
import { Request, Response } from '../utils';

export const reset = async (req: Request): Promise<Response> => {
  new PlayersRepository().deleteAll();
  new LobbiesRepository().deleteAll();
  new WillRepository().deleteAll();
  new MessageRepository().deleteAll();
  new UsersRepository().deleteAll();

  const rulesResponse = await GameEngineManager.reset();

  return Response.success({ rulesResponse });
};
