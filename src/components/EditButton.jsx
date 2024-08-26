import React from 'react';

const EditButton = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-blue-600 focus:outline-none">
    ✏️
  </button>
);

export default EditButton;