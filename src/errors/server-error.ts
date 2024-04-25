import { constants } from 'http2';
/**
 * Общая серверная ошибка
 */
export default class ServerError extends Error {
  message: string;

  code: number;

  get resObj() {
    return {
      code: this.code,
      message: this.message,
    };
  }

  constructor(message: string = 'На сервере произошла ошибка') {
    super(message);
    this.code = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    this.message = message;
  }
}
