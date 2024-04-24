import {
  NextFunction, Request, Response,
} from 'express';
import { Error as MongooseError } from 'mongoose';

import { constants } from 'http2';
import Card, { ICard } from '../../models/card';
import { AuthContext } from '../../types';
import {
  BadRequest,
} from '../../errors';
import { badReqCardMessage } from '../constants';

/**
 * Создаёт карточку
 */
export const createCard = (
  req: Request<unknown, unknown, ICard>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: res.locals.user._id })
    .then((card) => {
      res.status(constants.HTTP_STATUS_CREATED);
      res.send({ _id: card._id });
    })
    .catch((err) => {
      const isMongoValidationError = err instanceof MongooseError.ValidationError;
      if (isMongoValidationError) {
        next(new BadRequest(badReqCardMessage));
      } else {
        next(err);
      }
    });
};

export default createCard;
