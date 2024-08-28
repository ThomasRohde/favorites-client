import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const HelpModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Folder Management Help</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p><strong className="text-gray-800 dark:text-gray-200">Creating a folder:</strong> Hover over any folder and click the + icon to create a new subfolder.</p>
          <p><strong className="text-gray-800 dark:text-gray-200">Renaming a folder:</strong> Hover over a folder and click the pencil icon to rename it.</p>
          <p><strong className="text-gray-800 dark:text-gray-200">Deleting a folder:</strong> Hover over a folder and click the trash icon to delete it.</p>
          <p><strong className="text-gray-800 dark:text-gray-200">Expanding/Collapsing:</strong> Click on a folder name to expand or collapse its contents.</p>
          <p><strong className="text-gray-800 dark:text-gray-200">Selecting a folder:</strong> Click on a folder name to select it and view its contents.</p>
          <p><strong className="text-gray-800 dark:text-gray-200">Note:</strong> The root "Favorites" item cannot be renamed or deleted.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;