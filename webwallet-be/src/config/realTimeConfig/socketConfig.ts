import { Server, Socket } from 'socket.io';
import http from 'http';
import { verifyToken } from '../../helpers/jwtTokenManager';
import logger from '../../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
  throw new Error('CLIENT_URL is not defined in environment variables');
}

// Define socket authentication interface
interface SocketUser {
  userId: string;
  email?: string;
  id: string;
}

/**
 * Configure and create Socket.IO server
 * 
 * @param server HTTP server instance
 * @returns Configured Socket.IO server
 */
export const configureSocketServer = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      logger.warn('Socket connection attempt without token');
      return next(new Error('Authentication token is required'));
    }

    try {
      // Use the predefined token validator
      const decoded = await verifyToken(token);
      if (!decoded) {
        logger.warn('Socket connection attempt with invalid token');
        return next(new Error('Authentication failed - invalid token'));
      }
      
      // Extract user ID from decoded token
      const user = decoded as SocketUser;
      socket.data.userId = user.userId;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  return io;
};

/**
 * Add a socket to a user-specific room
 * 
 * @param socket The socket instance
 * @param userId User ID
 */
export const joinUserRoom = (socket: Socket, userId: string): void => {
  const roomName = `user:${userId}`;
  socket.join(roomName);
};

/**
 * Event names used throughout the application
 */
export const SOCKET_EVENTS = {
  NOTIFICATION: 'notification',
  UNREAD_COUNT: 'unreadNotificationCount',
  REQUEST_UNREAD_COUNT: 'getUnreadNotificationCount',
  READY: 'ready'
};

export default { configureSocketServer, joinUserRoom, SOCKET_EVENTS };
