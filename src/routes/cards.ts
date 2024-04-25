import { Router } from 'express';
import {
  getCards, createCard, createCardInputRules, deleteCardById, likeCardById, dislikeCardById,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCardInputRules, createCard);
router.put('/:id/likes', likeCardById);
router.delete('/:id/likes', dislikeCardById);
router.delete('/:id', deleteCardById);

export default router;
