import React, { useState, useCallback } from 'react';
import { vectorSearchFavorites } from '../services/api';
import FavoriteCard from './FavoriteCard';
import { handleFavoriteUpdate, handleFavoriteDelete } from '../utils/favoriteUtils';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await vectorSearchFavorites(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleUpdateFavorite = useCallback((updatedFavorite) => {
    setSearchResults(prevResults => 
      handleFavoriteUpdate(prevResults, updatedFavorite)
    );
  }, []);

  const handleDeleteFavorite = useCallback((deletedFavoriteId) => {
    setSearchResults(prevResults => 
      handleFavoriteDelete(prevResults, deletedFavoriteId)
    );
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Favorites</h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter search query"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map(favorite => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onUpdate={handleUpdateFavorite}
            onDelete={handleDeleteFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;