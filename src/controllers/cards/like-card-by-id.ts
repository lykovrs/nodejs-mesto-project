import {
  NextFunction, Request, Response,
} from 'express';
import { Error as MongooseError } from 'mongoose';

import Card from '../../models/card';
import { AuthContext } from '../../types';
import {
  BadRequest, NotFoundError,
} from '../../errors';
import { notFoundCardMessage } from '../constants';

/**
 * Добавляет лайк карточке
 */
const likeCardById = (
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
    .select(['-__v', '-updatedAt'])
    .orFail(new NotFoundError(notFoundCardMessage))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      const isMongoCastError = err instanceof MongooseError.CastError;
      if (isMongoCastError) {
        next(new BadRequest(notFoundCardMessage));
      } else {
        next(err);
      }
    });
};

export default likeCardById;
