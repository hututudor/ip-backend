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

}