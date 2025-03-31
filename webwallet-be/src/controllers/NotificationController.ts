import { Request, Response } from 'express';
import * as NotificationService from '../services/NotificationService';
import logger from '../utils/logger';
import { isValidObjectId } from '../utils/validationUtils';


export const getUnreadNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const notifications = await NotificationService.getUnreadNotificationsByUser(userId);
    res.status(200).json(notifications);
  } catch (error: any) {
    logger.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const notifications = await NotificationService.getNotificationsByUser(userId);
    res.status(200).json(notifications);
  } catch (error: any) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.notificationId;
    
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    if (!notificationId) return res.status(400).json({ error: 'Notification ID is required' });
    
    // Validate MongoDB ObjectId
    if (!isValidObjectId(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    // Check if notification exists and belongs to user
    const notification = await NotificationService.markNotificationAsRead(userId, notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or does not belong to you' });
    }
    
    res.status(200).json(notification);
  } catch (error: any) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsUnread = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.notificationId;
    
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    if (!notificationId) return res.status(400).json({ error: 'Notification ID is required' });
    
    // Validate MongoDB ObjectId
    if (!isValidObjectId(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    // Check if notification exists and belongs to user
    const notification = await NotificationService.markNotificationAsUnread(userId, notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or does not belong to you' });
    }
    
    res.status(200).json(notification);
  } catch (error: any) {
    logger.error('Error marking notification as unread:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotificationById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.notificationId;
    
    if (!userId) return res.status(401).json({ error: 'User not authorized' });
    if (!notificationId) return res.status(400).json({ error: 'Notification ID is required' });
    
    // Validate MongoDB ObjectId
    if (!isValidObjectId(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    // Check if notification exists and belongs to user
    const notification = await NotificationService.deleteNotificationById(userId, notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or does not belong to you' });
    }
    
    res.status(204).end();
  } catch (error: any) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    await NotificationService.markAllNotificationsAsRead(userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markAllNotificationsAsUnread = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    await NotificationService.markAllNotificationsAsUnread(userId);
    res.status(200).json({ message: 'All notifications marked as unread' });
  } catch (error: any) {
    logger.error('Error marking all notifications as unread:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    await NotificationService.deleteAllNotifications(userId);
    res.status(200).json({ message: 'All notifications deleted' });
  } catch (error: any) {
    logger.error('Error deleting all notifications:', error);
    res.status(500).json({ error: error.message });
  }
};