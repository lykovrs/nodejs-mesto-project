import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import 'dotenv/config';

import { ServerError } from './errors';

import { AuthContext } from './types';
import router from './routes';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// временное решение авторизации
app.use((req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: '662400bb4c6cb77df106e063', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', router);

app.use(express.static(path.join(__dirname, 'public')));

app.use((err: ServerError, req: unknown, res: Response) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.get('*', (req, res) => res.send('Page Not found 404'));

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
