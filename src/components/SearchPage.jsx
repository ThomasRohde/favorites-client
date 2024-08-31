import React, { useState } from 'react';
import { vectorSearchFavorites } from '../services/api';
import FavoriteCard from './FavoriteCard';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const results = await vectorSearchFavorites(query);
      // Reverse the results array to show most relevant at the top
      setSearchResults(results.reverse());
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Search Favorites</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Search
          </button>
        </div>
      </form>
      {isLoading && <p className="text-gray-600 dark:text-gray-300">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map(favorite => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onUpdate={() => {}} // You might want to implement this
            onDelete={() => {}} // You might want to implement this
          />
        ))}
      </div>
      {searchResults.length === 0 && query && !isLoading && (
        <p className="text-gray-600 dark:text-gray-300">No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;