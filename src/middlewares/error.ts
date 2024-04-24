import { Response, NextFunction } from 'express';
import { ServerError } from '../errors';

/**
 * Централизованная обработка ошибок
 */
export default (
  err: ServerError | Error,
  req: unknown,
  res: Response,
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const isCustomError = err instanceof ServerError;
  // если ошибка не опознана, отправляем кастомную пятисотую
  if (!isCustomError) {
    const customError = new ServerError();
    res
      .status(customError.statusCode)
      .send(customError.resObj);
  } else {
    res
      .status(err.statusCode)
      .send({
        statusCode: err.statusCode,
        message: err.message,
      });
  }
};
