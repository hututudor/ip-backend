import { LobbiesRepository, WillRepository } from '../repositories';
import { Request, Response } from '../utils';
import joi from 'joi';
import { PlayersRepository } from '../repositories/PlayersRepository';

export const update = async (req: Request) => {
  const { error } = joi
    .object({
      content: joi.string().required(),
      time: joi.number().required(),
    })
    .validate(req.body);

  if (error) {
    return Response.badRequest({ message: error.message });
  }

  const lobbiesRepository = new LobbiesRepository();
  const lobby = await lobbiesRepository.getById(req.params.lobbyId);
  if (!lobby) {
    return Response.notFound({ message: 'Lobby not found' });
  } else if (lobby.status != 'started') {
    return Response.badRequest({ message: "The lobby didn't start" });
  }

  const repository = new WillRepository();

  const userId = req.query.userId ?? req.userId;
  const will = await repository.getByUserIdAndLobbyId(
    userId,
    req.params.lobbyId,
  );
  let updatedContent;

  if (!will) {
    updatedContent = (
      await repository.insert({
        time: req.body.time,
        data: req.body.content,
        lobbyId: req.params.lobbyId,
        userId,
      })
    ).data;
  } else if (req.body.time > will.time) {
    const playersRepository = new PlayersRepository();

    const userId = req.query.userId ?? req.userId;
    const playerStatus = await playersRepository.getPlayerStatus(userId);

    if (playerStatus === 'dead') {
      return Response.badRequest({ message: 'Player is dead.' });
    }

    will.time = req.body.time;
    will.data = req.body.content;
    updatedContent = (await repository.update(will)).data;
  }

  return Response.success({ data: updatedContent ?? will?.data });
};

export const getWill = async (req: Request): Promise<Response> => {
  let userId = req.userId;

  if (!(Object.keys(req.query).length === 0)) {
    const { error } = joi
      .object({
        userId: joi.string().required(),
      })
      .validate(req.query);

    if (error) {
      return Response.badRequest({ message: error.message });
    }

    userId = req.query.userId;
  }

  const lobbiesRepository = new LobbiesRepository();
  const lobby = await lobbiesRepository.getById(req.params.lobbyId);
  if (!lobby) {
    return Response.notFound({ message: 'Lobby not found' });
  } else if (lobby.status != 'started') {
    return Response.badRequest({ message: "The lobby didn't start" });
  }

  if (!userId) {
    return Response.unauthorized(userId);
  }

  if (req.query.userId) {
    const playersRepository = new PlayersRepository();
    const playerStatus = await playersRepository.getPlayerStatus(userId);
  }

  const repository = new WillRepository();

  const will = await repository.getByUserIdAndLobbyId(
    userId,
    req.params.lobbyId,
  );

  return Response.success({ data: will?.data ?? '' });
};
