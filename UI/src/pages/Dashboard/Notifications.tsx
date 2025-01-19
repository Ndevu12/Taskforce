import React, { useState, useEffect } from 'react';
import NotificationList from '../../components/Notifications/NotificationList';
import { Notification } from '../../interfaces/Notification';
import { io } from 'socket.io-client';
import { fetchNotifications } from '../../actions/notificationActions';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL as string;
  if (!BASE_URL) {
    throw new Error('VITE_BASE_URL is not defined');
  }

  useEffect(() => {
    const loadNotifications = async () => {
      const initialNotifications = await fetchNotifications();
      setNotifications(initialNotifications);
    };

    loadNotifications();

    const socket = io(BASE_URL);

    socket.on('notification', (newNotification: Notification) => {
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [BASE_URL]);

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No notifications available.
        </p>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
};

export default Notifications;
