import { Request, Response } from 'express';
import * as ReportService from '../services/ReportService';
import { validateReportInput } from '../helpers/validators/ReportValidator';
import logger from '../utils/logger';

export const createReport = async (req: Request, res: Response) => {
  const { error } = validateReportInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { type, startDate, endDate } = req.body;
    if (req.userId) {
    const reportData = await ReportService.generateReport({
      user: req.userId,
      type,
      startDate,
      endDate,
      data: {}
    });
    res.status(201).json(reportData);
  } else {
    logger.error('User not authorized.');
    return res.status(401).json({ error: 'User not authorized' });
  }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportsByUser = async (req: Request, res: Response) => {
  try {
    const reports = await ReportService.getReportsByUser(req.params.userId);
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReportById = async (req: Request, res: Response) => {
  const { error } = validateReportInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const report = await ReportService.updateReportById(req.params.reportId, req.body);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReportById = async (req: Request, res: Response) => {
  try {
    const report = await ReportService.deleteReportById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const autoGenerateReports = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const reports = await ReportService.autoGenerateReports(userId);
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
