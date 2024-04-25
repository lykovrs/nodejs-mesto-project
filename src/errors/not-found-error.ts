import { constants } from 'http2';
import { ServerError } from './server-error';

/**
 * Кастомная ошибка на не найденный объект
 */
export class NotFoundError extends ServerError {
  constructor(message: string = 'Объект не найден') {
    super(message);
    this.code = constants.HTTP_STATUS_NOT_FOUND;
  }
}
