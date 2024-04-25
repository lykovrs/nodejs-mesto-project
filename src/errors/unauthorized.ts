import { constants } from 'http2';
import ServerError from './server-error';

/**
 * Кастомная ошибка если пользователь не авторизован
 */
export default class UnauthorizedError extends ServerError {
  constructor(message: string = 'Необходима авторизация') {
    super(message);
    this.code = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}
