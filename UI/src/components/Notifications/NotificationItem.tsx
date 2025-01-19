import React from 'react';
import { Notification } from '../../interfaces/Notification';

interface NotificationItemProps {
  notification: Notification;
  navigate: (path: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  navigate,
}) => {
  const handleClick = () => {
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className={`p-4 border-b ${notification.read ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} ${notification.link ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-transform transform hover:scale-105' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} sm:w-full`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3
            className={`font-bold ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-black dark:text-white'}`}
          >
            {notification.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {notification.message}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
