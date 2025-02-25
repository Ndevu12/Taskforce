import React, { useEffect, useState } from 'react';
import {
  FaTachometerAlt,
  FaWallet,
  FaExchangeAlt,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmLogout from '../pop-ups/ConfirmPop-up';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    logout(navigate);
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  return (
    <>
      <div
        className={`fixed top-10 left-0 h-full bg-gray-800 dark:bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="flex mt-2 items-center justify-between p-4">
          <span
            className={`text-xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}
          >
            Menu
          </span>
          <FaBars
            className="cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
        <nav className="mt-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaTachometerAlt className="mr-4" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink
            to="/dashboard/accounts"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaWallet className="mr-4" />
            {!isCollapsed && <span>Accounts</span>}
          </NavLink>
          <NavLink
            to="/dashboard/budgets"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaClipboardList className="mr-4" />
            {!isCollapsed && <span>Budgets</span>}
          </NavLink>
          <NavLink
            to="/dashboard/transactions"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaExchangeAlt className="mr-4" />
            {!isCollapsed && <span>Transactions</span>}
          </NavLink>

          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaChartLine className="mr-4" />
            {!isCollapsed && <span>Reports</span>}
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            <FaCog className="mr-4" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center p-4 w-full hover:bg-gray-700"
            >
              <FaSignOutAlt className="mr-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>
      {showConfirmLogout && (
        <ConfirmLogout
          onConfirm={confirmLogout}
          message={'Are you sure you want to logout'}
          onCancel={cancelLogout}
        />
      )}
    </>
  );
}

export default Sidebar;
