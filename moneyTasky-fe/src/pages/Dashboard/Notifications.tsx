import React, { useState, useEffect, useCallback } from 'react';
import NotificationList from '../../components/Notifications/NotificationList';
import NotificationActions from '../../components/Notifications/NotificationActions';
import { Notification } from '../../types/interfaces/Notification';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markAllNotificationsAsUnread,
  deleteAllNotifications,
} from '../../actions/notificationActions';
import { CircularProgress } from '@mui/material';

type NotificationType = 'success' | 'error' | 'info';

interface StatusMessage {
  type: NotificationType;
  text: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null,
  );

  const BASE_URL = import.meta.env.VITE_BASE_URL as string;
  if (!BASE_URL) {
    throw new Error('VITE_BASE_URL is not defined');
  }

  const showStatus = (text: string, type: NotificationType = 'info') => {
    setStatusMessage({ text, type });
    // Auto-hide the status message after 5 seconds
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const initialNotifications = await fetchNotifications();
      setNotifications(initialNotifications.reverse());
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      showStatus('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllRead = async () => {
    if (processingAction) return;

    setProcessingAction(true);
    try {
      const success = await markAllNotificationsAsRead();
      if (success) {
        // Update local state for immediate UI feedback without refetching
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        );
        showStatus('All notifications marked as read', 'success');
      } else {
        showStatus('Failed to mark all notifications as read', 'error');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      showStatus('An error occurred', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleMarkAllUnread = async () => {
    if (processingAction) return;

    setProcessingAction(true);
    try {
      const success = await markAllNotificationsAsUnread();
      if (success) {
        // Update local state for immediate UI feedback without refetching
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: false,
          })),
        );
        showStatus('All notifications marked as unread', 'success');
      } else {
        showStatus('Failed to mark all notifications as unread', 'error');
      }
    } catch (error) {
      console.error('Error marking all as unread:', error);
      showStatus('An error occurred', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeleteAll = async () => {
    if (processingAction) return;

    if (notifications.length === 0) {
      showStatus('No notifications to delete', 'info');
      return;
    }

    if (!window.confirm('Are you sure you want to delete all notifications?')) {
      return;
    }

    setProcessingAction(true);
    try {
      const success = await deleteAllNotifications();
      if (success) {
        setNotifications([]);
        showStatus('All notifications deleted', 'success');
      } else {
        showStatus('Failed to delete all notifications', 'error');
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      showStatus('An error occurred', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleNotificationUpdate = useCallback(
    (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications);
    },
    [],
  );

  // Get the appropriate color classes for different status types
  const getStatusClasses = (type: NotificationType): string => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-700';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-800 dark:text-red-100 dark:border-red-700';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-700';
    }
  };

  return (
    <div className="sm:p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          className="p-2 bg-green-500 text-white rounded flex items-center"
          onClick={loadNotifications}
          disabled={loading || processingAction}
        >
          {loading ? (
            'Loading...'
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Status message display */}
      {statusMessage && (
        <div
          className={`mb-4 p-3 border rounded-md flex items-center justify-between ${getStatusClasses(
            statusMessage.type,
          )}`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-2 text-sm hover:text-opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* Notification Actions */}
      <NotificationActions
        onMarkAllRead={handleMarkAllRead}
        onMarkAllUnread={handleMarkAllUnread}
        onDeleteAll={handleDeleteAll}
        disabled={processingAction || loading || notifications.length === 0}
      />

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <CircularProgress />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading notifications...
          </span>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300 p-8">
          No notifications available.
        </p>
      ) : (
        <NotificationList
          notifications={notifications}
          onNotificationUpdate={handleNotificationUpdate}
        />
      )}
    </div>
  );
};

export default Notifications;
