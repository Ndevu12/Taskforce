import { Request, Response } from 'express';
import * as ReportService from '../services/ReportService';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import * as UserService from '../services/UserService';
import { extractOwnerId } from '../utils/ownershipUtils';

/**
 * Get reports by user
 */
export const getReportsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const reports = await ReportService.getReportsByUser(userId);
    res.status(200).json(reports);
  } catch (error: any) {
    logger.error(`Error in getReportsByUser: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

/**
 * Get report details
 */
export const getReportById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const { reportId } = req.params;
    
    if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }
    
    const report = await ReportService.getReportById(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    try {
      const reportOwnerId = extractOwnerId(report);
      if (reportOwnerId !== userId) {
        logger.warn(`User ${userId} attempted to access report ${reportId} belonging to ${reportOwnerId}`);
        return res.status(403).json({ error: 'You do not have permission to access this report' });
      }
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
    
    res.status(200).json(report);
  } catch (error: any) {
    logger.error(`Error in getReportById: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

/**
 * Delete report
 */
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const { reportId } = req.params;
    
    if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }
    
    // Fetch report to verify ownership
    const report = await ReportService.getReportById(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Verify ownership using the extracted user ID
    try {
      const reportOwnerId = extractOwnerId(report);
      if (reportOwnerId !== userId) {
        logger.warn(`User ${userId} attempted to delete report ${reportId} belonging to ${reportOwnerId}`);
        return res.status(403).json({ error: 'You do not have permission to delete this report' });
      }
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message });
    }
    
    await ReportService.deleteReport(reportId);
    res.status(204).end();
  } catch (error: any) {
    logger.error(`Error in deleteReport: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};

/**
 * Get reports analytics
 */
export const getReportsAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    const analytics = await ReportService.getReportsAnalytics(userId);
    res.status(200).json(analytics);
  } catch (error: any) {
    logger.error(`Error in getReportsAnalytics: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch reports analytics' });
  }
};
