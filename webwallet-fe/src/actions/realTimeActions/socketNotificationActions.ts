import socketManager from '../../utils/realTimeInfo/socketConfig';

// Type definition for unread count callback
type UnreadCountCallback = (count: number) => void;

// Event names constants - keeping only what's needed for unread counts
const EVENTS = {
  UNREAD_COUNT: 'unreadNotificationCount',
  REQUEST_UNREAD_COUNT: 'getUnreadNotificationCount',
  READY: 'ready',
};

/**
 * Initialize socket connection
 */
export const initNotificationSocket = (): void => {
  socketManager.connect();
};

/**
 * Disconnect socket
 */
export const disconnectNotificationSocket = (): void => {
  socketManager.disconnect();
};

/**
 * Subscribe to the ready event
 * @param callback Function to call when the socket is ready
 */
export const subscribeToReadyEvent = (callback: () => void): void => {
  socketManager.subscribe(EVENTS.READY, callback);
};

/**
 * Subscribe to unread notification count updates
 * @param callback Function to call when unread count changes
 */
export const subscribeToUnreadCount = (callback: UnreadCountCallback): void => {
  socketManager.subscribe(EVENTS.UNREAD_COUNT, (data: { count: number }) => {
    callback(data.count);
  });
};

/**
 * Request the current unread notification count
 */
export const requestUnreadCount = (): void => {
  socketManager.emit(EVENTS.REQUEST_UNREAD_COUNT);
};

/**
 * Unsubscribe from ready event
 */
export const unsubscribeFromReadyEvent = (): void => {
  socketManager.unsubscribe(EVENTS.READY);
};

/**
 * Unsubscribe from unread count updates
 */
export const unsubscribeFromUnreadCount = (): void => {
  socketManager.unsubscribe(EVENTS.UNREAD_COUNT);
};

/**
 * Unsubscribe from all notification events
 */
export const unsubscribeFromAllNotifications = (): void => {
  unsubscribeFromReadyEvent();
  unsubscribeFromUnreadCount();
};
