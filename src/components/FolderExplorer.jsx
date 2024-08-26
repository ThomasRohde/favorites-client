import React, { useState, useEffect } from 'react'
import { getFolders } from '../services/api'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'

const FolderExplorer = ({ onSelectFolder }) => {
  const [folders, setFolders] = useState([])
  const [expandedFolders, setExpandedFolders] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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

    fetchFolders()
  }, [])

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  const renderFolder = (folder) => {
    const isExpanded = expandedFolders[folder.id]
    const hasChildren = folder.children && folder.children.length > 0

    return (
      <div key={folder.id} className="ml-4">
        <button
          onClick={() => {
            onSelectFolder(folder.id)
            if (hasChildren) toggleFolder(folder.id)
          }}
          className="flex items-center text-left hover:text-blue-600"
        >
          {isExpanded ? <FaFolderOpen className="mr-2" /> : <FaFolder className="mr-2" />}
          {folder.name}
        </button>
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {folder.children.map(renderFolder)}
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div>Loading folders...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="folder-explorer">
      {folders.map(folder => (
        <div key={folder.id}>
          <button
            onClick={() => {
              onSelectFolder(folder.id)
              if (folder.children && folder.children.length > 0) toggleFolder(folder.id)
            }}
            className="flex items-center text-left hover:text-blue-600 font-bold mb-2"
          >
            {expandedFolders[folder.id] ? <FaFolderOpen className="mr-2" /> : <FaFolder className="mr-2" />}
            {folder.id === 1 ? "Favorites" : folder.name}
          </button>
          {expandedFolders[folder.id] && folder.children && folder.children.map(renderFolder)}
        </div>
      ))}
    </div>
  )
}

export default FolderExplorer