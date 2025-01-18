import React from 'react';

interface NotificationActionsProps {
  onMarkAllRead: () => void;
  onMarkAllUnread: () => void;
  onDeleteAll: () => void;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllRead,
  onMarkAllUnread,
  onDeleteAll,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 space-y-2 sm:space-y-0 sm:space-x-2">
      <button
        className="bg-blue-500 text-white p-2 rounded-lg w-full sm:w-auto"
        onClick={onMarkAllRead}
      >
        Mark All as Read
      </button>
      <button
        className="bg-blue-500 text-white p-2 rounded-lg w-full sm:w-auto"
        onClick={onMarkAllUnread}
      >
        Mark All as Unread
      </button>
      <button
        className="bg-red-500 text-white p-2 rounded-lg w-full sm:w-auto"
        onClick={onDeleteAll}
      >
        Delete All
      </button>
    </div>
  );
};

export default NotificationActions;
