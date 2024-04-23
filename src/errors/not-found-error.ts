import { constants } from 'http2';
import ServerError from './server-error';

/**
 * Кастомная ошибка на не найденный объект
 */
export default class NotFoundError extends ServerError {
  constructor(message: string = 'Объект не найден') {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}
