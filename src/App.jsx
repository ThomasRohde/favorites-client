import React, { useState } from 'react'
import FolderExplorer from './components/FolderExplorer'
import FavoritesList from './components/FavoritesList'

function App() {
  const [selectedFolderId, setSelectedFolderId] = useState(null)

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-4">Folders</h2>
        <FolderExplorer onSelectFolder={handleFolderSelect} />
      </div>
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Favorites</h1>
        <FavoritesList selectedFolderId={selectedFolderId} />
      </div>
    </div>
  )
}

export default App