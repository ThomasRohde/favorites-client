import React, { useState, useEffect } from 'react'
import { getFavorites, getFolders } from '../services/api'
import EditFavorite from './EditFavorite'
import DeleteFavorite from './DeleteFavorite'
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'

const FavoritesList = ({ selectedFolderId }) => {
  const [favorites, setFavorites] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [favoritesData, foldersData] = await Promise.all([
          getFavorites(selectedFolderId),
          getFolders()
        ])
        console.log('Fetched favorites:', favoritesData)
        console.log('Fetched folders:', foldersData)
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

  if (loading) return <div>Loading favorites...</div>
  if (error) return <div className="text-red-500">{error}</div>

  if (!favorites || favorites.length === 0) {
    return <div>No favorites found in this folder</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map(favorite => {
        const folderPath = getFolderPath(favorite.folder_id)
        const isExpanded = expandedDescriptions[favorite.id]
        return (
          <div key={favorite.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg sm:text-xl font-semibold">
                <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
            {folderPath.length > 0 && (
              <div className="text-xs text-gray-500 mb-2 flex items-center flex-wrap">
                {folderPath.map((folder, index) => (
                  <React.Fragment key={folder.id}>
                    <span>{folder.name}</span>
                    {index < folderPath.length - 1 && <ChevronRight size={14} className="mx-1" />}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div className="text-gray-600 mb-2">
              {/* ... (keep existing description logic) */}
            </div>
            <div className="flex flex-wrap">
              {favorite.tags && favorite.tags.map(tag => (
                <span key={tag.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2 text-xs sm:text-sm">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-2">
              Created: {new Date(favorite.created_at).toLocaleDateString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FavoritesList