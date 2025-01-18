import React, { useState } from 'react';
import NotificationList from '../../components/Notifications/NotificationList';
import { Notification } from '../../interfaces/Notification';

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Budget Exceeded',
    message: 'Your budget for Groceries is exceeded.',
    timestamp: '2025-01-01T10:00:00Z',
    read: false,
    link: '/budgets',
  },
  {
    id: '2',
    title: 'Transaction Alert',
    message: 'You spent $50 on Entertainment.',
    timestamp: '2025-01-02T14:00:00Z',
    read: true,
  },
  {
    id: '3',
    title: 'New Report Available',
    message: 'Your monthly report is ready.',
    timestamp: '2025-01-03T09:00:00Z',
    read: false,
    link: '/reports',
  },
  {
    id: '4',
    title: 'Account Update',
    message: 'Your account details have been updated.',
    timestamp: '2025-01-04T11:00:00Z',
    read: true,
  },
  {
    id: '5',
    title: 'Security Alert',
    message: 'A new login from an unknown device was detected.',
    timestamp: '2025-01-05T16:00:00Z',
    read: false,
  },
  {
    id: '6',
    title: 'Budget Reminder',
    message: 'You have 5 days left to update your budget.',
    timestamp: '2025-01-06T08:00:00Z',
    read: true,
  },
  {
    id: '7',
    title: 'Payment Received',
    message: 'You received a payment of $200.',
    timestamp: '2025-01-07T13:00:00Z',
    read: false,
  },
  {
    id: '8',
    title: 'Subscription Expiring',
    message: 'Your subscription will expire in 3 days.',
    timestamp: '2025-01-08T10:00:00Z',
    read: true,
  },
  {
    id: '9',
    title: 'New Feature Released',
    message: 'Check out the new feature in your dashboard.',
    timestamp: '2025-01-09T15:00:00Z',
    read: false,
    link: '/features',
  },
  {
    id: '10',
    title: 'Weekly Summary',
    message: 'Your weekly summary is available.',
    timestamp: '2025-01-10T12:00:00Z',
    read: true,
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <NotificationList
        notifications={notifications}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Notifications;
