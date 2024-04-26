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
 * Добавляет лайк карточке
 */
export const likeCardById = (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  const options = {
    new: true,
  };

  const update = {
    $addToSet: { likes: res.locals.user._id },
  };

  return Card.findByIdAndUpdate(id, update, options)
    .orFail(new NotFoundError(notFoundCardMessage))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};
