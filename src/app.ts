import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import 'dotenv/config';

import { NotFoundError } from './errors';

import router from './routes';
import { errorMiddleware, errorLoggerMiddleware, requestLoggerMiddleware } from './middlewares';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

// парсер для работы с куками
app.use(cookieParser());
// парсим входящий json
app.use(express.json());
// парсим данные из урла
app.use(express.urlencoded({ extended: true }));
// логгируем запросы
app.use(requestLoggerMiddleware);
// отдаем статику из папки public
app.use(express.static(path.join(__dirname, 'public')));
// точка входа в роутинг
app.use('/', router);
// обработка роутов, которые нигде не обработаны выше
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
// логгируем ошибки
app.use(errorLoggerMiddleware);
// тут перехватываем ошибки, которые нигде не обработались
app.use(errorMiddleware);

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.info('🍀 Подключение к БД прошло успешно 🍀');
    await app.listen(PORT, () => {
      console.info('🏆 Сервер успешно запущен на порту: ', PORT, ' 🏆');
    });
  } catch (e) {
    console.error('💩 При инициализации приложения что-то пошло не так... 💩', e);
  }
};

connect();
