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

    let updatedContent = (await repository.insert({
        time: req.body.time,
        data: req.body.content,
        lobbyId: req.params.lobbyId,
        senderId,
        receiverId: peer,
      })
    ).data;
  }
};