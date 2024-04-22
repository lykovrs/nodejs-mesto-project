import ServerError from './server-error';

/**
 * Ошибка ввода параметров
 */
export default class BadRequest extends ServerError {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}
