import React, { useState, useEffect } from 'react';
import { Badge } from '@mui/material';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  initNotificationSocket,
  subscribeToUnseenCount,
  subscribeToReadyEvent,
  requestUnseenCount,
  markAllAsSeen,
  unsubscribeFromUnseenCount,
  unsubscribeFromReadyEvent,
  disconnectNotificationSocket,
} from '../../actions/realTimeActions/socketNotificationActions';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className }) => {
  const [unseenCount, setUnseenCount] = useState<number>(0);

  // Handle unseen count updates
  const handleUnseenCountUpdate = (count: number) => {
    setUnseenCount(count);
  };

  // Handle socket ready event
  const handleSocketReady = () => {
    // Request initial unseen count when socket is ready
    requestUnseenCount();
  };

  // Handle bell icon click
  const handleBellClick = () => {
    markAllAsSeen();
  };

  useEffect(() => {
    // Initialize socket connection
    initNotificationSocket();

    // Subscribe to socket events
    subscribeToReadyEvent(handleSocketReady);
    subscribeToUnseenCount(handleUnseenCountUpdate);

    // Cleanup on unmount
    return () => {
      unsubscribeFromReadyEvent();
      unsubscribeFromUnseenCount();
      disconnectNotificationSocket();
    };
  }, []);

  return (
    <Link
      to="/dashboard/notifications"
      className={className}
      onClick={handleBellClick}
    >
      <Badge badgeContent={unseenCount} color="error" max={99}>
        <FaBell className="text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300" />
      </Badge>
    </Link>
  );
};

export default NotificationBadge;
