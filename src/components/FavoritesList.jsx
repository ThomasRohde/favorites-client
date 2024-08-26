import React, { useState, useEffect } from 'react'
import { getFavorites } from '../services/api'

const FavoritesList = ({ selectedFolderId }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        const data = await getFavorites(selectedFolderId)
        setFavorites(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch favorites')
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [selectedFolderId])

  if (loading) return <div>Loading favorites...</div>
  if (error) return <div className="text-red-500">{error}</div>

  if (!favorites || favorites.length === 0) {
    return <div>No favorites found in this folder</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map(favorite => (
        <div key={favorite.id} className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">
            <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {favorite.title || 'Untitled'}
            </a>
          </h3>
          <p className="text-gray-600 mb-2">
            {favorite.summary 
              ? `${favorite.summary.slice(0, 100)}${favorite.summary.length > 100 ? '...' : ''}`
              : 'No summary available'}
          </p>
          <div className="flex flex-wrap">
            {favorite.tags && favorite.tags.map(tag => (
              <span key={tag.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2 text-sm">
                {tag.name}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Created: {new Date(favorite.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FavoritesList