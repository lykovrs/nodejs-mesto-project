import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import 'dotenv/config';

import { NotFoundError, ServerError } from './errors';

import { AuthContext } from './types';
import router from './routes';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

// парсим входящий json
app.use(express.json());
// парсим данные из урла
app.use(express.urlencoded({ extended: true }));

// временное решение авторизации
app.use((req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: '662400bb4c6cb77df106e063', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// точка входа в роутинг
app.use('/', router);

// отдаем статику из папки public
app.use(express.static(path.join(__dirname, 'public')));

// обработка роутов, которые нигде не обработаны выше
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// тут перехватываем ошибки, которые нигде не обработались
app.use((err: ServerError, req: unknown, res: Response) => {
  // если ошибка не опознана, отправляем кастомную пятисотую
  if (!err.statusCode) {
    const customError = new ServerError();
    res
      .status(customError.statusCode)
      .send(customError.message);
  } else {
    res
      .status(err.statusCode)
      .send(err.message);
  }
});

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
