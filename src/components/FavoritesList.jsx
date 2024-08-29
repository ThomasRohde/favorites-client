import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getFavorites, getFolders } from '../services/api'
import FavoriteCard from './FavoriteCard'
import { handleFavoriteUpdate, handleFavoriteDelete } from '../utils/favoriteUtils'

const FavoritesList = ({ selectedFolderId, onFolderSelect }) => {
  const [favorites, setFavorites] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const loader = useRef(null)

  const loadMoreFavorites = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const newFavorites = await getFavorites(selectedFolderId, page * 100, 100)
      if (newFavorites.length === 0) {
        setHasMore(false)
      } else {
        setFavorites(prevFavorites => [...prevFavorites, ...newFavorites])
        setPage(prevPage => prevPage + 1)
      }
    } catch (err) {
      console.error('Error fetching more favorites:', err)
      setError('Failed to fetch more favorites')
    } finally {
      setLoading(false)
    }
  }, [selectedFolderId, page, loading])

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setFavorites([])
      setPage(0)
      setHasMore(true)
      try {
        const [favoritesData, foldersData] = await Promise.all([
          getFavorites(selectedFolderId, 0, 100),
          getFolders()
        ])
        setFavorites(favoritesData)
        setFolders(foldersData)
        setPage(1)
        setHasMore(favoritesData.length === 100)
      } catch (err) {
        console.error('Error fetching initial data:', err)
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [selectedFolderId])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    }

    const observer = new IntersectionObserver(entries => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
        loadMoreFavorites()
      }
    }, options)

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current)
      }
    }
  }, [loadMoreFavorites, hasMore])

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

  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>

  return (
    <div>
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
      {loading && <div className="text-center mt-4">Loading more favorites...</div>}
      {!loading && hasMore && <div ref={loader} className="h-10" />}
      {!hasMore && <div className="text-center mt-4">No more favorites to load</div>}
    </div>
  )
}

export default FavoritesList