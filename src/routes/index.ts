import { Router } from 'express';

import usersRouter from './users';
import cardsRouter from './cards';
import { createUser, login } from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();
// не авторизованная зона
router.post('/signin', login);
router.post('/signup', createUser);
// зона под авторизацией
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
