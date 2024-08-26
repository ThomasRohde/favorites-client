import React from 'react';

const DeleteButton = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-red-600 focus:outline-none">
    🗑️
  </button>
);

export default DeleteButton;