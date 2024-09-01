import React, { useState, useEffect, useCallback } from 'react';
import { Settings, X, Loader } from 'lucide-react';
import { resetDatabase, reindexDatabase } from '../services/api';

const SettingsDialog = ({ onDatabaseUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  const handleDatabaseOperation = async (operation, operationName) => {
    setIsLoading(true);
    try {
      await operation();
      alert(`${operationName} successful`);
      onDatabaseUpdate();
    } catch (error) {
      console.error(`Error during ${operationName.toLowerCase()}:`, error);
      alert(`Error during ${operationName.toLowerCase()}`);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const handleReset = () => handleDatabaseOperation(resetDatabase, 'Database reset');
  const handleReindex = () => handleDatabaseOperation(reindexDatabase, 'Database reindex');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Open settings"
      >
        <Settings size={20} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Settings</h2>
              <button 
                onClick={handleClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close settings"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Database
              </button>
              <button
                onClick={handleReindex}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reindex Database
              </button>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={24} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsDialog;