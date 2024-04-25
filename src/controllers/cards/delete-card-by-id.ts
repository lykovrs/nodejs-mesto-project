import {
  NextFunction, Request, Response,
} from 'express';

import Card from '../../models/card';
import { AuthContext } from '../../types';
import {
  NotFoundError,
} from '../../errors';
import { notFoundCardMessage } from '../constants';

/**
 * Удаляет карточку по идентификатору
 */
export const deleteCardById = async (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const card = await Card.findOneAndDelete({ _id: id, owner: res.locals.user._id })
      .select(['-__v', '-updatedAt'])
      .orFail(new NotFoundError(notFoundCardMessage));

    res.send({ _id: card._id });
  } catch (err) {
    next(err);
  }
};
