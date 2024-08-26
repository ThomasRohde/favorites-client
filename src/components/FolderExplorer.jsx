import React, { useState, useEffect } from 'react'
import { getFolders, createFolder, deleteFolder, renameFolder } from '../services/api'
import { Folder, FolderOpen, Trash2, Edit, Plus, HelpCircle } from 'lucide-react'
import CreateFolderModal from './CreateFolderModal'

const FolderExplorer = ({ onSelectFolder, selectedFolderId }) => {
  const [folders, setFolders] = useState([])
  const [expandedFolders, setExpandedFolders] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingFolder, setEditingFolder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      const data = await getFolders()
      const updatedData = data.map(folder => 
        folder.id === 1 ? { ...folder, name: 'Folders' } : folder
      )
      setFolders(updatedData)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch folders')
      setLoading(false)
    }
  }

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  const handleCreateFolder = async (name, description) => {
    const parentId = selectedFolderId === null ? 1 : selectedFolderId // Use root (1) if no folder is selected
    try {
      await createFolder(name, parentId, description)
      fetchFolders()
      // Expand the parent folder to show the new child
      setExpandedFolders(prev => ({
        ...prev,
        [parentId]: true
      }))
    } catch (err) {
      setError('Failed to create folder')
    }
  }

  const handleDeleteFolder = async (folderId) => {
    if (folderId === 1) {
      setError('Cannot delete the root folder')
      return
    }
    try {
      await deleteFolder(folderId)
      fetchFolders()
    } catch (err) {
      setError('Failed to delete folder')
    }
  }

  const handleRenameFolder = async (folderId, newName) => {
    if (folderId === 1) {
      setError('Cannot rename the root folder')
      return
    }
    try {
      await renameFolder(folderId, newName)
      setEditingFolder(null)
      fetchFolders()
    } catch (err) {
      setError('Failed to rename folder')
    }
  }

  const renderFolder = (folder) => {
    const isExpanded = expandedFolders[folder.id]
    const hasChildren = folder.children && folder.children.length > 0
    const isRootFolder = folder.id === 1
    const isSelected = selectedFolderId === folder.id || (isRootFolder && selectedFolderId === null)

    return (
      <div key={folder.id} className="ml-4 mb-2">
        <div className={`flex items-center group ${isSelected ? 'bg-blue-100 rounded' : ''}`}>
          <button
            onClick={() => {
              onSelectFolder(folder.id)
              if (hasChildren) toggleFolder(folder.id)
            }}
            className={`flex items-center text-left hover:text-blue-600 py-1 px-2 ${isSelected ? 'font-semibold' : ''}`}
          >
            {isExpanded ? <FolderOpen className="mr-2 text-blue-500" size={18} /> : <Folder className="mr-2 text-blue-500" size={18} />}
            {editingFolder === folder.id ? (
              <input
                type="text"
                value={folder.name}
                onChange={(e) => handleRenameFolder(folder.id, e.target.value)}
                onBlur={() => setEditingFolder(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameFolder(folder.id, e.target.value)
                  } else if (e.key === 'Escape') {
                    setEditingFolder(null)
                  }
                }}
                className="border-b border-gray-300 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            ) : (
              folder.name
            )}
          </button>
          <div className="ml-2 hidden group-hover:flex">
            {!isRootFolder && (
              <>
                <button onClick={() => setEditingFolder(folder.id)} className="text-gray-500 hover:text-blue-600 mr-2">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteFolder(folder.id)} className="text-gray-500 hover:text-red-600 mr-2">
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-500 hover:text-green-600"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-4 mt-2">
            {folder.children.map(renderFolder)}
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div>Loading folders...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="folder-explorer h-full flex flex-col">
      <div className="mb-4 flex items-center space-x-2">
        <button
          onClick={() => alert('Help: Hover over a folder to see options. Click + to create a new subfolder, pencil to rename, or trash to delete.')}
          className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 focus:outline-none flex items-center justify-center"
        >
          <HelpCircle size={18} />
        </button>
      </div>
      <div className="overflow-y-auto flex-grow">
        {folders.map(folder => (
          <div key={folder.id}>
            {renderFolder(folder)}
          </div>
        ))}
      </div>
      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  )
}

export default FolderExplorer