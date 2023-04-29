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
  const will = await repository.getById(userId);
  let updatedContent = will.data;

  if (!will) {
    updatedContent = (
      await repository.insert({
        time: req.params.time,
        data: req.params.content,
        userId: userId,
      })
    ).data;
  } else if (req.params.time > will.time) {
    will.time = req.params.time;
    will.data = req.params.content;
    updatedContent = (await repository.update(will)).data;
  }

  return Response.success({ data: updatedContent });
};
