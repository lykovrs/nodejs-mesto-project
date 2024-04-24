import {
  NextFunction, Request, Response,
} from 'express';
import Card from '../../models/card';

/**
 * Возвращает все карточки
 */
const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({}).select(
  ['-__v', '-updatedAt'],
)
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export default getCards;
