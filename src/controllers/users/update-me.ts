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
const updateMe = (
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

export default updateMe;
