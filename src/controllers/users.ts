import { NextFunction, Request, Response } from 'express';

import User, { IUser } from '../models/user';
import {
  BadRequest, NotFoundError, UnauthorizedError,
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
  const badReqMessage = 'Ошибка ввода параметров создания пользователя';
  if (!name || !about || !avatar) throw new BadRequest(badReqMessage);

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({ _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(badReqMessage));
      } else {
        next(err);
      }
    });
};

/**
 * Получает пользователя по идентификатору из БД
 */
export const getUserById = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const badReqMessage = 'Нет пользователя с таким id';
  const { id } = req.params;

  return User.findById(id).select(
    '-__v',
  )
    .then((user) => {
      if (!user) throw new NotFoundError(badReqMessage);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(badReqMessage));
      } else {
        next(err);
      }
    });
};

/**
 * Обновляет данные текущего пользователя
 */
export const updateMe = (
  req: Request<unknown, unknown, Omit<IUser, 'avatar'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const badReqMessage = 'Ошибка ввода параметров изменения профиля';
  if (!res.locals?.user._id) throw new UnauthorizedError('Для обновления профиля вы должны быть авторизованы');

  const { name, about } = req.body;
  if (!name || !about) throw new BadRequest(badReqMessage);

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  ).select(
    '-__v',
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(badReqMessage));
      } else {
        next(err);
      }
    });
};

/**
 * Обновляет аватар текущего пользователя
 */
export const updateMyAvatar = (
  req: Request<unknown, unknown, Omit<IUser, 'about' | 'name'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const badReqMessage = 'Ошибка ввода параметров аватара профиля';
  if (!res.locals?.user._id) throw new UnauthorizedError('Для обновления профиля вы должны быть авторизованы');

  const { avatar } = req.body;
  if (!avatar) throw new BadRequest(badReqMessage);

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    { $set: { avatar } },
    { new: true, runValidators: true },
  ).select(
    '-__v',
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(badReqMessage));
      } else {
        next(err);
      }
    });
};
