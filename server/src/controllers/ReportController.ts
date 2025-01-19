import { Request, Response } from 'express';
import * as ReportService from '../services/ReportService';
import logger from '../utils/logger';
import * as UserService from '../services/UserService';
import * as ScheduleService from '../services/ReportScheduleService';
import mongoose from 'mongoose';

export const getReportsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const reports = await ReportService.getReportsByUser(userId);
    res.status(200).json(reports);
  } catch (error: any) {
    logger.error('getReportsByUser error:', error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteReportById = async (req: Request, res: Response) => {
  try {
    const report = await ReportService.deleteReportById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(204).end();
  } catch (error: any) {
    logger.error('deleteReportById error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const autoGenerateReports = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const scheduleId = req.params.scheduleId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const user = await UserService.findUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!scheduleId) return res.status(400).json({ error: 'Schedule ID is required' });
    const schedule = await ScheduleService.getReportScheduleById(scheduleId);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    const reports = await ReportService.autoGenerateReports(user._id as unknown as mongoose.Schema.Types.ObjectId, schedule._id as unknown as mongoose.Schema.Types.ObjectId, schedule.type);
    if ('error' in reports) return res.status(400).json({ error: reports.error });
    
    res.status(200).json(reports);
  } catch (error: any) {
    logger.error('autoGenerateReports error:', error);
    res.status(500).json({ error: error.message });
  }
};
