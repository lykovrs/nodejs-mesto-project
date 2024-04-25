import {
  NextFunction, Request, Response,
} from 'express';

import { constants } from 'http2';
import { celebrate, Joi } from 'celebrate';
import Card, { ICard } from '../../models/card';
import { AuthContext } from '../../types';

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
      next(err);
    });
};

export const createCardInputRules = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri(),
  }),
});
