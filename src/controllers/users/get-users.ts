import {
  NextFunction, Request, Response,
} from 'express';

import User from '../../models/user';

/**
 * Получает список всех пользователей
 */
const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({}).select(
      ['-__v', '-password'],
    );

    res.send({ data: users });
  } catch (e) {
    next(e);
  }
};

export default getUsers;
