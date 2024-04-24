import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';

/**
 * Получает список всех пользователей
 */
const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.find({}).select(
  '-__v',
)
  .then((users) => res.send({ data: users }))
  .catch(next);

export default getUsers;
