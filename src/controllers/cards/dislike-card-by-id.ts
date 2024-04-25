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
 * Удаляет лайк с карточки
 */
export const dislikeCardById = (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  const options = {
    new: true,
  };

  const update = {
    $pull: { likes: res.locals.user._id },
  };

  return Card.findByIdAndUpdate(id, update, options)
    .select(['-__v', '-updatedAt'])
    .orFail(new NotFoundError(notFoundCardMessage))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};
