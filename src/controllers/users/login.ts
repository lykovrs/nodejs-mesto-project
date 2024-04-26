import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { celebrate, Joi } from 'celebrate';
import User from '../../models/user';
import {
  UnauthorizedError,
} from '../../errors';
import { joiPasswordValidator } from './constants';

const { JWT_SECRET = 'super-strong-secret' } = process.env;

const unAuthorizedError = new UnauthorizedError('Неправильные почта или пароль');

/**
 * Аутентифицирует пользователя
 */
export const login = async (
  req: Request<unknown, unknown, {email: string; password: string}>,
  res: Response,
  next: NextFunction,
) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(unAuthorizedError);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return next(unAuthorizedError);
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    const sevenDaysByMs = 3600000 * 24 * 7;

    res.cookie('jwt', token, {
      maxAge: sevenDaysByMs,
      httpOnly: true,
    });

    return res.send({
      token: `Bearer ${token}`,
    });
  } catch (e) {
    return next(e);
  }
};

export const loginInputRules = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: joiPasswordValidator,
  }),
});
