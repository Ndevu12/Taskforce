import { Socket } from 'socket.io';
import NotificationGatewayService from '../services/NotificationGatewayService';
import logger from '../utils/logger';

/**
 * Register socket event handlers
 * 
 * @param socket The socket instance
 */
export const registerSocketHandlers = (socket: Socket): void => {
  const userId = socket.data.userId;
  
  if (!userId) {
    logger.warn('Socket missing user ID');
    return;
  }
  
  // Handler for getting unread notification count
  socket.on('getUnreadNotificationCount', async () => {
    try {
      await NotificationGatewayService.updateUnreadCount(userId);
    } catch (error) {
      logger.error(`Error handling getUnreadNotificationCount for user ${userId}:`, error);
    }
  });
};
