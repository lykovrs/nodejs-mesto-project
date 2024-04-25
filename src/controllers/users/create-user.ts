import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import { celebrate, Joi } from 'celebrate';
import User, { IUser } from '../../models/user';
import { joiPasswordValidator } from './constants';

/**
 * Создает нового пользователя
 */
const createUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(constants.HTTP_STATUS_CREATED);
    return res.send({ _id: user._id });
  } catch (err) {
    return next(err);
  }
};

export const createUserInputRules = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: joiPasswordValidator.required(),
  }),
});

export default createUser;
