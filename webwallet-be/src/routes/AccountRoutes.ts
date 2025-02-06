import { Router } from 'express';
import * as AccountController from '../controllers/AccountController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, AccountController.createAccount);
router.get('/user', isAuth, AccountController.getAccountsByUser);
router.put('/:accountId/balance', isAuth, AccountController.updateAccountBalance);
router.put('/:accountId', isAuth, AccountController.updateAccountById);
router.delete('/:accountId', isAuth, AccountController.deleteAccountById);

export default router;