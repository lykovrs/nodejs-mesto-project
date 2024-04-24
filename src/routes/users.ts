import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  updateCurrentUser,
  updateCurrentUserAvatar,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);
router.patch('/me/avatar', updateCurrentUserAvatar);
router.get('/:id', getUserById);

export default router;
