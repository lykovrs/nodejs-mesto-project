import { constants } from 'http2';
import ServerError from './server-error';

/**
 * Ошибка ввода параметров
 */
export default class BadRequest extends ServerError {
  constructor(message: string = 'Ошибка ввода параметров') {
    super(message);
    this.code = constants.HTTP_STATUS_BAD_REQUEST;
  }
}
