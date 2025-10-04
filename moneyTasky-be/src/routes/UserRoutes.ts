import { Router } from 'express';
import * as UserController from '../controllers/UserController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.get('/:userId', isAuth, UserController.getUserById);
router.put('/:userId', isAuth, UserController.updateUserById);
router.delete('/:userId', isAuth, UserController.deleteUserById);

export default router;
