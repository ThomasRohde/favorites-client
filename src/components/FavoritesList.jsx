import React, { useState, useEffect } from 'react'
import { getFavorites, getFolders } from '../services/api'
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import EditFavorite from './EditFavorite'
import DeleteFavorite from './DeleteFavorite'

const FavoritesList = ({ selectedFolderId }) => {
  const [favorites, setFavorites] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingFavorite, setEditingFavorite] = useState(null)
  const [deletingFavorite, setDeletingFavorite] = useState(null)

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
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedFolderId])

  const getBreadcrumb = (folderId) => {
    const breadcrumb = []
    let currentFolder = folders.find(f => f.id === folderId)
    while (currentFolder && currentFolder.id !== 1) {
      breadcrumb.unshift(currentFolder)
      currentFolder = folders.find(f => f.id === currentFolder.parent_id)
    }
    return breadcrumb
  }

  const handleUpdateFavorite = (updatedFavorite) => {
    setFavorites(favorites.map(f => f.id === updatedFavorite.id ? updatedFavorite : f))
  }

  const handleDeleteFavorite = (deletedFavoriteId) => {
    setFavorites(favorites.filter(f => f.id !== deletedFavoriteId))
  }

  if (loading) return <div>Loading favorites...</div>
  if (error) return <div className="text-red-500">{error}</div>

  if (!favorites || favorites.length === 0) {
    return <div>No favorites found in this folder</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map(favorite => {
        const breadcrumb = getBreadcrumb(favorite.folder_id)
        return (
          <div key={favorite.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">
                <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {favorite.title || 'Untitled'}
                </a>
              </h3>
              <div className="flex space-x-2">
                <EditButton onClick={() => setEditingFavorite(favorite)} />
                <DeleteButton onClick={() => setDeletingFavorite(favorite)} />
              </div>
            </div>
            {breadcrumb.length > 0 && (
              <div className="text-xs text-gray-500 mb-2">
                {breadcrumb.map((folder, index) => (
                  <span key={folder.id}>
                    {folder.name}
                    {index < breadcrumb.length - 1 && ' > '}
                  </span>
                ))}
              </div>
            )}
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
        )
      })}
      {editingFavorite && (
        <EditFavorite
          favorite={editingFavorite}
          onClose={() => setEditingFavorite(null)}
          onUpdate={handleUpdateFavorite}
        />
      )}
      {deletingFavorite && (
        <DeleteFavorite
          favorite={deletingFavorite}
          onClose={() => setDeletingFavorite(null)}
          onDelete={handleDeleteFavorite}
        />
      )}
    </div>
  )
}

export default FavoritesList