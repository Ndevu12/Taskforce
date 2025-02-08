import { Router } from 'express';
import * as NotificationController from '../controllers/NotificationController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

// Get notifications routes
router.get('/user', isAuth, NotificationController.getNotificationsByUser);
router.get('/user/unread', isAuth, NotificationController.getUnreadNotificationsByUser);
router.get('/user/unseen', isAuth, NotificationController.getUnseenNotificationsByUser);

// Individual notification actions
router.put('/:notificationId/read', isAuth, NotificationController.markNotificationAsRead);
router.put('/:notificationId/unread', isAuth, NotificationController.markNotificationAsUnread);
router.put('/:notificationId/seen', isAuth, NotificationController.markNotificationAsSeen);
router.delete('/:notificationId', isAuth, NotificationController.deleteNotificationById);

// Bulk notification actions
router.put('/read-all', isAuth, NotificationController.markAllNotificationsAsRead);
router.put('/unread-all', isAuth, NotificationController.markAllNotificationsAsUnread);
router.put('/seen-all', isAuth, NotificationController.markAllNotificationsAsSeen);
router.delete('/all/for-user', isAuth, NotificationController.deleteAllNotifications);

export default router;