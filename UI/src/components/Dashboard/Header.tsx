import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center p-4 z-10">
      <div className="text-xl font-bold">Logo</div>
      <div className="flex items-center space-x-4">
        <FaBell className="text-xl cursor-pointer" />
        <FaUserCircle className="text-xl cursor-pointer" />
      </div>
    </header>
  );
}

export default Header;
