import ServerError from './server-error';

/**
 * Кастомная ошибка если не хватает прав
 */
export default class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
