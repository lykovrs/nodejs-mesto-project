import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi } from 'celebrate';

/**
 * Разлогинивает пользователя
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.clearCookie('jwt').send({ message: 'Выход' });
  } catch (e) {
    return next(e);
  }
};

export const logoutRules = celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
});
