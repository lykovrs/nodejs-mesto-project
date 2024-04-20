/**
 * Общая серверная ошибка
 */
export default class ServerError extends Error {
  statusCode: number;

  constructor(message: string = 'На сервере произошла ошибка') {
    super(message);
    this.statusCode = 500;
  }
}
