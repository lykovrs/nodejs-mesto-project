import { Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import { Error as MongooseError } from 'mongoose';
import { ServerError, BadRequest } from '../errors';

/**
 * Централизованная обработка ошибок
 */
export default (
  err: ServerError | Error | MongooseError,
  req: unknown,
  res: Response,
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // если ошибка валидации Celebrate
  if (isCelebrateError(err)) {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const message = Array.from(err.details).map(([key, detail]) => detail).join(',');
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

  // если ошибка дубликата ключа
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const isMongoDuplicateKeyError = err.name === 'MongoServerError' && err.code === 11000;
  if (isMongoDuplicateKeyError) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const customError = new BadRequest(`Такое значение ${Object.keys(err.keyValue)[0]} уже есть, значение должно быть уникальным`);
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
  // если ошибка не опознана, отправляем кастомную пятисотую
  const customError = new ServerError();
  return res
    .status(customError.code)
    .send(customError.resObj);
};
