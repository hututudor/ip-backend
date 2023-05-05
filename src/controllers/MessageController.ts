import { MessageRepository } from '../repositories';
import { Request, Response } from '../utils';
import joi from 'joi';
import { GameEngineManager } from '../services/GameEngineManager';

export const postMessage = async (req: Request) => {
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

  const receivedTime = Date.now();

  for (let i = 0; i < peers.length; i++) {
    const peer = peers[i];
    (await repository.insert({
        time: receivedTime,
        data: req.body.content,
        senderId,
        receiverId: peer,
        lobbyId: req.params.lobbyId,
      })
    ).data;
  }
  return Response.success('');
};

export const postGlobalMessage = async (req: Request) => {

  const authHeader = req.headers.authorization;

  if(authHeader !== 'SECRET')
    return Response.unauthorized('');

  const { error } = joi
    .object({
      content: joi.string().required(),
      peers: joi.array().items(joi.string()).required(),
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  const repository = new MessageRepository();

  const peers = req.body.peers;

  const receivedTime = Date.now();
  for (let i = 0; i < peers.length; i++) {
    const peer = peers[i];
    (await repository.insert({
        time: receivedTime,
        data: req.body.content,
        senderId: '',
        receiverId: peer,
        lobbyId: req.params.lobbyId,
      })
    ).data;
  }
  return Response.success('');
};

export const getChat = async (req: Request): Promise<Response> => {
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

  const responseMessages = messages.map(({ time, data, senderId }) => ({
    userId: senderId,
    content: data,
    createdAt: time,
  }));

  return Response.success({ messages: responseMessages });
};