
import axios from 'axios';
import { Notification } from '../interfaces/Notification';
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