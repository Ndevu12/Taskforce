import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { Notification } from '../../types/interfaces/Notification';
import { useNavigate } from 'react-router-dom';
import {
  markNotificationAsRead,
  markNotificationAsUnread,
  deleteNotification,
} from '../../actions/notificationActions';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationUpdate?: (notifications: Notification[]) => void;
}

type StatusType = 'success' | 'error' | 'info';

interface StatusMessage {
  type: StatusType;
  text: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationUpdate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>(
    [],
  );
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null,
  );
  const notificationsPerPage = 5;
  const navigate = useNavigate();

  // Only update liveNotifications when the notifications prop changes
  useEffect(() => {
    setLiveNotifications(notifications);
  }, [notifications]);

  // Show status message with auto-dismiss
  const showStatus = (text: string, type: StatusType = 'info') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const isValidNotification = (
    notification: Notification | null | undefined,
  ): notification is Notification => {
    return (
      !!notification &&
      typeof notification._id === 'string' &&
      notification._id.trim() !== ''
    );
  };

  const handleToggleRead = async (notification: Notification) => {
    // Validate notification before processing
    if (!isValidNotification(notification)) {
      console.error(
        'Invalid notification object received for toggle read action',
      );
      showStatus('Invalid notification data', 'error');
      return;
    }

    // Start processing
    setProcessingIds((prev) => new Set(prev).add(notification._id));

    try {
      let updatedNotification;
      if (notification.read) {
        updatedNotification = await markNotificationAsUnread(notification._id);
      } else {
        updatedNotification = await markNotificationAsRead(notification._id);
      }

      if (updatedNotification) {
        // Update local state without full reload
        setLiveNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: !n.read } : n,
          ),
        );

        // Also update parent state if callback exists
        if (onNotificationUpdate) {
          onNotificationUpdate(
            liveNotifications.map((n) =>
              n._id === notification._id ? { ...n, read: !n.read } : n,
            ),
          );
        }

        showStatus(
          notification.read
            ? 'Notification marked as unread'
            : 'Notification marked as read',
          'success',
        );
      }
    } catch (error) {
      console.error('Error toggling notification read status:', error);
      showStatus('Failed to update notification', 'error');
    } finally {
      // Stop processing
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification._id);
        return newSet;
      });
    }
  };

  const handleDelete = async (notification: Notification) => {
    // Validate notification before processing
    if (!isValidNotification(notification)) {
      console.error('Invalid notification object received for delete action');
      showStatus('Invalid notification data', 'error');
      return;
    }

    // Start processing
    setProcessingIds((prev) => new Set(prev).add(notification._id));

    try {
      const success = await deleteNotification(notification._id);
      if (success) {
        // Update both local and parent state without full reload
        const updated = liveNotifications.filter(
          (n) => n._id !== notification._id,
        );
        setLiveNotifications(updated);

        // Also update parent state if callback exists
        if (onNotificationUpdate) {
          onNotificationUpdate(updated);
        }

        showStatus('Notification deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      showStatus('Failed to delete notification', 'error');
    } finally {
      // Stop processing
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification._id);
        return newSet;
      });
    }
  };

  // Recalculate current page if we have fewer notifications than before
  useEffect(() => {
    const maxPage = Math.max(
      1,
      Math.ceil(liveNotifications.length / notificationsPerPage),
    );
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [liveNotifications.length, currentPage]);

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = liveNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification,
  );

  const handleNextPage = () => {
    if (
      currentPage < Math.ceil(liveNotifications.length / notificationsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const truncateMessage = (message: string, maxLength: number) => {
    if (message.length <= maxLength) {
      return message;
    }
    return message.slice(0, maxLength) + '...';
  };

  // Get status message color classes
  const getStatusClasses = (type: StatusType): string => {
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
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 overflow-y-auto sm:max-h-full sm:overflow-visible w-full">
      {/* Status message display */}
      {statusMessage && (
        <div
          className={`m-3 p-2 border rounded-md flex items-center justify-between text-sm ${getStatusClasses(
            statusMessage.type,
          )}`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-2 text-xs hover:text-opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {currentNotifications.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300 p-4">
          No notifications available.
        </p>
      ) : (
        currentNotifications.filter(isValidNotification).map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={{
              ...notification,
              message: truncateMessage(notification.message, 100),
            }}
            navigate={navigate}
            onToggleRead={() => handleToggleRead(notification)}
            onDelete={() => handleDelete(notification)}
            isProcessing={processingIds.has(notification._id)}
          />
        ))
      )}
      {liveNotifications.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
          <button
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of{' '}
            {Math.max(
              1,
              Math.ceil(liveNotifications.length / notificationsPerPage),
            )}
          </span>
          <button
            className={`p-2 rounded-lg ${
              currentPage ===
                Math.ceil(liveNotifications.length / notificationsPerPage) ||
              liveNotifications.length === 0
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={handleNextPage}
            disabled={
              currentPage ===
                Math.ceil(liveNotifications.length / notificationsPerPage) ||
              liveNotifications.length === 0
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
