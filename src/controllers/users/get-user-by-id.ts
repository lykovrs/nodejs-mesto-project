import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import User from '../../models/user';
import {
  BadRequest, NotFoundError,
} from '../../errors';
import {
  badReqUserMessage,
  notFoundUserMessage,
} from '../constants';

/**
 * Получает пользователя по идентификатору из БД
 */
const getUserById = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  return User.findById(id).select(
    ['-__v', '-password'],
  )
    .orFail(new NotFoundError(notFoundUserMessage))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      const isMongoCastError = err instanceof MongooseError.CastError;
      if (isMongoCastError) {
        next(new BadRequest(badReqUserMessage));
      } else {
        next(err);
      }
    });
};

export default getUserById;
