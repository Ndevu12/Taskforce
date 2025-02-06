import { Request, Response } from 'express';
import * as NotificationService from '../services/NotificationService';
import { validateNotificationInput, validateNotificationUpdateInput } from '../helpers/validators/NotificationValidator';


export const getUnreadNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authorized' });

    const notifications = await NotificationService.getUnreadNotificationsByUser(userId);
    res.status(200).json(notifications);
  } catch (error: any) {
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
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.markNotificationAsRead(req.params.notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotificationById = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.deleteNotificationById(req.params.notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    await NotificationService.markAllNotificationsAsRead(req.params.userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};