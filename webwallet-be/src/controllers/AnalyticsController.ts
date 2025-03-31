import { Request, Response } from 'express';
import * as AnalyticsService from '../services/AnalyticsService';
import logger from '../utils/logger';
import mongoose from 'mongoose';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Always use the authenticated user ID for security
    const analytics = await AnalyticsService.getDashboardOverview(userId);
    
    res.status(200).json(analytics);
  } catch (error: any) {
    logger.error(`Error in getDashboardOverview: ${error.message}`);
    res.status(500).json({ error: 'Failed to get dashboard overview' });
  }
};

