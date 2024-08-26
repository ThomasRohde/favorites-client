const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFolders = async () => {
  const response = await fetch(`${API_BASE_URL}/folders`);
  if (!response.ok) {
    throw new Error('Failed to fetch folders');
  }
  return response.json();
};

export const getFavorites = async (folderId = null) => {
  const url = folderId 
    ? `${API_BASE_URL}/folders/${folderId}/favorites`
    : `${API_BASE_URL}/favorites`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  return response.json();
};

export const createFolder = async (name, parentId = null) => {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, parent_id: parentId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create folder');
  }
  return response.json();
};

export const deleteFolder = async (folderId) => {
  const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete folder');
  }
};

export const renameFolder = async (folderId, newName) => {
  const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  });
  if (!response.ok) {
    throw new Error('Failed to rename folder');
  }
  return response.json();
};

export const updateFavorite = async (favoriteId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Failed to update favorite');
  }
  return response.json();
};

export const deleteFavorite = async (favoriteId) => {
  const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete favorite');
  }
};

export const getTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites/tasks`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};