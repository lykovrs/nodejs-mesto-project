import { NextFunction, Request, Response } from 'express';

import User, { IUser } from '../models/user';
import {
  BadRequest, ForbiddenError, NotFoundError, UnauthorizedError,
} from '../errors';
import { AuthContext } from '../types';

/**
 * Получает список всех пользователей
 */
export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.find({}).select(
  '-__v',
)
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
    .then((user) => {
      res.send({ _id: user._id });
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

  return User.findById(id).select(
    '-__v',
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: user });
    })
    .catch(next);
};

/**
 * Обновляет данные текущего пользователя
 */
export const updateMe = (
  req: Request<unknown, unknown, Omit<IUser, 'avatar'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  if (!res.locals?.user._id) throw new UnauthorizedError('Для обновления профиля вы должны быть авторизованы');

  const { name, about } = req.body;
  if (!name || !about) throw new BadRequest('Ошибка ввода параметров изменения профиля');

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    { $set: { name, about } },
    { new: true },
  ).select(
    '-__v',
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: user });
    })
    .catch(next);
};

/**
 * Обновляет аватар текущего пользователя
 */
export const updateMyAvatar = (
  req: Request<unknown, unknown, Omit<IUser, 'about' | 'name'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  if (!res.locals?.user._id) throw new UnauthorizedError('Для обновления профиля вы должны быть авторизованы');

  const { avatar } = req.body;
  if (!avatar) throw new BadRequest('Ошибка ввода параметров аватара профиля');

  return User.findByIdAndUpdate(res.locals?.user._id, { $set: { avatar } }, { new: true }).select(
    '-__v',
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: user });
    })
    .catch(next);
};
