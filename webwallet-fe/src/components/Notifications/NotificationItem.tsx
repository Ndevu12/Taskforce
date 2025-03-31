import React from 'react';
import { Notification } from '../../types/interfaces/Notification';
import { CircularProgress } from '@mui/material';

interface NotificationItemProps {
  notification: Notification;
  navigate: (path: string) => void;
  onToggleRead?: () => void;
  onDelete?: () => void;
  isProcessing?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  navigate,
  onToggleRead,
  onDelete,
  isProcessing = false,
}) => {
  // Validate notification object using _id (MongoDB standard)
  const isValidNotification =
    notification &&
    typeof notification._id === 'string' &&
    notification._id.trim() !== '';

  // If the notification is invalid, render a placeholder or nothing
  if (!isValidNotification) {
    return (
      <div className="p-4 mb-3 border-b bg-red-100 dark:bg-red-900">
        <p className="text-red-500 dark:text-red-300">
          Invalid notification data
        </p>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if we're processing or clicking on a button
    if (isProcessing || e.defaultPrevented) {
      return;
    }

    if (notification.link) {
      // Mark as read if clicking to navigate
      if (!notification.read && onToggleRead) {
        onToggleRead();
      }
      navigate(notification.link);
    }
  };

  return (
    <div
      className={`p-4 mb-3 border-b relative ${
        notification.read
          ? 'bg-white dark:bg-gray-800'
          : 'bg-gray-100 dark:bg-gray-700'
      } ${
        notification.link && !isProcessing
          ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-transform transform hover:scale-105'
          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
      } sm:w-full`}
      onClick={handleClick}
    >
      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 flex justify-center items-center z-10">
          <CircularProgress size={24} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex-1">
          <h3
            className={`font-bold ${
              notification.read
                ? 'text-gray-700 dark:text-gray-300'
                : 'text-black dark:text-white'
            }`}
          >
            {notification.title || ''}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {notification.message}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex w-full sm:w-auto mt-2 flex-row sm:flex-col sm:space-y-2 gap-4 justify-between ml-2">
          {onToggleRead && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isProcessing) {
                  onToggleRead();
                }
              }}
              className={`p-1.5 rounded text-xs ${
                notification.read
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
              }`}
              disabled={isProcessing}
            >
              {notification.read ? 'Mark Unread' : 'Mark Read'}
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  !isProcessing &&
                  window.confirm(
                    'Are you sure you want to delete this notification?',
                  )
                ) {
                  onDelete();
                }
              }}
              className="p-1.5 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded text-xs"
              disabled={isProcessing}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
