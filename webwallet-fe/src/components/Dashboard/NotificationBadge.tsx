import React, { useState, useEffect } from 'react';
import { Badge } from '@mui/material';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  initNotificationSocket,
  subscribeToUnreadCount,
  subscribeToReadyEvent,
  requestUnreadCount,
  unsubscribeFromUnreadCount,
  unsubscribeFromReadyEvent,
  disconnectNotificationSocket,
} from '../../actions/realTimeActions/socketNotificationActions';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Handle unread count updates
  const handleUnreadCountUpdate = (count: number) => {
    setUnreadCount(count);
  };

  // Handle socket ready event
  const handleSocketReady = () => {
    // Request initial unread count when socket is ready
    requestUnreadCount();
  };

  useEffect(() => {
    // Initialize socket connection
    initNotificationSocket();

    // Subscribe to socket events
    subscribeToReadyEvent(handleSocketReady);
    subscribeToUnreadCount(handleUnreadCountUpdate);

    // Cleanup on unmount
    return () => {
      unsubscribeFromReadyEvent();
      unsubscribeFromUnreadCount();
      disconnectNotificationSocket();
    };
  }, []);

  return (
    <Link to="/dashboard/notifications" className={className}>
      <Badge badgeContent={unreadCount} color="error" max={99}>
        <FaBell className="text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300" />
      </Badge>
    </Link>
  );
};

export default NotificationBadge;
