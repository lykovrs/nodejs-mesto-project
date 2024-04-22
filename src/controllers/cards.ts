import {
  NextFunction, Request, Response,
} from 'express';

import Card, { ICard } from '../models/card';
import { AuthContext } from '../types';
import {
  BadRequest, NotFoundError, UnauthorizedError,
} from '../errors';

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
  const badReqMessage = 'Ошибка ввода параметров создания карточки';
  const { name, link } = req.body;
  if (!name || !link) throw new BadRequest(badReqMessage);

  if (!res.locals?.user._id) throw new UnauthorizedError('Для создания карточки вы должны быть авторизованы');

  return Card.create({ name, link, owner: res.locals.user._id })
    .then((card) => res.send({ _id: card._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(badReqMessage));
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
  const badReqMessage = 'Нет карточки с таким id';
  if (!res.locals?.user._id) throw new UnauthorizedError('Для удаления карточки вы должны быть авторизованы');

  return Card.findByIdAndDelete(id).select(['-__v', '-updatedAt'])
    .then((card) => {
      if (!card) throw new NotFoundError(badReqMessage);
      res.send({ _id: card._id });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(badReqMessage));
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

  if (!res.locals?.user._id) throw new UnauthorizedError('Для реакции вы должны быть авторизованы');

  const options = {
    new: true,
  };

  const update = {
    $addToSet: { likes: res.locals.user._id },
  };

  return Card.findByIdAndUpdate(id, update, options).select(['-__v', '-updatedAt'])
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки с таким id');
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

  if (!res.locals?.user._id) throw new UnauthorizedError('Для реакции вы должны быть авторизованы');

  const options = {
    new: true,
  };

  const update = {
    $pull: { likes: res.locals.user._id },
  };

  return Card.findByIdAndUpdate(id, update, options).select(['-__v', '-updatedAt'])
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки с таким id');
      res.send({ data: card });
    })
    .catch(next);
};
