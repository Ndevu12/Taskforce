import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../interfaces/Notification';

interface NotificationItemProps {
  notification: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onToggleRead,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className={`p-4 border-b ${notification.read ? 'bg-white' : 'bg-gray-100'} ${notification.link ? 'cursor-pointer hover:bg-gray-200 transition-transform transform hover:scale-105' : 'hover:bg-gray-200'} sm:w-full`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3
            className={`font-bold ${notification.read ? 'text-gray-700' : 'text-black'}`}
          >
            {notification.title}
          </h3>
          <p className="text-gray-600">{notification.message}</p>
          <p className="text-gray-500 text-sm">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className="text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRead(notification.id);
            }}
          >
            {notification.read ? 'Mark as Unread' : 'Mark as Read'}
          </button>
          <button
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
