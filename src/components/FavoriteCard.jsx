import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import EditFavorite from './EditFavorite'
import DeleteFavorite from './DeleteFavorite'
import { useNavigate } from 'react-router-dom'

const FavoriteCard = ({ favorite, onUpdate, onDelete, onFolderSelect, folderPath }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  const handleTagClick = (tagName) => {
    navigate(`/tag-search/${encodeURIComponent(tagName)}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">
          <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            {favorite.title || 'Untitled'}
          </a>
        </h3>
        <div className="flex space-x-2">
          <EditFavorite
            favorite={favorite}
            onUpdate={onUpdate}
          />
          <DeleteFavorite
            favorite={favorite}
            onDelete={onDelete}
          />
        </div>
      </div>
      {folderPath && folderPath.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center flex-wrap">
          {folderPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <button
                onClick={() => onFolderSelect(folder.id, folder.name)}
                className="hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus:text-blue-500 dark:focus:text-blue-400 transition-colors duration-200"
              >
                {folder.name}
              </button>
              {index < folderPath.length - 1 && <ChevronRight size={14} className="mx-1" />}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="text-gray-600 dark:text-gray-300 mb-2">
        {isExpanded ? (
          <p>{favorite.summary || 'No summary available'}</p>
        ) : (
          <p>
            {favorite.summary
              ? `${favorite.summary.slice(0, 100)}${favorite.summary.length > 100 ? '...' : ''}`
              : 'No summary available'}
          </p>
        )}
        {favorite.summary && favorite.summary.length > 100 && (
          <button
            onClick={toggleDescription}
            className="text-blue-500 dark:text-blue-400 text-xs hover:underline focus:outline-none mt-1 flex items-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show more
              </>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-wrap">
        {favorite.tags && favorite.tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.name)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mr-2 mb-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {tag.name}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Created: {new Date(favorite.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}

export default FavoriteCard