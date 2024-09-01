import React, { useState, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { getTags, createTag } from '../services/api';

const TagEditor = ({ currentTags, onAddTag, onRemoveTag }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 0) {
      const allTags = await getTags();
      const filteredSuggestions = allTags
        .filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()))
        .filter(tag => !currentTags.some(currentTag => currentTag.id === tag.id));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddTag = async (tagName) => {
    let tag;
    const existingTag = suggestions.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (existingTag) {
      tag = existingTag;
    } else {
      tag = await createTag(tagName);
    }
    onAddTag(tag);
    setInput('');
    setSuggestions([]);
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      handleAddTag(input);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentTags.map(tag => (
        <span key={tag.id} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm flex items-center">
          {tag.name}
          <button onClick={() => onRemoveTag(tag.id)} className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
            <X size={14} />
          </button>
        </span>
      ))}
      {isAdding ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Add tag..."
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-40 overflow-auto">
              {suggestions.map(tag => (
                <li
                  key={tag.id}
                  onClick={() => handleAddTag(tag.name)}
                  className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
};

export default TagEditor;