import { WillRepository } from '../repositories';
import { Request, Response } from '../utils';
import joi from 'joi';

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

  const repository = new WillRepository();

  const userId: string = 'John';
  const user = await repository.getById(userId);
  let updatedContent;

  if (!user) {
    updatedContent = (
      await repository.insert({
        time: req.params.time,
        data: req.params.content,
        userId: userId,
      })
    ).data;
  } else if (req.params.time > user.time) {
    user.time = req.params.time;
    user.data = req.params.content;
    updatedContent = (await repository.update(user)).data;
  } else {
    updatedContent = user.data;
  }

  return Response.success({ data: updatedContent });
};
