import { Router } from 'express';
import * as FeedbackController from '../controllers/FeedbackController';
import { isAuth, isAdminAuth } from '../middleware/isAuth';

const router = Router();

// Regular user routes - protected by standard auth
router.post('/', isAuth, FeedbackController.createFeedback);
router.get('/me', isAuth, FeedbackController.getFeedbacksByUser);
router.get('/:feedbackId', isAuth, FeedbackController.getFeedbackById);
router.patch('/:feedbackId', isAuth, FeedbackController.updateFeedback);
router.delete('/:feedbackId', isAuth, FeedbackController.deleteFeedback);

// Admin routes - protected by admin auth
router.get('/admin/all', isAdminAuth, FeedbackController.adminGetAllFeedbacks);
router.get('/admin/statistics', isAdminAuth, FeedbackController.adminGetFeedbackStatistics);
router.get('/admin/feedback/:feedbackId', isAdminAuth, FeedbackController.adminGetFeedbackById);
router.patch('/admin/feedback/:feedbackId', isAdminAuth, FeedbackController.adminUpdateFeedback);
router.delete('/admin/feedback/:feedbackId', isAdminAuth, FeedbackController.adminDeleteFeedback);

export default router;
