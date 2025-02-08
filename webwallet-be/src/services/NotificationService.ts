import Notification from '../models/Notification';
import { INotification } from '../types/interfaces/INotification';
import { emitUnreadCountToUser, emitUnseenCountToUser } from '../startUps/socketServer';
import logger from '../utils/logger';

  /**
   * Get unread notification count for a user
   * @param userId The user ID
   * @returns The count of unread notifications
   */
  export const getUnreadCount =async(userId: string): Promise<number> =>{
    return await Notification.countDocuments({ user: userId, read: false });
  }

  /**
   * Get unseen notification count for a user
   * @param userId The user ID
   * @returns The count of unseen notifications
   */
  export const getUnseenCount = async(userId: string): Promise<number> => {
    return await Notification.countDocuments({ user: userId, seen: false });
  }

  /**
   * Mark all notifications as seen for a user
   * @param userId The user ID
   */
  export const markAllAsSeen = async(userId: string): Promise<void> => {
    await Notification.updateMany(
      { user: userId, seen: false },
      { $set: { seen: true } }
    );
    
    // Update the unseen count
    await emitUnseenCountToUser(userId);
  }

  /**
   * Mark a notification as seen
   * @param notificationId The notification ID
   * @param userId The user ID (for validation)
   */
  export const markAsSeen = async(notificationId: string, userId: string): Promise<INotification | null> => {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { $set: { seen: true } },
      { new: true }
    );

    if (notification) {
      // Update the unseen count
      await emitUnseenCountToUser(userId);
    }
    
    return notification;
  }



export const createNotification = async (notificationData: INotification) => {
  const notification = new Notification(notificationData);
  const savedNotification = await notification.save();
  
  // Update unread and unseen count for the user
  await emitUnreadCountToUser(notificationData.user.toString());
  await emitUnseenCountToUser(notificationData.user.toString());
  
  return savedNotification;
};

export const getUnreadNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId, read: false });
};

export const getNotificationsByUser = async (userId: string) => {
  return await Notification.find({ user: userId });
}

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
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
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: false },
    { new: true }
  );
  
  if (notification) {
    await emitUnreadCountToUser(userId);
  }
  
  return notification;
};

export const updateNotificationById = async (userId: string, notificationId: string, updateData: Partial<INotification>) => {
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
  return await Notification.findOneAndDelete({ _id: notificationId, user: userId });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const result = await Notification.updateMany({ user: userId, read: false }, { read: true });
  
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