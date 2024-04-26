import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import {
  NotFoundError,
} from '../../errors';
import {
  notFoundUserMessage,
} from '../constants';

/**
 * Получает пользователя по идентификатору из БД
 */
export const getUserById = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  return User.findById(id)
    .orFail(new NotFoundError(notFoundUserMessage))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};
