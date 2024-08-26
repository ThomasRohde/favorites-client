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

// Add more API functions as needed