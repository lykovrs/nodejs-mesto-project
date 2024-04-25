import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

// конфигурирем время хранения и максимальный объем для логов
const requestTransport = new winston.transports.DailyRotateFile({
  filename: 'request-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

/**
 * Пишет логи запросов в файл
 */
export const requestLoggerMiddleware = expressWinston.logger({
  transports: [
    requestTransport,
  ],
  format: winston.format.json(),
});

/**
 * Пишет логи ошибок в файл
 */
export const errorLoggerMiddleware = expressWinston.errorLogger({
  transports: [
    errorTransport,
  ],
  format: winston.format.json(),
});
