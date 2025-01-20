import React, { useState, useEffect } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

function Header() {
  const [unreadCount, setUnreadCount] = useState(0);
  const BASE_URL = import.meta.env.VITE_BASE_URL as string;
  if (!BASE_URL) {
    throw new Error('VITE_BASE_URL is not defined');
  }

  useEffect(() => {
    const socket = io(BASE_URL);

    const incrementUnreadCount = () => {
      setUnreadCount((prevCount) => {
        console.log('Previous unread count:', prevCount);
        return prevCount + 1;
      });
    };

    socket.on('notification', incrementUnreadCount);
    socket.on('budgetCreated', incrementUnreadCount);
    socket.on('budgetUpdated', incrementUnreadCount);
    socket.on('budgetDeleted', incrementUnreadCount);
    socket.on('accountBalanceUpdated', incrementUnreadCount);

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex justify-between items-center p-4 z-10">
      <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
        Logo
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/dashboard/notifications" className="relative">
          <FaBell className="text-xl cursor-pointer text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link to="/dashboard/profile">
          <FaUserCircle className="text-xl cursor-pointer text-gray-700 dark:text-gray-300" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
