import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateFavorite } from '../services/api';

const EditFavorite = ({ favorite, onClose, onUpdate }) => {
  const [title, setTitle] = useState(favorite.title || '');
  const [summary, setSummary] = useState(favorite.summary || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFavorite = await updateFavorite(favorite.id, { title, summary });
      onUpdate(updatedFavorite);
      onClose();
    } catch (error) {
      console.error('Failed to update favorite:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Favorite</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Favorite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFavorite;