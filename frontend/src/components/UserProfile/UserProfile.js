import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function UserProfile() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="hidden md:block text-gray-700 dark:text-gray-200">
          {user?.name || 'User'}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <button
            onClick={toggleDarkMode}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={() => {/* Navigate to profile settings */}}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Einstellungen
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Abmelden
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
