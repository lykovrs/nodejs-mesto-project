import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { AuthContext } from '../types';

const { JWT_SECRET = 'super-strong-secret' } = process.env;

const handleAuthError = (next: NextFunction) => {
  next(new UnauthorizedError());
};

/**
 * Читает токен из кук и добавляет данные пользователя в контекст
 */
export default (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return handleAuthError(next);
  }

  let payload: undefined | AuthContext['user'];

  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET) as AuthContext['user'];
  } catch (err) {
    return handleAuthError(next);
  }
  // записываем пейлоуд в объект ответа
  res.locals.user = {
    _id: payload._id,
  };

  return next();
};
