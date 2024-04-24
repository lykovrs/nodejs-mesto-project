import { Router } from 'express';

import usersRouter from './users';
import cardsRouter from './cards';
import { createUser, login } from '../controllers/users';

const router = Router();

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

export default router;
