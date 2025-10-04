import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
            <button
              title="Toggle Theme"
              onClick={toggleTheme}
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                theme === 'dark' ? 'bg-blue-500' : ''
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                  theme === 'dark' ? 'translate-x-6' : ''
                }`}
              />
            </button>
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 text-black rounded-lg">
              Light Mode Preview
            </div>
            <div className="p-4 bg-gray-800 text-white rounded-lg">
              Dark Mode Preview
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
          <p>
            Notifications are enabled by default to ensure you stay updated
            about your account activities.
          </p>
          <p className="mt-2">
            Receive timely updates and alerts about your account activities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
