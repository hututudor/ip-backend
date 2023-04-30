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

export const getWill = async (req: Request): Promise<Response> => {

  const authUserId = 'John';
  
  let userId = authUserId;

  if(!(Object.keys(req.query).length === 0)) {
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

  if(!userId){
    return Response.unauthorized(userId);
  }

  const repository = new WillRepository();

  const will = await repository.getById(req.query.userId);

  return Response.success({ data: will?.data ?? "" });
};