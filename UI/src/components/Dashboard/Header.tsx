import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Header() {
  const unreadCount = 5; // Static value for unread notifications

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
