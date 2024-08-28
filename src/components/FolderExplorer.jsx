import React, { useState, useEffect } from 'react'
import { getFolders, createFolder, deleteFolder, renameFolder } from '../services/api'
import { Folder, FolderOpen, Trash2, Edit, Plus, HelpCircle } from 'lucide-react'
import CreateFolderModal from './CreateFolderModal'
import HelpModal from './HelpModal'
import { useTheme } from '../ThemeContext'

const FolderExplorer = ({ onSelectFolder, selectedFolderId }) => {
  const { isDarkMode } = useTheme()
  const [folders, setFolders] = useState([])
  const [expandedFolders, setExpandedFolders] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingFolder, setEditingFolder] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      const data = await getFolders()
      setFolders(data)
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
    const isSelected = selectedFolderId === folder.id

    return (
      <div key={folder.id} className="ml-4 mb-2">
        <div className={`flex items-center group ${isSelected ? 'bg-blue-100 dark:bg-blue-900 rounded' : ''}`}>
          <button
            onClick={() => {
              onSelectFolder(folder.id, folder.name)
              if (hasChildren) toggleFolder(folder.id)
            }}
            className={`flex items-center text-left hover:text-blue-600 dark:hover:text-blue-400 py-1 px-2 ${isSelected ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
          >
            {isExpanded ? <FolderOpen className="mr-2 text-blue-500 dark:text-blue-400" size={18} /> : <Folder className="mr-2 text-blue-500 dark:text-blue-400" size={18} />}
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
                className="border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent text-gray-800 dark:text-gray-200"
                autoFocus
              />
            ) : (
              <span className="text-gray-800 dark:text-gray-200">{folder.name}</span>
            )}
          </button>
          <div className="ml-2 hidden group-hover:flex">
            {!isRootFolder && (
              <>
                <button onClick={() => setEditingFolder(folder.id)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-2">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteFolder(folder.id)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mr-2">
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
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

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading folders...</div>
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>

  return (
    <div className="folder-explorer h-full flex flex-col bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <div className="mb-4 flex items-center justify-between h-14 px-4 bg-gray-100 dark:bg-gray-700">
        <h2 className="text-xl md:text-2xl font-bold flex items-center">
          Folders
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            <HelpCircle size={20} />
          </button>
        </h2>
      </div>
      <div className="overflow-y-auto flex-grow px-4">
        {folders.map(folder => (
          <div key={folder.id}>
            {renderFolder(folder)}
          </div>
        ))}
      </div>
      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  )
}

export default FolderExplorer