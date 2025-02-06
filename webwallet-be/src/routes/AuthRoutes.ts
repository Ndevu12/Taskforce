import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import { validateLogin } from '../middleware/validators';
import * as UserController from '../controllers/UserController';

const router = Router();

router.post('/', UserController.createUser);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
