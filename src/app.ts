import express, { Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import ServerError from './errors/not-found-error';
import usersRouter from './routes/users';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://localhost:27017/mestodb').then(() => {
  console.info('🍀 Подключение к БД прошло успешно 🍀');
}, () => {
  console.error('💩 При подключении к БД что-то пошло не так 💩');
});

app.use('/users', usersRouter);

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
  console.info('🏆Сервер успешно запущен на порту', PORT, '🏆');
  // Если всё работает, консоль покажет, какой порт приложение слушает
});
