import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import User, { IUser } from '../models/user';
import {
  BadRequest, NotFoundError,
} from '../errors';
import { AuthContext } from '../types';
import {
  badReqAvatarEditMessage,
  badReqCreateUserMessage,
  badReqUserMessage,
  notFoundUserMessage,
} from './constants';

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
  .then((users) => res.send({ data: users }))
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

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(constants.HTTP_STATUS_CREATED);
      res.send({ _id: user._id });
    })
    .catch((err) => {
      const isMongoValidationError = err instanceof MongooseError.ValidationError;
      if (isMongoValidationError) {
        next(new BadRequest(badReqCreateUserMessage));
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
  const { id } = req.params;

  return User.findById(id).select(
    '-__v',
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

/**
 * Обновляет данные текущего пользователя
 */
export const updateMe = (
  req: Request<unknown, unknown, Omit<IUser, 'avatar'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(notFoundUserMessage))
    .select(
      '-__v',
    )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      const isMongoValidationError = err instanceof MongooseError.ValidationError;
      const isMongoCastError = err instanceof MongooseError.CastError;
      if (isMongoValidationError || isMongoCastError) {
        next(new BadRequest(badReqUserMessage));
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
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    { $set: { avatar } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(notFoundUserMessage))
    .select(
      '-__v',
    )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      const isMongoValidationError = err instanceof MongooseError.ValidationError;
      if (isMongoValidationError) {
        next(new BadRequest(badReqAvatarEditMessage));
      } else {
        next(err);
      }
    });
};
