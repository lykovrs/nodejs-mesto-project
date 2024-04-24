import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import {
  BadRequest,
} from '../../errors';

const { JWT_SECRET = 'super-strong-secret' } = process.env;

/**
 * Аутентифицирует пользователя
 */
const login = async (
  req: Request<unknown, unknown, {email: string; password: string}>,
  res: Response,
  next: NextFunction,
) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new BadRequest('Что-то не так с почтой или паролем'));
    }

    const matched = bcrypt.compare(password, user.password);

    if (!matched) {
      return next(new BadRequest('Неправильные почта или пароль'));
    }

    return res.send({
      token: jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      ),
    });
  } catch (e) {
    return next(e);
  }
};

export default login;
