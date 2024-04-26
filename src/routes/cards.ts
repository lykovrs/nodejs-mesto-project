import { Router } from 'express';
import {
  getCards, createCard, createCardInputRules, deleteCardById, likeCardById, dislikeCardById,
} from '../controllers/cards';
import { idValidationRules } from '../controllers/constants';

const router = Router();

router.get('/', getCards);
router.post('/', createCardInputRules, createCard);
router.put('/:id/likes', idValidationRules, likeCardById);
router.delete('/:id/likes', idValidationRules, dislikeCardById);
router.delete('/:id', idValidationRules, deleteCardById);

export default router;
