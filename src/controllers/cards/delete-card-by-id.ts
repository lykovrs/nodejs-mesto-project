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
 * Удаляет карточку по идентификатору
 */
const deleteCardById = (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  return Card.findByIdAndDelete(id).select(['-__v', '-updatedAt'])
    .orFail(new NotFoundError(notFoundCardMessage))
    .then((card) => {
      res.send({ _id: card._id });
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

export default deleteCardById;
