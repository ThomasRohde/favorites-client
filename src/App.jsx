import React, { useState, useCallback } from 'react'
import FolderExplorer from './components/FolderExplorer'
import FavoritesList from './components/FavoritesList'

function App() {
  const [selectedFolderId, setSelectedFolderId] = useState(null)

  const handleFolderSelect = useCallback((folderId) => {
    // If the root folder (id: 1) is selected, set selectedFolderId to null
    // This will indicate that all favorites should be shown
    setSelectedFolderId(folderId === 1 ? null : folderId)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white shadow-md flex flex-col">
        <div className="flex-grow overflow-hidden">
          <FolderExplorer onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
        </div>
      </div>
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Favorites</h1>
        <FavoritesList selectedFolderId={selectedFolderId} />
      </div>
    </div>
  )
}

export default App