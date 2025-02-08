import socketManager from '../../utils/realTimeInfo/socketConfig';

// Type definition for notification count callback
type NotificationCountCallback = (count: number) => void;

// Event names constants
const EVENTS = {
  UNREAD_COUNT: 'unreadNotificationCount',
  UNSEEN_COUNT: 'unseenNotificationCount',
  REQUEST_UNREAD_COUNT: 'getUnreadNotificationCount',
  REQUEST_UNSEEN_COUNT: 'getUnseenNotificationCount',
  MARK_AS_SEEN: 'markNotificationsAsSeen',
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
export const subscribeToUnreadCount = (callback: NotificationCountCallback): void => {
  socketManager.subscribe(EVENTS.UNREAD_COUNT, (data: { count: number }) => {
    callback(data.count);
  });
};

/**
 * Subscribe to unseen notification count updates
 * @param callback Function to call when unseen count changes
 */
export const subscribeToUnseenCount = (callback: NotificationCountCallback): void => {
  socketManager.subscribe(EVENTS.UNSEEN_COUNT, (data: { count: number }) => {
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
 * Request the current unseen notification count
 */
export const requestUnseenCount = (): void => {
  socketManager.emit(EVENTS.REQUEST_UNSEEN_COUNT);
};

/**
 * Mark all notifications as seen
 */
export const markAllAsSeen = (): void => {
  socketManager.emit(EVENTS.MARK_AS_SEEN);
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
 * Unsubscribe from unseen count updates
 */
export const unsubscribeFromUnseenCount = (): void => {
  socketManager.unsubscribe(EVENTS.UNSEEN_COUNT);
};

/**
 * Unsubscribe from all notification events
 */
export const unsubscribeFromAllNotifications = (): void => {
  unsubscribeFromReadyEvent();
  unsubscribeFromUnreadCount();
  unsubscribeFromUnseenCount();
};
