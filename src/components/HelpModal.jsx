import React from 'react';
import { X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Folder Management Help</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Creating a folder:</strong> Hover over any folder and click the + icon to create a new subfolder.</p>
          <p><strong>Renaming a folder:</strong> Hover over a folder and click the pencil icon to rename it.</p>
          <p><strong>Deleting a folder:</strong> Hover over a folder and click the trash icon to delete it.</p>
          <p><strong>Expanding/Collapsing:</strong> Click on a folder name to expand or collapse its contents.</p>
          <p><strong>Selecting a folder:</strong> Click on a folder name to select it and view its contents.</p>
          <p><strong>Note:</strong> The root "Favorites" item cannot be renamed or deleted.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;