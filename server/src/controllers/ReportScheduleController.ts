import { Request, Response } from 'express';
import * as ReportScheduleService from '../services/ReportScheduleService';
import logger from '../utils/logger';
import { validateScheduleReportInput } from '../helpers/validators/ReportValidator';

export const createReportSchedule = async (req: Request, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: 'User not authorized' });

    const { error } = await validateScheduleReportInput(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    const { startDate, endDate, type, title } = req.body;
    if (req.userId) {
      await ReportScheduleService.createReportSchedule({
        user: req.userId,
        type,
        title,
        startDate,
        endDate
      });
      res.status(201).json({ message: 'Report schedule created successfully' });
    } else {
      logger.error('User not authorized.');
      return res.status(401).json({ error: 'User not authorized' });
    }
  } catch (error: any) {
    logger.error('createReportSchedule error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getReportSchedulesByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const schedules = await ReportScheduleService.getReportSchedulesByUser(userId);
    res.status(200).json(schedules);
  } catch (error: any) {
    logger.error('getReportSchedulesByUser error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getReportScheduleById = async (req: Request, res: Response) => {
  try {
    const schedule = await ReportScheduleService.getReportScheduleById(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.status(200).json(schedule);
  } catch (error: any) {
    logger.error('getReportScheduleById error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateReportScheduleById = async (req: Request, res: Response) => {
  try {
    const schedule = await ReportScheduleService.updateReportScheduleById(req.params.scheduleId, req.body);
    if (!schedule) {
      logger.error(`Schedule not found with ID: ${req.params.scheduleId}`);
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (error: any) {
    logger.error(`updateReportScheduleById error: ${error.message}`, error);
    res.status(500).json({ error: 'Failed to update report schedule. Please try again later.' });
  }
};

export const deleteReportScheduleById = async (req: Request, res: Response) => {
  try {
    const schedule = await ReportScheduleService.deleteReportScheduleById(req.params.scheduleId);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.status(204).end();
  } catch (error: any) {
    logger.error('deleteReportScheduleById error:', error);
    res.status(500).json({ error: error.message });
  }
};
