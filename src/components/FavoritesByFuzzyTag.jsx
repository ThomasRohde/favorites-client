import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getFavoritesByFuzzyTag } from '../services/api'
import FavoriteCard from './FavoriteCard'
import { handleFavoriteUpdate, handleFavoriteDelete } from '../utils/favoriteUtils'

const FavoritesByFuzzyTag = () => {
  const { query } = useParams()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const favoritesData = await getFavoritesByFuzzyTag(query)
        setFavorites(favoritesData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch favorites')
        setLoading(false)
      }
    }

    fetchData()
  }, [query])

  const handleUpdateFavorite = (updatedFavorite) => {
    setFavorites(handleFavoriteUpdate(favorites, updatedFavorite))
  }

  const handleDeleteFavorite = (deletedFavoriteId) => {
    setFavorites(handleFavoriteDelete(favorites, deletedFavoriteId))
  }

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading favorites...</div>
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>

  if (!favorites || favorites.length === 0) {
    return <div className="text-gray-600 dark:text-gray-300">No favorites found for this tag query</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Favorites for tag: {query}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(favorite => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onUpdate={handleUpdateFavorite}
            onDelete={handleDeleteFavorite}
            onFolderSelect={() => {}} // Placeholder function, as we don't handle folder selection here
            folderPath={[]} // Empty array, as we don't have folder information in this context
          />
        ))}
      </div>
    </div>
  )
}

export default FavoritesByFuzzyTag