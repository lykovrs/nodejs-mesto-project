import { Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import { Error as MongooseError } from 'mongoose';
import { ServerError, BadRequest } from '../errors';

/**
 * Централизованная обработка ошибок
 */
export const errorMiddleware = (
  err: ServerError | Error | MongooseError,
  req: unknown,
  res: Response,
  next: NextFunction,
) => {
  // если ошибка валидации Celebrate
  if (isCelebrateError(err)) {
    const message = Array.from(err.details).map((args) => args[1]).join(',');
    const customError = new BadRequest(message);
    return res
      .status(customError.code)
      .send(customError.resObj);
  }

  // Обработка ошибки формата идентификатора
  const isMongoCastError = err instanceof MongooseError.CastError;
  if (isMongoCastError) {
    const customError = new BadRequest('Не верный формат идентификатора');
    return res
      .status(customError.code)
      .send(customError.resObj);
  }

  // если это наша ошибка
  const isCustomError = err instanceof ServerError;
  if (isCustomError) {
    return res
      .status(err.code)
      .send({
        code: err.code,
        message: err.message,
      });
  }

  if (err) {
    // если ошибка не опознана, отправляем кастомную пятисотую
    const customError = new ServerError();
    return res
      .status(customError.code)
      .send(customError.resObj);
  }
  return next();
};
