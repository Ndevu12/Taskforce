import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';
import logo from '../../assets/money taksy.png';

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex justify-between items-center p-4 z-10">
      <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
        <Link to="/dashboard">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBadge className="cursor-pointer" />
        <Link to="/dashboard/profile">
          <FaUserCircle className="text-xl cursor-pointer text-gray-700 dark:text-gray-300" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
