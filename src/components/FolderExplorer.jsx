import React, { useState, useEffect } from 'react'
import { getFolders, createFolder, deleteFolder, renameFolder } from '../services/api'
import { FaFolder, FaFolderOpen, FaTrash, FaEdit, FaPlus } from 'react-icons/fa'

const FolderExplorer = ({ onSelectFolder, selectedFolderId }) => {
  const [folders, setFolders] = useState([])
  const [expandedFolders, setExpandedFolders] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolder, setEditingFolder] = useState(null)

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

  const handleCreateFolder = async (parentId = null) => {
    if (newFolderName.trim() === '') return
    try {
      await createFolder(newFolderName, parentId)
      setNewFolderName('')
      fetchFolders()
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

  const handleRenameFolder = async (folderId) => {
    if (folderId === 1) {
      setError('Cannot rename the root folder')
      return
    }
    if (editingFolder === folderId && newFolderName.trim() !== '') {
      try {
        await renameFolder(folderId, newFolderName)
        setEditingFolder(null)
        setNewFolderName('')
        fetchFolders()
      } catch (err) {
        setError('Failed to rename folder')
      }
    } else {
      setEditingFolder(folderId)
      setNewFolderName(folders.find(f => f.id === folderId).name)
    }
  }

  const handleKeyPress = (e, folderId) => {
    if (e.key === 'Enter') {
      handleRenameFolder(folderId)
    } else if (e.key === 'Escape') {
      setEditingFolder(null)
      setNewFolderName('')
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
            {isExpanded ? <FaFolderOpen className="mr-2 text-blue-500" /> : <FaFolder className="mr-2 text-blue-500" />}
            {editingFolder === folder.id ? (
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => handleRenameFolder(folder.id)}
                onKeyDown={(e) => handleKeyPress(e, folder.id)}
                className="border-b border-gray-300 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            ) : (
              folder.name
            )}
          </button>
          {!isRootFolder && (
            <div className="ml-2 hidden group-hover:flex">
              <button onClick={() => handleRenameFolder(folder.id)} className="text-gray-500 hover:text-blue-600 mr-2">
                <FaEdit />
              </button>
              <button onClick={() => handleDeleteFolder(folder.id)} className="text-gray-500 hover:text-red-600">
                <FaTrash />
              </button>
            </div>
          )}
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
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          className="border border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => handleCreateFolder()}
          className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none"
        >
          <FaPlus />
        </button>
      </div>
      <div className="overflow-y-auto flex-grow">
        {folders.map(folder => (
          <div key={folder.id}>
            {renderFolder(folder)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FolderExplorer