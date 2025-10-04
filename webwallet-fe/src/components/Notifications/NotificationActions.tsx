import React from 'react';

interface NotificationActionsProps {
  onMarkAllRead: () => void;
  onMarkAllUnread: () => void;
  onDeleteAll: () => void;
  disabled?: boolean;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllRead,
  onMarkAllUnread,
  onDeleteAll,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
      <button
        className={`bg-blue-500 text-white p-2 rounded-lg w-full sm:w-auto ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
        onClick={onMarkAllRead}
        disabled={disabled}
      >
        Mark All as Read
      </button>
      <button
        className={`bg-blue-500 text-white p-2 rounded-lg w-full sm:w-auto ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
        onClick={onMarkAllUnread}
        disabled={disabled}
      >
        Mark All as Unread
      </button>
      <button
        className={`bg-red-500 text-white p-2 rounded-lg w-full sm:w-auto ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
        }`}
        onClick={onDeleteAll}
        disabled={disabled}
      >
        Delete All
      </button>
    </div>
  );
};

export default NotificationActions;
