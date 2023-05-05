import { MessageRepository } from '../repositories';
import { Request, Response } from '../utils';
import joi from 'joi';
import { GameEngineManager } from '../services/GameEngineManager';

export const send = async (req: Request) => {
  const { error } = joi
    .object({
      content: joi.string().required(),
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  const repository = new MessageRepository();

  const senderId = req.query.userId ?? req.userId;

  const peersResponse = await GameEngineManager.getPeers(req.params.lobbyId, senderId, '');
  const responseObject = JSON.parse(peersResponse.data);
  const peers = responseObject.peers;

  for (let i = 0; i < peers.length; i++) {
    const peer = peers[i];
    (await repository.insert({
        time: req.body.time,
        data: req.body.content,
        lobbyId: req.params.lobbyId,
        senderId,
        receiverId: peer,
      })
    ).data;
  }
};

export const queryChat = async (req: Request): Promise<Response> => {
  let userId = req.userId;

  if (!userId) {
    return Response.unauthorized(userId);
  }

  let lobbyId = req.params.lobbyId;

  if(!lobbyId) {
    return Response.badRequest(lobbyId);
  }

  const bodyValidationResult = joi
    .object({
      content: joi.string().required(),
      time: joi.number().required(),
    })
    .validate(req.body);

  const paramsValidationResult = joi
    .object({
      from: joi.string().required(),
    })
    .validate(req.params);

  if (bodyValidationResult.error || paramsValidationResult.error) {
    return Response.badRequest('');
  }

  let time = req.params.from;

  const repository = new MessageRepository();

  let messages = await repository.getMessageAfterTime(userId, lobbyId, time);

  return Response.success({ messages: messages });
};