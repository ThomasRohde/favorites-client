import React, { useState } from 'react';
import { X } from 'lucide-react';
import { exportFavorites } from '../services/api';

const ExportDialog = ({ isOpen, onClose }) => {
  const [exportStatus, setExportStatus] = useState('');

  const handleExport = async () => {
    try {
      const favorites = await exportFavorites();
      const dataStr = JSON.stringify(favorites, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'favorites_export.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setExportStatus('Export successful! Your file is being downloaded.');
      setTimeout(() => {
        onClose();
        setExportStatus('');
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Export failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Export Favorites</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export Favorites
        </button>
        {exportStatus && <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{exportStatus}</p>}
      </div>
    </div>
  );
};

export default ExportDialog;