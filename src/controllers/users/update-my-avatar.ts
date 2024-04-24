import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import User, { IUser } from '../../models/user';
import {
  BadRequest, NotFoundError,
} from '../../errors';
import { AuthContext } from '../../types';
import {
  badReqAvatarEditMessage,
  notFoundUserMessage,
} from '../constants';

/**
 * Обновляет аватар текущего пользователя
 */
const updateMyAvatar = (
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

export default updateMyAvatar;
