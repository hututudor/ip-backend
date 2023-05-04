import { MessageRepository } from '../repositories';
import { Request, Response } from '../utils';
import joi from 'joi';

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

  // Trebuie facut query pentru peers

  let updatedContent;

  updatedContent = ( await repository.insert({
    time: req.body.time,
    data: req.body.content,
    lobbyId: req.params.lobbyId,
    senderId,
    })
  ).data;


  return Response.success({data: updatedContent});
}