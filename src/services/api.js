const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFolders = async () => {
  const response = await fetch(`${API_BASE_URL}/folders`);
  if (!response.ok) {
    throw new Error('Failed to fetch folders');
  }
  return response.json();
};

export const getFavorites = async (folderId = null, skip = 0, limit = 50) => {
  const url = new URL(folderId 
    ? `${API_BASE_URL}/folders/${folderId}/favorites`
    : `${API_BASE_URL}/favorites`);
  url.searchParams.append('skip', skip);
  url.searchParams.append('limit', limit);
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

export const importFavorites = async (favorites) => {
  const response = await fetch(`${API_BASE_URL}/favorites/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(favorites),
  });
  if (!response.ok) {
    throw new Error('Failed to import favorites');
  }
  return response.json();
};

export const exportFavorites = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites`);
  if (!response.ok) {
    throw new Error('Failed to export favorites');
  }
  return response.json();
};

export const getFavoritesByFuzzyTag = async (tagQuery, skip = 0, limit = 100) => {
  const response = await fetch(`${API_BASE_URL}/tags/fuzzy/${encodeURIComponent(tagQuery)}/favorites?skip=${skip}&limit=${limit}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch favorites for this tag query');
  }
  return response.json();
};

export const restartImport = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites/restart-import`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to restart import');
  }
  return response.json();
};

export const vectorSearchFavorites = async (query, limit = 10) => {
  const url = new URL(`${API_BASE_URL}/favorites/search/vector`);
  url.searchParams.append('query', query);
  url.searchParams.append('limit', limit);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to perform vector search');
  }
  return response.json();
};
