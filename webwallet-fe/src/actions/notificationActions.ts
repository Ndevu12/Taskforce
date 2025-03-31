import axios from 'axios';
import { Notification } from '../types/interfaces/Notification';
import { getAuthHeaders } from './APIHeader';

const BASE_URL = import.meta.env.VITE_BASE_URL as string;
if (!BASE_URL) {
  throw new Error('VITE_BASE_URL is not defined');
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications/user`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification | null> => {
  try {
    // Validate notification ID
    if (!notificationId || notificationId === 'undefined') {
      console.error('Invalid notification ID provided for marking as read');
      return null;
    }

    const response = await axios.put(
      `${BASE_URL}/notifications/${notificationId}/read`, 
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

/**
 * Mark a single notification as unread
 */
export const markNotificationAsUnread = async (notificationId: string): Promise<Notification | null> => {
  try {
    // Validate notification ID
    if (!notificationId || notificationId === 'undefined') {
      console.error('Invalid notification ID provided for marking as unread');
      return null;
    }

    const response = await axios.put(
      `${BASE_URL}/notifications/${notificationId}/unread`, 
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as unread:', error);
    return null;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    await axios.put(
      `${BASE_URL}/notifications/read-all`,
      {},
      getAuthHeaders()
    );
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as unread
 */
export const markAllNotificationsAsUnread = async (): Promise<boolean> => {
  try {
    await axios.put(
      `${BASE_URL}/notifications/unread-all`,
      {},
      getAuthHeaders()
    );
    return true;
  } catch (error) {
    console.error('Error marking all notifications as unread:', error);
    return false;
  }
};

/**
 * Delete a single notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    // Validate notification ID
    if (!notificationId || notificationId === 'undefined') {
      console.error('Invalid notification ID provided for deletion');
      return false;
    }

    await axios.delete(
      `${BASE_URL}/notifications/${notificationId}`,
      getAuthHeaders()
    );
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = async (): Promise<boolean> => {
  try {
    await axios.delete(
      `${BASE_URL}/notifications/all/for-user`,
      getAuthHeaders()
    );
    return true;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return false;
  }
};