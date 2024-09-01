import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getFavorites, updateFavorite, deleteFavorite } from '../services/api';
import FavoriteCard from './FavoriteCard';

const TagsPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const fetchedFavorites = await getFavorites();
      setFavorites(fetchedFavorites);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to fetch favorites');
      setLoading(false);
    }
  };

  const tagsWithCount = useMemo(() => {
    const tagMap = new Map();
    favorites.forEach(favorite => {
      favorite.tags.forEach(tag => {
        if (tagMap.has(tag.id)) {
          tagMap.get(tag.id).count += 1;
        } else {
          tagMap.set(tag.id, { ...tag, count: 1 });
        }
      });
    });
    return Array.from(tagMap.values());
  }, [favorites]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const filteredFavorites = useMemo(() => {
    if (!selectedTag) return [];
    return favorites.filter(favorite => 
      favorite.tags.some(tag => tag.id === selectedTag.id)
    );
  }, [selectedTag, favorites]);

  const handleUpdateFavorite = useCallback(async (updatedFavorite) => {
    try {
      const result = await updateFavorite(updatedFavorite.id, updatedFavorite);
      setFavorites(prevFavorites => 
        prevFavorites.map(fav => fav.id === result.id ? result : fav)
      );
    } catch (error) {
      console.error('Failed to update favorite:', error);
      // You might want to show an error message to the user here
    }
  }, []);

  const handleDeleteFavorite = useCallback(async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Failed to delete favorite:', error);
      // You might want to show an error message to the user here
    }
  }, []);

  const TagCloud = ({ tags }) => {
    const maxCount = Math.max(...tags.map(tag => tag.count));
    const minFontSize = 12;
    const maxFontSize = 36;

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full transition-all ${
              selectedTag && selectedTag.id === tag.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            style={{
              fontSize: `${minFontSize + (tag.count / maxCount) * (maxFontSize - minFontSize)}px`
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tags</h1>
      <TagCloud tags={tagsWithCount} />
      {selectedTag && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Favorites tagged with "{selectedTag.name}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map(favorite => (
              <FavoriteCard
                key={favorite.id}
                favorite={favorite}
                onUpdate={handleUpdateFavorite}
                onDelete={handleDeleteFavorite}
              />
            ))}
          </div>
          {filteredFavorites.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No favorites found with this tag.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsPage;