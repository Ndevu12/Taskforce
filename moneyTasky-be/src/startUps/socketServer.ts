import { Server } from 'socket.io';
import http from 'http';
import { configureSocketServer, joinUserRoom, SOCKET_EVENTS } from '../config/realTimeConfig/socketConfig';
import * as NotificationService from '../services/NotificationService';
import logger from '../utils/logger';

// Initialize io as null and it will be assigned properly in initializeSocketServer
let io: Server | null = null;

/**
 * Initialize socket server and set up event handlers
 * 
 * @param server HTTP server instance
 * @returns Configured Socket.IO server
 */
export const initializeSocketServer = (server: http.Server): Server => {
  io = configureSocketServer(server);

  io.on('connection', async (socket) => {
    const userId = socket.data.userId;
    
    if (!userId) {
      logger.warn('Socket connected without user ID');
      socket.disconnect();
      return;
    }

    logger.info(`Socket connected for user`);

    // Add socket to user-specific room
    joinUserRoom(socket, userId);

    // Send ready event to client
    socket.emit(SOCKET_EVENTS.READY);

    // Handle request for unread notification count
    socket.on(SOCKET_EVENTS.REQUEST_UNREAD_COUNT, async () => {
      try {
        const count = await NotificationService.getUnreadCount(userId);
        socket.emit(SOCKET_EVENTS.UNREAD_COUNT, { count });
      } catch (error) {
        logger.error(`Error getting unread count for user:`, error);
      }
    });

    // Handle request for unseen notification count
    socket.on(SOCKET_EVENTS.REQUEST_UNSEEN_COUNT, async () => {
      try {
        const count = await NotificationService.getUnseenCount(userId);
        socket.emit(SOCKET_EVENTS.UNSEEN_COUNT, { count });
      } catch (error) {
        logger.error(`Error getting unseen count for user:`, error);
      }
    });

    // Handle mark notifications as seen
    socket.on(SOCKET_EVENTS.MARK_AS_SEEN, async () => {
      try {
        await NotificationService.markAllAsSeen(userId);
        const unseenCount = await NotificationService.getUnseenCount(userId);
        socket.emit(SOCKET_EVENTS.UNSEEN_COUNT, { count: unseenCount });
      } catch (error) {
        logger.error(`Error marking notifications as seen for user:`, error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected for user`);
    });
  });

  return io;
};

/**
 * Get the Socket.IO server instance
 * Throws an error if called before initialization
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initializeSocketServer first.');
  }
  return io;
};

/**
 * Emit event to a specific user's room
 * 
 * @param userId User ID
 * @param event Event name
 * @param data Event data
 */
export const emitToUser = (userId: string, event: string, data: any): void => {
  if (!io) {
    logger.warn('Socket server not initialized');
    return;
  }

  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit an unread notification count update to a user
 * 
 * @param userId User ID
 */
export const emitUnreadCountToUser = async (userId: string): Promise<void> => {
  try {
    const count = await NotificationService.getUnreadCount(userId);
    emitToUser(userId, SOCKET_EVENTS.UNREAD_COUNT, { count });
  } catch (error) {
    logger.error(`Error emitting unread count for user:`, error);
  }
};

/**
 * Emit an unseen notification count update to a user
 * 
 * @param userId User ID
 */
export const emitUnseenCountToUser = async (userId: string): Promise<void> => {
  try {
    const count = await NotificationService.getUnseenCount(userId);
    emitToUser(userId, SOCKET_EVENTS.UNSEEN_COUNT, { count });
  } catch (error) {
    logger.error(`Error emitting unseen count for user:`, error);
  }
};

export { io };
export default { 
  initializeSocketServer, 
  getIO, 
  emitToUser, 
  emitUnreadCountToUser,
  emitUnseenCountToUser 
};
