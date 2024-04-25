import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi } from 'celebrate';
import User, { IUser } from '../../models/user';
import {
  NotFoundError,
} from '../../errors';
import { AuthContext } from '../../types';
import {
  notFoundUserMessage,
} from '../constants';
import { joiPasswordValidator } from './constants';

/**
 * Обновляет данные текущего пользователя
 */
export const updateCurrentUser = (
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
      next(err);
    });
};

export const updateCurrentUserInputRules = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    email: Joi.string().email(),
    password: joiPasswordValidator,
  }),
});
