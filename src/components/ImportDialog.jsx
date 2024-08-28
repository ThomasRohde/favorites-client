import React, { useState } from 'react';
import { X } from 'lucide-react';
import { importFavorites } from '../services/api';

const ImportDialog = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [importStatus, setImportStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setImportStatus('Please select a file to import.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        const favorites = JSON.parse(content);
        await importFavorites(favorites);
        setImportStatus('Import successful!');
        setTimeout(() => {
          onClose();
          setImportStatus('');
          setFile(null);
        }, 2000);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('Import failed. Please check your file and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Import Favorites</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
        </div>
        <button
          onClick={handleImport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Import
        </button>
        {importStatus && <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{importStatus}</p>}
      </div>
    </div>
  );
};

export default ImportDialog;