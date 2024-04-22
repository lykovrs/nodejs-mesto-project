import ServerError from './server-error';

/**
 * Кастомная ошибка если пользователь не авторизован
 */
export default class UnauthorizedError extends ServerError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
