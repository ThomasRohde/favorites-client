import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import DeleteFavorite from './DeleteFavorite';
import EditFavorite from './EditFavorite';
import TagEditor from './TagEditor';
import { updateFavorite } from '../services/api';

const FavoriteCard = ({ favorite, onUpdate, onDelete, onFolderSelect, folderPath }) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagAdd = async (newTag) => {
    const updatedTags = [...favorite.tags, newTag];
    const updatedFavorite = await updateFavorite(favorite.id, { tags: updatedTags.map(tag => tag.name) });
    onUpdate(updatedFavorite);
  };

  const handleTagRemove = async (tagId) => {
    const updatedTags = favorite.tags.filter(tag => tag.id !== tagId);
    const updatedFavorite = await updateFavorite(favorite.id, { tags: updatedTags.map(tag => tag.name) });
    onUpdate(updatedFavorite);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{favorite.title || 'Untitled'}</h3>
        <div className="flex space-x-2">
          <EditFavorite favorite={favorite} onUpdate={onUpdate} />
          <DeleteFavorite favorite={favorite} onDelete={onDelete} />
        </div>
      </div>
      <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-2">
        <Link size={16} className="mr-1" />
        {favorite.url}
      </a>
      {folderPath && folderPath.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <button
                onClick={() => onFolderSelect(folder.id, folder.name)}
                className="hover:underline focus:outline-none"
              >
                {folder.name}
              </button>
              {index < folderPath.length - 1 && " > "}
            </React.Fragment>
          ))}
        </div>
      )}
      <TagEditor
        currentTags={favorite.tags}
        onAddTag={handleTagAdd}
        onRemoveTag={handleTagRemove}
      />
      {favorite.summary && (
        <>
          <p className={`text-gray-600 dark:text-gray-400 mt-2 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {favorite.summary}
          </p>
          {favorite.summary.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 dark:text-blue-400 hover:underline mt-1 focus:outline-none"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FavoriteCard;