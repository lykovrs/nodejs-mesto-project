import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { ServerError } from './errors';
import { usersRouter, cardsRouter } from './routes';
import { AuthContext } from './types';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb').then(() => {
  console.info('🍀 Подключение к БД прошло успешно 🍀');
}, () => {
  console.error('💩 При подключении к БД что-то пошло не так 💩');
});

// временное решение авторизации
app.use((req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: '662400bb4c6cb77df106e069', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

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

app.listen(PORT, () => {
  console.info('🏆 Сервер успешно запущен на порту: ', PORT, ' 🏆');
});
