import { Router } from 'express';
import * as TransactionController from '../controllers/TransactionController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, TransactionController.createTransaction);
router.get('/user', isAuth, TransactionController.getTransactionsByUser);
router.get('/summary/:userId', isAuth, TransactionController.getTransactionsSummary);
router.put('/:transactionId', isAuth, TransactionController.updateTransactionById);
router.delete('/:transactionId', isAuth, TransactionController.deleteTransactionById);

export default router;