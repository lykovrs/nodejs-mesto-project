import { constants } from 'http2';
import { ServerError } from './server-error';

/**
 * Конфликт параметров
 */
export class ConflictError extends ServerError {
  constructor(message: string = 'Значение должно быть уникальным') {
    super(message);
    this.code = constants.HTTP_STATUS_CONFLICT;
  }
}
