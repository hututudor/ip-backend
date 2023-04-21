import joi from 'joi';
import { Request, Response } from '../utils';
import { GameEngineManager } from '../services/GameEngineManager';

export const act = async (req: Request): Promise<Response> => {
  const { error } = joi
    .object({
      userId: joi.string().required(),
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  return GameEngineManager.act(req.params.lobbyId, req.body);
};

export const join = async (req: Request): Promise<Response> => {
  const { error } = joi
    .object({
      userId: joi.string().required(),
      code: joi.string(),
    })
    .validate(req.body);
  return GameEngineManager.getState(req.params.lobbyId, req.query.userId);
};

export const getState = async (req: Request): Promise<Response> => {
  const { error } = joi
    .object({
      userId: joi.string().required(),
    })
    .validate(req.query);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  return GameEngineManager.join(req.body);
};

export const quit = async (req: Request): Promise<Response> => {
  const { error } = joi
    .object({
      userId: joi.string().required(),
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  return GameEngineManager.quit(req.params.lobbyId, req.body);
};