import { Request, Response } from 'express';
import * as NotificationService from '../services/NotificationService';
import logger from '../utils/logger';
import { isValidObjectId } from '../utils/validationUtils';

/**
 * Get all notifications for the authenticated user
 */
export const getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const notifications = await NotificationService.getNotificationsByUser(userId.toString());
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

/**
 * Get unread notifications for the authenticated user
 */
export const getUnreadNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const notifications = await NotificationService.getUnreadNotificationsByUser(userId.toString());
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('Error fetching unread notifications:', error);
    res.status(500).json({ message: 'Error fetching unread notifications', error });
  }
};

/**
 * Get unseen notifications for the authenticated user
 */
export const getUnseenNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const count = await NotificationService.getUnseenCount(userId.toString());
    res.status(200).json({ count });
  } catch (error) {
    logger.error('Error fetching unseen notifications count:', error);
    res.status(500).json({ message: 'Error fetching unseen notifications count', error });
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    
    if (!userId || !isValidObjectId(userId.toString())) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    if (!isValidObjectId(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }
    
    const notification = await NotificationService.markNotificationAsRead(userId.toString(), notificationId);
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    res.status(200).json(notification);
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

/**
 * Mark a notification as unread
 */
export const markNotificationAsUnread = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    
    if (!userId || !isValidObjectId(userId.toString())) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    if (!isValidObjectId(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }
    
    const notification = await NotificationService.markNotificationAsUnread(userId.toString(), notificationId);
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    res.status(200).json(notification);
  } catch (error) {
    logger.error('Error marking notification as unread:', error);
    res.status(500).json({ message: 'Error marking notification as unread', error });
  }
};

/**
 * Mark a notification as seen
 */
export const markNotificationAsSeen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    
    if (!userId || !isValidObjectId(userId.toString())) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    if (!isValidObjectId(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }
    
    const notification = await NotificationService.markAsSeen(notificationId, userId.toString());
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    res.status(200).json(notification);
  } catch (error) {
    logger.error('Error marking notification as seen:', error);
    res.status(500).json({ message: 'Error marking notification as seen', error });
  }
};

/**
 * Mark all notifications as read for the user
 */
export const markAllNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const result = await NotificationService.markAllNotificationsAsRead(userId.toString());
    res.status(200).json({ message: 'All notifications marked as read', count: result.modifiedCount });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read', error });
  }
};

/**
 * Mark all notifications as unread for the user
 */
export const markAllNotificationsAsUnread = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const result = await NotificationService.markAllNotificationsAsUnread(userId.toString());
    res.status(200).json({ message: 'All notifications marked as unread', count: result.modifiedCount });
  } catch (error) {
    logger.error('Error marking all notifications as unread:', error);
    res.status(500).json({ message: 'Error marking all notifications as unread', error });
  }
};

/**
 * Mark all notifications as seen for the user
 */
export const markAllNotificationsAsSeen = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    await NotificationService.markAllAsSeen(userId.toString());
    res.status(200).json({ message: 'All notifications marked as seen' });
  } catch (error) {
    logger.error('Error marking all notifications as seen:', error);
    res.status(500).json({ message: 'Error marking all notifications as seen', error });
  }
};

/**
 * Delete a notification
 */
export const deleteNotificationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    if (!isValidObjectId(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }
    
    const result = await NotificationService.deleteNotificationById(userId.toString(), notificationId);
    
    if (!result) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

/**
 * Delete all notifications for the user
 */
export const deleteAllNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const result = await NotificationService.deleteAllNotifications(userId.toString());
    
    res.status(200).json({ 
      message: 'All notifications deleted successfully', 
      count: result.deletedCount 
    });
  } catch (error) {
    logger.error('Error deleting all notifications:', error);
    res.status(500).json({ message: 'Error deleting all notifications', error });
  }
};
