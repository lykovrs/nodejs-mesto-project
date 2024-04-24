import { Router } from 'express';
import {
  getCards, createCard, deleteCardById, likeCardById, dislikeCardById,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.put('/:id/likes', likeCardById);
router.delete('/:id/likes', dislikeCardById);
router.delete('/:id', deleteCardById);

export default router;
