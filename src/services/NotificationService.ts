import Notification from '../models/Notification';
import { INotification } from '../types/interfaces/INotification';

export const createNotification = async (notificationData: INotification) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};

export const getUnreadNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId, read: false });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};

export const updateNotificationById = async (notificationId: string, updateData: Partial<INotification>) => {
  return await Notification.findByIdAndUpdate(notificationId, updateData, { new: true });
};

export const deleteNotificationById = async (notificationId: string) => {
  return await Notification.findByIdAndDelete(notificationId);
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return await Notification.updateMany({ user: userId, read: false }, { read: true });
};