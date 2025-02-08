import { Request, Response } from 'express';
import Notification from '../models/Notification';
import * as NotificationService from '../services/NotificationService';
import { emitUnreadCountToUser, emitUnseenCountToUser } from '../startUps/socketServer';
import logger from '../utils/logger';
import { isValidObjectId } from '../utils/validationUtils';

/**
 * Get all notifications for the authenticated user
 */
export const getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

/**
 * Get unread notifications for the authenticated user
 */
export const getUnreadNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const notifications = await Notification.find({ user: userId, read: false })
      .sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread notifications', error });
  }
};

/**
 * Get unseen notifications for the authenticated user
 */
export const getUnseenNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const notifications = await Notification.find({ user: userId, seen: false })
      .sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unseen notifications', error });
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    // Update unread count for the user
    if (userId) {
          if (userId) {
              await emitUnreadCountToUser(userId.toString());
          }
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

/**
 * Mark a notification as unread
 */
export const markNotificationAsUnread = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    if (!isValidObjectId(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }
    const userId = req.user?._id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: false },
      { new: true }
    );
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    res.status(200).json(notification);
  } catch (error) {
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
    if (!isValidObjectId(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }
    if (!userId || !isValidObjectId(userId.toString())) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    
    const notification = await NotificationService.markAsSeen(notificationId, userId.toString());
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as seen', error });
  }
};

/**
 * Mark all notifications as read for the user
 */
export const markAllNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error });
  }
};

/**
 * Mark all notifications as unread for the user
 */
export const markAllNotificationsAsUnread = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    await Notification.updateMany(
      { user: userId },
      { read: false }
    );
    
    res.status(200).json({ message: 'All notifications marked as unread' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as unread', error });
  }
};

/**
 * Mark all notifications as seen for the user
 */
export const markAllNotificationsAsSeen = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (userId) {
      await NotificationService.markAllAsSeen(userId.toString());
    } else {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }
    
    res.status(200).json({ message: 'All notifications marked as seen' });
  } catch (error) {
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
    
    const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

/**
 * Delete all notifications for the user
 */
export const deleteAllNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    await Notification.deleteMany({ user: userId });
    
    if (userId) {
      await emitUnseenCountToUser(userId.toString());
    }
    
    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all notifications', error });
  }
};