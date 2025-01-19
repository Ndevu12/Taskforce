
import { Router } from 'express';
import * as MessageController from '../controllers/MessageController';

const router = Router();

router.post('/', MessageController.createMessage);

export default router;
