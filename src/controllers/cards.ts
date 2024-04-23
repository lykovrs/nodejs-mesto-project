import {
  NextFunction, Request, Response,
} from 'express';
import { Error as MongooseError } from 'mongoose';

import { constants } from 'http2';
import Card, { ICard } from '../models/card';
import { AuthContext } from '../types';
import {
  BadRequest, NotFoundError, UnauthorizedError,
} from '../errors';
import { badReqCardMessage, notFoundCardMessage } from './constants';

/**
 * Возвращает все карточки
 */
export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({}).select(
  ['-__v', '-updatedAt'],
)
  .then((cards) => res.send({ data: cards }))
  .catch(next);

/**
 * Создаёт карточку
 */
export const createCard = (
  req: Request<unknown, unknown, ICard>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { name, link } = req.body;
  if (!name || !link) throw new BadRequest(badReqCardMessage);

  if (!res.locals?.user._id) throw new UnauthorizedError();

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

/**
 * Удаляет карточку по идентификатору
 */
export const deleteCardById = (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!res.locals?.user._id) throw new UnauthorizedError();

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

/**
 * Добавляет лайк карточке
 */
export const likeCardById = (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!res.locals?.user._id) throw new UnauthorizedError();

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
    .catch(next);
};

/**
 * Удаляет лайк с карточки
 */
export const dislikeCardById = (
  req: Request<{ id: string }>,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!res.locals?.user._id) throw new UnauthorizedError();

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
    .catch(next);
};
