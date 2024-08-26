import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { deleteFavorite } from '../services/api';

const DeleteFavorite = ({ favorite, onDelete }) => {
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
      <button onClick={() => setIsDialogOpen(true)} className="text-gray-500 hover:text-red-600 focus:outline-none">
        <Trash2 size={18} />
      </button>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Favorite</h2>
              <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <p className="mb-4">Are you sure you want to delete this favorite?</p>
            <p className="mb-4 font-semibold">{favorite.title || 'Untitled'}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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