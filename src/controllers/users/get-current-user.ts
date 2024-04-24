import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import { AuthContext } from '../../types';

/**
 * Получает данные текущего пользователя
 */
const getCurrentUser = async (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(
      res.locals.user._id,
    )
      .select(
        ['-__v', '-password'],
      );
    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

export default getCurrentUser;
