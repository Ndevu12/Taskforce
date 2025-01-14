import { Router } from 'express';
import * as NotificationController from '../controllers/NotificationController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, NotificationController.createNotification);
router.get('/user/:userId/unread', isAuth, NotificationController.getUnreadNotificationsByUser);
router.put('/:notificationId/read', isAuth, NotificationController.markNotificationAsRead);
router.put('/:notificationId', isAuth, NotificationController.updateNotificationById);
router.delete('/:notificationId', isAuth, NotificationController.deleteNotificationById);
router.put('/user/:userId/read-all', isAuth, NotificationController.markAllNotificationsAsRead);

export default router;