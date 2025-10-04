import express from 'express';
import * as AnalyticsController from '../controllers/AnalyticsController';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

/**
 * @route   GET /analytics/dashboard-overview
 * @desc    Get dashboard overview analytics
 * @access  Private
 */
router.get('/dashboard-overview', isAuth, AnalyticsController.getDashboardOverview);

export default router;
