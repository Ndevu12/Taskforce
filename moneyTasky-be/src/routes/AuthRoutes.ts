import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import { validateLogin } from '../middleware/validators';
import * as UserController from '../controllers/UserController';

const router = Router();

router.post('/', UserController.createUser);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

// Verification routes
router.get('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification', AuthController.resendVerificationEmail);

// Password reset routes
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);

export default router;
