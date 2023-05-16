import { LobbiesRepository, MessageRepository } from '../repositories';
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

  const lobby = await new LobbiesRepository().getById(req.params.lobbyId);
  if (!lobby) {
    return Response.notFound({ message: 'Lobby not found' });
  }

  const repository = new MessageRepository();

  const senderId = req.query.userId ?? req.userId;

  const {
    data: { peers },
  } = await GameEngineManager.getPeers(req.params.lobbyId, senderId);

  await Promise.all(
    peers.map((peer: string) =>
      repository.insert({
        data: req.body.content,
        senderId,
        receiverId: peer,
        lobbyId: req.params.lobbyId,
        time: Date.now(),
      }),
    ),
  );

  return Response.success('');
};

export const postGlobalMessage = async (req: Request) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== process.env.GAME_ENGINE_SECRET) {
    return Response.unauthorized({ message: 'incorrect secret provided' });
  }

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

  await Promise.all(
    peers.map((peer: string) =>
      repository.insert({
        time: Date.now(),
        data: req.body.content,
        senderId: null,
        receiverId: peer,
        lobbyId: req.params.lobbyId,
      }),
    ),
  );

  return Response.success('');
};

export const getChat = async (req: Request): Promise<Response> => {
  let userId = req.userId;

  if (!userId) {
    return Response.unauthorized(userId);
  }

  let lobbyId = req.params.lobbyId;

  if (!lobbyId) {
    return Response.badRequest(lobbyId);
  }

  const lobby = await new LobbiesRepository().getById(lobbyId);
  if (!lobby) {
    return Response.notFound({ message: 'Lobby not found' });
  }

  let time = req.query.from ?? 0;

  const repository = new MessageRepository();

  let messages = await repository.getMessageAfterTime(userId, lobbyId, time);

  const responseMessages = messages.map(({ time, data, senderId }) => ({
    userId: senderId,
    content: data,
    createdAt: time,
  }));

  return Response.success({ messages: responseMessages });
};
