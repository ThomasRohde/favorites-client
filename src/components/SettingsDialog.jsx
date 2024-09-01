import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { resetDatabase, reindexDatabase } from '../services/api';

const SettingsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const handleReset = async () => {
    try {
      await resetDatabase();
      alert('Database reset successful');
    } catch (error) {
      console.error('Error resetting database:', error);
      alert('Error resetting database');
    }
  };

  const handleReindex = async () => {
    try {
      await reindexDatabase();
      alert('Database reindex successful');
    } catch (error) {
      console.error('Error reindexing database:', error);
      alert('Error reindexing database');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Settings size={20} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              >
                Reset Database
              </button>
              <button
                onClick={handleReindex}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                Reindex Database
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsDialog;