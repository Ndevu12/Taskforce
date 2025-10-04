import { Router } from 'express';
import * as ReportController from '../controllers/ReportController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

/**
 * @route   GET /reports/user
 * @desc    Get all reports for the authenticated user
 * @access  Private
 */
router.get('/user', isAuth, ReportController.getReportsByUser);

/**
 * @route   DELETE /reports/:reportId
 * @desc    Delete a report by ID (with ownership check)
 * @access  Private
 */
router.delete('/:reportId', isAuth, ReportController.deleteReport);

/**
 * @route   GET /reports/analytics
 * @desc    Get analytics data for user's reports
 * @access  Private
 */
router.get('/analytics', isAuth, ReportController.getReportsAnalytics);

/**
 * @route   GET /reports/:reportId
 * @desc    Get a report by ID (with ownership check)
 * @access  Private
 */
router.get('/:reportId', isAuth, ReportController.getReportById);

export default router;