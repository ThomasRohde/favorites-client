export const handleFavoriteUpdate = (favorites, updatedFavorite) => {
    return favorites.map(f => f.id === updatedFavorite.id ? updatedFavorite : f)
  }
  
  export const handleFavoriteDelete = (favorites, deletedFavoriteId) => {
    return favorites.filter(f => f.id !== deletedFavoriteId)
  }