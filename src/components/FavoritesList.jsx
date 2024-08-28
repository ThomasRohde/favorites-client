import React, { useState, useEffect } from 'react'
import { getFavorites, getFolders } from '../services/api'
import FavoriteCard from './FavoriteCard'
import { handleFavoriteUpdate, handleFavoriteDelete } from '../utils/favoriteUtils'

const FavoritesList = ({ selectedFolderId, onFolderSelect }) => {
  const [favorites, setFavorites] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [favoritesData, foldersData] = await Promise.all([
          getFavorites(selectedFolderId),
          getFolders()
        ])
        setFavorites(favoritesData)
        setFolders(foldersData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedFolderId])

  const findFolderRecursive = (folders, id) => {
    for (let folder of folders) {
      if (folder.id.toString() === id.toString()) {
        return folder;
      }
      if (folder.children && folder.children.length > 0) {
        const found = findFolderRecursive(folder.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const getFolderPath = (folderId) => {
    const path = [];
    let currentFolder = findFolderRecursive(folders, folderId);
    
    while (currentFolder && currentFolder.name !== "Favorites") {
      path.unshift(currentFolder);
      currentFolder = findFolderRecursive(folders, currentFolder.parent_id);
    }
    return path;
  };

  const handleUpdateFavorite = (updatedFavorite) => {
    setFavorites(handleFavoriteUpdate(favorites, updatedFavorite))
  }

  const handleDeleteFavorite = (deletedFavoriteId) => {
    setFavorites(handleFavoriteDelete(favorites, deletedFavoriteId))
  }

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading favorites...</div>
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>

  if (!favorites || favorites.length === 0) {
    return <div className="text-gray-600 dark:text-gray-300">No favorites found in this folder</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map(favorite => {
        const folderPath = getFolderPath(favorite.folder_id)
        return (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onUpdate={handleUpdateFavorite}
            onDelete={handleDeleteFavorite}
            onFolderSelect={onFolderSelect}
            folderPath={folderPath}
          />
        )
      })}
    </div>
  )
}

export default FavoritesList