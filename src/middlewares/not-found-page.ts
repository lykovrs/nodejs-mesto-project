import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors';

/**
 * Для роутов которые не найдены
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction,
) => next(new NotFoundError('Страница не найдена'));
