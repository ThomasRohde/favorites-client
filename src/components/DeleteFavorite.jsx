import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { deleteFavorite } from '../services/api';
import { useTheme } from '../ThemeContext';

const DeleteFavorite = ({ favorite, onDelete }) => {
  const { isDarkMode } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteFavorite(favorite.id);
      onDelete(favorite.id);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete favorite:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none">
        <Trash2 size={18} />
      </button>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Delete Favorite</h2>
              <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete this favorite?</p>
            <p className="mb-4 font-semibold text-gray-800 dark:text-gray-200">{favorite.title || 'Untitled'}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteFavorite;