import express from 'express';
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log('+++', PORT);
  // Если всё работает, консоль покажет, какой порт приложение слушает
});
