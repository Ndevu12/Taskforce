import { Router } from 'express';
import userRoutes from './UserRoutes';
import transactionRoutes from './TransactionRoutes';
import subCategoryRoutes from './SubCategoryRoutes';
import reportRoutes from './ReportRoutes';
import notificationRoutes from './NotificationRoutes';
import categoryRoutes from './CategoryRoutes';
import budgetRoutes from './BudgetRoutes';
import accountRoutes from './AccountRoutes';
import authRoutes from './AuthRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/subcategories', subCategoryRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/accounts', accountRoutes);
router.use('/auth', authRoutes);
export default router;