import Notification from '../models/Notification';
import { INotification } from '../types/interfaces/INotification';
import { emitUnreadCountToUser } from '../startUps/socketServer';
import logger from '../utils/logger';

export const createNotification = async (notificationData: INotification) => {
  const notification = new Notification(notificationData);
  const savedNotification = await notification.save();
  
  // Update unread count for the user
  await emitUnreadCountToUser(notificationData.user.toString());
  
  return savedNotification;
};

export const getUnreadNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId, read: false });
};

export const getNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId });
}

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  // Find notification that belongs to the user and update it
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  
  // Update unread count for the user
  if (notification) {
    await emitUnreadCountToUser(userId);
  }
  
  return notification;
};

export const markNotificationAsUnread = async (userId: string, notificationId: string) => {
  // Find notification that belongs to the user and update it
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: false },
    { new: true }
  );
  
  // Update unread count for the user
  if (notification) {
    await emitUnreadCountToUser(userId);
  }
  
  return notification;
};

export const updateNotificationById = async (userId: string, notificationId: string, updateData: Partial<INotification>) => {
  // Ensure we don't allow changing the user field
  if (updateData.user) {
    delete updateData.user;
  }
  
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    updateData,
    { new: true }
  );
};

export const deleteNotificationById = async (userId: string, notificationId: string) => {
  // Only delete notification if it belongs to the user
  return await Notification.findOneAndDelete({ _id: notificationId, user: userId });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const result = await Notification.updateMany({ user: userId, read: false }, { read: true });
  
  // Update unread count for the user
  await emitUnreadCountToUser(userId);
  
  return result;
};

export const markAllNotificationsAsUnread = async (userId: string) => {
  const result = await Notification.updateMany({ user: userId, read: true }, { read: false });
  
  // Update unread count for the user
  await emitUnreadCountToUser(userId);
  
  return result;
};

export const deleteAllNotifications = async (userId: string) => {
  const result = await Notification.deleteMany({ user: userId });
  
  // Update unread count for the user
  await emitUnreadCountToUser(userId);
  
  return result;
};

/**
 * Calculate the count of unread notifications for a user
 * 
 * @param userId User ID
 * @returns Count of unread notifications
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const count = await Notification.countDocuments({ user: userId, read: false });
    return count;
  } catch (error) {
    logger.error(`Error counting unread notifications for user ${userId}:`, error);
    return 0;
  }
};

export default {
  createNotification,
  getUnreadNotificationsByUser,
  getNotificationsByUser,
  markNotificationAsRead,
  markNotificationAsUnread,
  updateNotificationById,
  deleteNotificationById,
  markAllNotificationsAsRead,
  markAllNotificationsAsUnread,
  deleteAllNotifications,
  getUnreadCount
};