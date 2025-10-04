import { Router } from 'express';
import userRoutes from './UserRoutes';
import transactionRoutes from './TransactionRoutes';
import reportRoutes from './ReportRoutes';
import notificationRoutes from './NotificationRoutes';
import categoryRoutes from './CategoryRoutes';
import budgetRoutes from './BudgetRoutes';
import accountRoutes from './AccountRoutes';
import authRoutes from './AuthRoutes';
import subCategoryRoutes from './SubCategoryRoutes';
import messageRoutes from './MessageRoutes';
import analyticsRoutes from './analyticsRoutes';
import feedbackRoutes from './FeedbackRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subCategoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/accounts', accountRoutes);
router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/feedback', feedbackRoutes);

export default router;