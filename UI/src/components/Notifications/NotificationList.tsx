import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import NotificationItem from './NotificationItem';
import { Notification } from '../../interfaces/Notification';
import { useNavigate } from 'react-router-dom';

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [liveNotifications, setLiveNotifications] =
    useState<Notification[]>(notifications);
  const notificationsPerPage = 5;
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL as string;
  if (!BASE_URL) {
    throw new Error('VITE_BASE_URL is not defined');
  }

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on('notification', (newNotification: Notification) => {
      setLiveNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    socket.on('budgetCreated', (budget) => {
      const notification: Notification = {
        id: budget._id,
        title: 'New Budget Created',
        type: 'BUDGET_THRESHOLD',
        message: `A new budget has been created.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/dashboard/budgets',
      };
      setLiveNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    socket.on('budgetUpdated', (budget) => {
      const notification: Notification = {
        id: budget._id,
        title: 'Budget Updated',
        type: 'BUDGET_THRESHOLD',
        message: `A budget has been updated.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/dashboard/budgets',
      };
      setLiveNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    socket.on('budgetDeleted', (budgetId) => {
      const notification: Notification = {
        id: budgetId,
        type: 'BUDGET_THRESHOLD',
        title: 'Budget Deleted',
        message: `A budget has been deleted.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/dashboard/budgets',
      };
      setLiveNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    socket.on('accountBalanceUpdated', (account) => {
      const notification: Notification = {
        id: account._id,
        title: 'Account Balance Updated',
        type: 'TRANSACTION_ALERT',
        message: `The balance of account ${account.name} has been updated.`,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/dashboard/accounts',
      };
      setLiveNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [BASE_URL]);

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

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-96 overflow-y-auto sm:max-h-full sm:overflow-visible sm:w-full">
      {currentNotifications.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No notifications available.
        </p>
      ) : (
        currentNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={{
              ...notification,
              message: truncateMessage(notification.message, 100),
            }}
            navigate={navigate}
          />
        ))
      )}
      {currentNotifications.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of{' '}
            {Math.ceil(liveNotifications.length / notificationsPerPage)}
          </span>
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleNextPage}
            disabled={
              currentPage ===
              Math.ceil(liveNotifications.length / notificationsPerPage)
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
