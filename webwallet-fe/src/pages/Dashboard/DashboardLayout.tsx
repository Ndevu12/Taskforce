import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired } from '../../utils/tokenUtils';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Dashboard/Header';
import Sidebar from '../../components/Dashboard/Sidebar';

function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        logout(navigate);
      }
    };

    checkToken();
    // Check every 5 minutes instead of every minute since we have a longer expiration
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout, navigate]);

  return (
    <div className="h-screen overflow-hidden relative">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header />
        <main className="overflow-auto mt-20 h-[calc(100vh-5rem)] bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto sm:py-2 sm:px-1 py-6 px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
