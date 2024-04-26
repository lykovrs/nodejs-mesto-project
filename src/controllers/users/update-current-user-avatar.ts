import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi } from 'celebrate';
import User, { IUser } from '../../models/user';
import {
  BadRequest,
  NotFoundError,
} from '../../errors';
import { AuthContext } from '../../types';
import {
  notFoundUserMessage,
} from '../constants';

/**
 * Обновляет аватар текущего пользователя
 */
export const updateCurrentUserAvatar = (
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
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if ((<Error>err).name === 'ValidationError') {
        return next(new BadRequest());
      }
      return next(err);
    });
};

export const updateCurrentUserAvatarRules = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
});
