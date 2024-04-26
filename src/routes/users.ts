import { Router } from 'express';

import {
  getUsers,
  createUser,
  getUserById,
  updateCurrentUser,
  updateCurrentUserInputRules,
  updateCurrentUserAvatar,
  updateCurrentUserAvatarRules,
  getCurrentUser,
  createUserInputRules,
} from '../controllers/users';
import { idValidationRules } from '../controllers/constants';

const router = Router();

router.get('/', getUsers);
router.post('/', createUserInputRules, createUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUserInputRules, updateCurrentUser);
router.patch('/me/avatar', updateCurrentUserAvatarRules, updateCurrentUserAvatar);
router.get('/:id', idValidationRules, getUserById);

export default router;
