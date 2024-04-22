import { NextFunction, Request, Response } from 'express';

import Card, { ICard } from '../models/card';
import { AuthContext } from '../types';
import {
  BadRequest, NotFoundError, UnauthorizedError,
} from '../errors';

/**
 * Возвращает все карточки
 */
export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
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
  if (!name || !link) throw new BadRequest('Ошибка ввода параметров создания карточки');

  if (!res.locals?.user._id) throw new UnauthorizedError('Для создания карточки вы должны быть авторизованы');

  return Card.create({ name, link, owner: res.locals.user._id })
    .then((director) => res.send({ data: director }))
    .catch(next);
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

  if (!res.locals?.user._id) throw new UnauthorizedError('Для удаления карточки вы должны быть авторизованы');

  return Card.findByIdAndDelete(id)
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки с таким id');
      res.send({ data: card });
    })
    .catch(next);
};
