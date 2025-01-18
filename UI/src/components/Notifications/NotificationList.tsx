import React, { useState } from 'react';
import NotificationItem from './NotificationItem';
import NotificationActions from './NotificationActions';
import { Notification } from '../../interfaces/Notification';

interface NotificationListProps {
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onToggleRead,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification,
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(notifications.length / notificationsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-96 overflow-y-auto sm:max-h-full sm:overflow-visible sm:w-full">
      <NotificationActions
        onMarkAllRead={() => notifications.forEach((n) => onToggleRead(n.id))}
        onMarkAllUnread={() => notifications.forEach((n) => onToggleRead(n.id))}
        onDeleteAll={() => notifications.forEach((n) => onDelete(n.id))}
      />
      {currentNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onToggleRead={onToggleRead}
          onDelete={onDelete}
        />
      ))}
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of{' '}
          {Math.ceil(notifications.length / notificationsPerPage)}
        </span>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleNextPage}
          disabled={
            currentPage ===
            Math.ceil(notifications.length / notificationsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
