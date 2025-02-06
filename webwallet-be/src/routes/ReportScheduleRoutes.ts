
import { Router } from 'express';
import * as ReportScheduleController from '../controllers/ReportScheduleController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, ReportScheduleController.createReportSchedule);
router.get('/user', isAuth, ReportScheduleController.getReportSchedulesByUser);
router.get('/:scheduleId', isAuth, ReportScheduleController.getReportScheduleById);
router.put('/:scheduleId', isAuth, ReportScheduleController.updateReportScheduleById);
router.delete('/:scheduleId', isAuth, ReportScheduleController.deleteReportScheduleById);

export default router;