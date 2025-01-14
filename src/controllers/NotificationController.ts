import { Request, Response } from 'express';
import * as NotificationService from '../services/NotificationService';
import { validateNotificationInput } from '../helpers/validators/NotificationValidator';

export const createNotification = async (req: Request, res: Response) => {
  const { error } = validateNotificationInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const notification = await NotificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const notifications = await NotificationService.getUnreadNotificationsByUser(req.params.userId);
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

export const updateNotificationById = async (req: Request, res: Response) => {
  const { error } = validateNotificationInput(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const notification = await NotificationService.updateNotificationById(req.params.notificationId, req.body);
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