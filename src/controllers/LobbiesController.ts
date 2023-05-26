import { Request, Response } from '../utils';
import { GameEngineManager } from '../services/GameEngineManager';

export const act = async (req: Request): Promise<Response> =>
  GameEngineManager.act(req.params.lobbyId, {
    ...req.body,
    userId: req.userId,
  });

export const getState = async (req: Request): Promise<Response> =>
  GameEngineManager.getState(req.params.lobbyId, req.userId);

export const join = async (req: Request): Promise<Response> =>
  GameEngineManager.join({ lobbyId: req.params.lobbyId, userId: req.userId });

export const createLobby = async (): Promise<Response> =>
  GameEngineManager.createLobby();

export const start = async (req: Request): Promise<Response> =>
  GameEngineManager.start(req.params.lobbyId);

export const quit = async (req: Request): Promise<Response> =>
  GameEngineManager.quit(req.params.lobbyId, {
    ...req.body,
    userId: req.userId,
  });

export const getAll = async (req: Request): Promise<Response> =>
  GameEngineManager.getAllLobbies();
