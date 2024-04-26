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
 * Обновляет данные текущего пользователя
 */
export const updateCurrentUser = (
  req: Request<unknown, unknown, Omit<IUser, 'avatar'>>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const {
    name, about,
  } = req.body;

  return User.findByIdAndUpdate(
    res.locals?.user._id,
    {
      $set: {
        name, about,
      },
    },
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

export const updateCurrentUserInputRules = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});
