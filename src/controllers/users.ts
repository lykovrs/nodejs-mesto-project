import { NextFunction, Request, Response } from 'express';

import User, { IUser } from '../models/user';
import { ForbiddenError, NotFoundError } from '../errors';

/**
 * Получает список всех пользователей
 */
export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.find({})
  .then((users) => {
    res.send({ data: users });
  })
  .catch(next);

/**
 * Создает нового пользователя
 */
export const createUser = (
  req: Request<unknown, unknown, IUser>,
  res: Response,
  next: NextFunction,
) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) throw new ForbiddenError('Ошибка ввода параметров создания пользователя');

  return User.create({ name, about, avatar })
    .then((director) => {
      res.send({ data: director });
    })
    .catch(next);
};

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
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: user });
    })
    .catch(next);
};
