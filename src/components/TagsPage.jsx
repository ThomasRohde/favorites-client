import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getFavorites } from '../services/api';
import FavoriteCard from './FavoriteCard';
import { handleFavoriteUpdate, handleFavoriteDelete } from '../utils/favoriteUtils';

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

  const handleUpdateFavorite = useCallback((updatedFavorite) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = handleFavoriteUpdate(prevFavorites, updatedFavorite);
      // If the updated favorite is in the current filtered view, update it
      if (selectedTag && updatedFavorite.tags.some(tag => tag.id === selectedTag.id)) {
        return updatedFavorites;
      } else {
        // If it's not in the current view, remove it from the filtered list
        return updatedFavorites.filter(fav => fav.id !== updatedFavorite.id);
      }
    });
  }, [selectedTag]);

  const handleDeleteFavorite = useCallback((deletedFavoriteId) => {
    setFavorites(prevFavorites => handleFavoriteDelete(prevFavorites, deletedFavoriteId));
  }, []);

  const TagCloud = ({ tags }) => {
    const maxCount = Math.max(...tags.map(tag => tag.count));
    const minCount = Math.min(...tags.map(tag => tag.count));
    const minFontSize = 12;
    const maxFontSize = 36;

    const getTagColor = (count) => {
      const normalizedCount = (count - minCount) / (maxCount - minCount);
      const hue = 240 - normalizedCount * 240; // 240 (blue) to 0 (red)
      return `hsl(${hue}, 70%, 60%)`;
    };

    const getTagFontSize = (count) => {
      const normalizedCount = (count - minCount) / (maxCount - minCount);
      return minFontSize + normalizedCount * (maxFontSize - minFontSize);
    };

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full transition-all ${
              selectedTag && selectedTag.id === tag.id
                ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                : 'hover:opacity-80'
            }`}
            style={{
              fontSize: `${getTagFontSize(tag.count)}px`,
              backgroundColor: getTagColor(tag.count),
              color: 'white',
              textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
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