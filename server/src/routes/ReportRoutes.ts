import { Router } from 'express';
import * as ReportController from '../controllers/ReportController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.get('/user/:userId', isAuth, ReportController.getReportsByUser);
router.put('/:reportId', isAuth, ReportController.updateReportById);
router.delete('/:reportId', isAuth, ReportController.deleteReportById);
router.post('/auto-generate/:userId', isAuth, ReportController.autoGenerateReports);

export default router;