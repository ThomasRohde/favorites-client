import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Plus, X } from "lucide-react";
import EditFavorite from "./EditFavorite";
import DeleteFavorite from "./DeleteFavorite";
import { useNavigate } from "react-router-dom";
import { updateFavorite, getTags, createTag } from "../services/api";

const FavoriteCard = ({ favorite, onUpdate, onDelete, onFolderSelect, folderPath }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagInput, setNewTagInput] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const navigate = useNavigate();

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const handleTagClick = (tagName) => {
        navigate(`/tag-search/${encodeURIComponent(tagName)}`);
    };

    const handleAddTag = async () => {
        setIsAddingTag(true);
    };

    const handleTagInputChange = async (e) => {
        const input = e.target.value;
        setNewTagInput(input);
        if (input.length > 0) {
            const allTags = await getTags();
            const filtered = allTags.filter(
                (tag) =>
                    tag.name.toLowerCase().includes(input.toLowerCase()) &&
                    !favorite.tags.some((existingTag) => existingTag.id === tag.id)
            );
            setTagSuggestions(filtered);
        } else {
            setTagSuggestions([]);
        }
    };

    const addTagToFavorite = async (tagToAdd) => {
        const updatedTags = [...favorite.tags, tagToAdd];
        try {
            const updatedFavorite = await updateFavorite(favorite.id, { tags: updatedTags.map((tag) => tag.name) });
            onUpdate(updatedFavorite);
            setIsAddingTag(false);
            setNewTagInput("");
            setTagSuggestions([]);
        } catch (error) {
            console.error("Failed to add tag:", error);
        }
    };

    const handleTagKeyDown = async (e) => {
        if (e.key === "Enter" && newTagInput) {
            e.preventDefault();
            let tagToAdd;
            const existingTag = tagSuggestions.find((tag) => tag.name.toLowerCase() === newTagInput.toLowerCase());
            if (existingTag) {
                tagToAdd = existingTag;
            } else {
                tagToAdd = await createTag(newTagInput);
            }
            addTagToFavorite(tagToAdd);
        } else if (e.key === "Escape") {
            setIsAddingTag(false);
            setNewTagInput("");
            setTagSuggestions([]);
        }
    };

    const removeTag = async (tagId) => {
        const updatedTags = favorite.tags.filter((tag) => tag.id !== tagId);
        try {
            const updatedFavorite = await updateFavorite(favorite.id, { tags: updatedTags.map((tag) => tag.name) });
            onUpdate(updatedFavorite);
        } catch (error) {
            console.error("Failed to remove tag:", error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">
                    <a
                        href={favorite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {favorite.title || "Untitled"}
                    </a>
                </h3>
                <div className="flex space-x-2">
                    <EditFavorite favorite={favorite} onUpdate={onUpdate} />
                    <DeleteFavorite favorite={favorite} onDelete={onDelete} />
                </div>
            </div>
            {folderPath && folderPath.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center flex-wrap">
                    {folderPath.map((folder, index) => (
                        <React.Fragment key={folder.id}>
                            <button
                                onClick={() => onFolderSelect(folder.id, folder.name)}
                                className="hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus:text-blue-500 dark:focus:text-blue-400 transition-colors duration-200"
                            >
                                {folder.name}
                            </button>
                            {index < folderPath.length - 1 && <ChevronRight size={14} className="mx-1" />}
                        </React.Fragment>
                    ))}
                </div>
            )}
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                {isExpanded ? (
                    <p>{favorite.summary || "No summary available"}</p>
                ) : (
                    <p>
                        {favorite.summary
                            ? `${favorite.summary.slice(0, 100)}${favorite.summary.length > 100 ? "..." : ""}`
                            : "No summary available"}
                    </p>
                )}
                {favorite.summary && favorite.summary.length > 100 && (
                    <button
                        onClick={toggleDescription}
                        className="text-blue-500 dark:text-blue-400 text-xs hover:underline focus:outline-none mt-1 flex items-center"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp size={16} className="mr-1" />
                                Show less
                            </>
                        ) : (
                            <>
                                <ChevronDown size={16} className="mr-1" />
                                Show more
                            </>
                        )}
                    </button>
                )}
            </div>
            <div className="flex flex-wrap items-center">
                {favorite.tags &&
                    favorite.tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full mr-1.5 mb-1.5 text-xs"
                        >
                            <button
                                onClick={() => handleTagClick(tag.name)}
                                className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                {tag.name}
                            </button>
                            <button
                                onClick={() => removeTag(tag.id)}
                                className="ml-0.5 text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                {isAddingTag ? (
                    <div className="relative">
                        <input
                            type="text"
                            value={newTagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            placeholder="Add tag..."
                            autoFocus
                        />
                        {tagSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-40 overflow-auto">
                                {tagSuggestions.map((tag) => (
                                    <li
                                        key={tag.id}
                                        onClick={() => addTagToFavorite(tag)}
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
                        onClick={handleAddTag}
                        className="bg-blue-500 text-white px-1.5 py-0.5 rounded-full mr-1.5 mb-1.5 text-xs hover:bg-blue-600 transition-colors duration-200 flex items-center"
                    >
                        <Plus size={10} className="mr-0.5" />
                        Add
                    </button>
                )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Created: {new Date(favorite.created_at).toLocaleDateString()}
            </div>
        </div>
    );
};

export default FavoriteCard;
