import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import { validateLogin } from '../middleware/validators';

const router = Router();

router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
