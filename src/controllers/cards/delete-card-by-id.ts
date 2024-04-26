import {
  NextFunction, Request, Response,
} from 'express';

import Card from '../../models/card';
import { AuthContext } from '../../types';
import {
  ForbiddenError,
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
    const card = await Card.findById(id).orFail(new NotFoundError(notFoundCardMessage));

    if (card?.owner.toString() !== res.locals.user._id) {
      return next(new ForbiddenError('Пользователь не может удалить чужую карточку'));
    }

    await Card.findByIdAndDelete(id)
      .select(['-updatedAt'])
      .orFail(new NotFoundError(notFoundCardMessage));

    return res.send({ _id: card._id });
  } catch (err) {
    return next(err);
  }
};
