import { constants } from 'http2';
import ServerError from './server-error';

/**
 * Кастомная ошибка если не хватает прав
 */
export default class ForbiddenError extends ServerError {
  constructor(message: string = 'Не хватает прав') {
    super(message);
    this.code = constants.HTTP_STATUS_FORBIDDEN;
  }
}
