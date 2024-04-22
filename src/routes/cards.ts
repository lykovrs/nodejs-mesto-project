import { Router } from 'express';
import { getCards, createCard, deleteCardById } from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);

export default router;
