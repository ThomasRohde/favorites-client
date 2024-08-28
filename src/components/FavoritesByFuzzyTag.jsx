import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getFavoritesByFuzzyTag } from '../services/api'
import EditFavorite from './EditFavorite'
import DeleteFavorite from './DeleteFavorite'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const FavoritesByFuzzyTag = () => {
  const { query } = useParams()
  const { isDarkMode } = useTheme()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [skip, setSkip] = useState(0)
  const [limit] = useState(100)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = useCallback(async () => {
    if (!hasMore) return;
    
    setLoading(true)
    setError(null)
    try {
      const favoritesData = await getFavoritesByFuzzyTag(query, skip, limit)
      console.log('Fetched favorites for fuzzy tag query:', favoritesData)
      
      // Remove duplicates and add new favorites
      setFavorites(prevFavorites => {
        const newFavorites = favoritesData.filter(
          newFav => !prevFavorites.some(prevFav => prevFav.id === newFav.id)
        )
        return [...prevFavorites, ...newFavorites]
      })
      
      setHasMore(favoritesData.length === limit)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to fetch favorites for this tag query')
      setLoading(false)
    }
  }, [query, skip, limit, hasMore])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleUpdateFavorite = (updatedFavorite) => {
    setFavorites(favorites.map(f => f.id === updatedFavorite.id ? updatedFavorite : f))
  }

  const handleDeleteFavorite = (deletedFavoriteId) => {
    setFavorites(favorites.filter(f => f.id !== deletedFavoriteId))
  }

  const toggleDescription = (favoriteId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [favoriteId]: !prev[favoriteId]
    }))
  }

  const loadMore = () => {
    setSkip(prevSkip => prevSkip + limit)
  }

  if (loading && favorites.length === 0) return <div className="text-gray-600 dark:text-gray-300">Loading favorites...</div>
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Favorites matching tag query: "{query}"
      </h2>
      {favorites.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-300">No favorites found matching the tag query: "{query}"</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(favorite => {
              const isExpanded = expandedDescriptions[favorite.id]
              return (
                <div key={favorite.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">
                      <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {favorite.title || 'Untitled'}
                      </a>
                    </h3>
                    <div className="flex space-x-2">
                      <EditFavorite
                        favorite={favorite}
                        onUpdate={handleUpdateFavorite}
                      />
                      <DeleteFavorite
                        favorite={favorite}
                        onDelete={handleDeleteFavorite}
                      />
                    </div>
                  </div>
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
                        onClick={() => toggleDescription(favorite.id)}
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
                      <span key={tag.id} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mr-2 mb-2 text-sm">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Created: {new Date(favorite.created_at).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
          {loading && <div className="text-gray-600 dark:text-gray-300 mt-4">Loading more favorites...</div>}
          {!loading && hasMore && (
            <button
              onClick={loadMore}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default FavoritesByFuzzyTag