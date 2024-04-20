import ServerError from './server-error';

/**
 * Кастомная ошибка на не найденный объект
 */
export default class NotFoundError extends ServerError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
