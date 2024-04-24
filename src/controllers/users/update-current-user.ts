import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import User, { IUser } from '../../models/user';
import {
  BadRequest, NotFoundError,
} from '../../errors';
import { AuthContext } from '../../types';
import {
  badReqUserMessage,
  notFoundUserMessage,
} from '../constants';

/**
 * Обновляет данные текущего пользователя
 */
const updateCurrentUser = (
  req: Request<unknown, unknown, Omit<IUser, 'avatar'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const {
    name, about, email, password,
  } = req.body;

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    {
      $set: {
        name, about, email, password,
      },
    },
    { new: true, runValidators: true },
  )
    .select(
      ['-__v', '-password'],
    )
    .orFail(new NotFoundError(notFoundUserMessage))
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

export default updateCurrentUser;
