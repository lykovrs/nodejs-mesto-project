import { Router } from 'express';

import usersRouter from './users';
import cardsRouter from './cards';
import {
  createUser,
  login,
  loginInputRules,
  createUserInputRules,
  logout,
  logoutRules,
} from '../controllers/users';
import { authMiddleware, notFound } from '../middlewares';

const router = Router();
// не авторизованная зона
router.post('/signin', loginInputRules, login);
router.post('/signup', createUserInputRules, createUser);
// зона под авторизацией
router.use(authMiddleware);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.post('/signout', logoutRules, logout);
// обработка роутов, которые нигде не обработаны выше
router.use(notFound);

export default router;
