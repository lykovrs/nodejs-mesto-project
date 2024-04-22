import { Router } from 'express';
import {
  getUsers, createUser, getUserById, updateMe, updateMyAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/me', updateMe);
router.patch('/me/avatar', updateMyAvatar);

export default router;
