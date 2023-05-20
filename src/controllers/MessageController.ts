import {
  LobbiesRepository,
  MessageRepository,
  UsersRepository,
} from '../repositories';
import { Request, Response } from '../utils';
import joi from 'joi';
import { GameEngineManager } from '../services/GameEngineManager';
import { PlayersRepository } from '../repositories/PlayersRepository';
import { Player } from '../models';

export const postMessage = async (req: Request) => {
  const { error } = joi
    .object({
      content: joi.string().required(),
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  const playersRepository = new PlayersRepository();
  const userId = req.query.userId ?? req.userId;
  const playerStatus = await playersRepository.getPlayerStatus(userId);

  if (playerStatus === 'dead') {
    return Response.badRequest({ message: 'Player is dead.' });
  }
  const lobby = await new LobbiesRepository().getById(req.params.lobbyId);
  if (!lobby) {
    return Response.notFound({ message: 'Lobby not found' });
  }

  const repository = new MessageRepository();

  const senderId = req.query.userId ?? req.userId;

  // whisper -> /w <userID> messageContent
  const whisper = req.body.content.match(/^\/w (\w+) (.*)/);

  let peers: string[] = [];
  let message: string = req.body.content;

  if (whisper) {
    // The message is a whisper, send it only to the specified user
    const { user } = await new UsersRepository().findByUserName(whisper[1]);

    if (!user) {
      return Response.badRequest({ message: 'user does not exist' });
    }

    peers = [user.id];
    message = whisper[2];
  } else {
    // The message is not a whisper, send it to all peers
    const {
      data: { peers: lobbyPeers },
    } = await GameEngineManager.getPeers(req.params.lobbyId, senderId);
    peers = lobbyPeers;
  }

  await Promise.all(
    peers.map((peer: string) =>
      repository.insert({
        data: message,
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
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  const repository = new MessageRepository();
  const playersRepository = new PlayersRepository();

  let peers: string[];

  // If a userId is provided, send the message only to that user
  if (req.query.userId) {
    peers = [req.query.userId];
  } else {
    // Otherwise, send it to all the players in the lobby
    const players: Player[] = await playersRepository.getPlayersInLobby(
      req.params.lobbyId,
    );

    peers = players.map((player: Player) => player.userId);
  }

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
