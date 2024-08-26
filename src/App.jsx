import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Home, ListTodo } from "lucide-react";
import FolderExplorer from "./components/FolderExplorer";
import FavoritesList from "./components/FavoritesList";
import TasksPage from "./components/TasksPage";

function App() {
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    const handleFolderSelect = useCallback((folderId) => {
        setSelectedFolderId(folderId === 1 ? null : folderId);
    }, []);

    return (
        <Router>
            <div className="flex flex-col h-screen bg-gray-100">
                <nav className="bg-white text-gray-800 border-b border-gray-200">
                    <ul className="flex justify-start h-14 items-center px-4">
                        <li className="mr-4">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 p-2 rounded transition-colors ${
                                        isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                                    }`
                                }
                            >
                                <Home size={20} />
                                <span>Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/tasks"
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 p-2 rounded transition-colors ${
                                        isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                                    }`
                                }
                            >
                                <ListTodo size={20} />
                                <span>Tasks</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="flex flex-grow overflow-hidden">
                    <div className="w-1/4 bg-white shadow-md">
                        <div className="p-4 h-full overflow-auto">
                            <FolderExplorer onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
                        </div>
                    </div>
                    <div className="w-3/4 p-4 overflow-auto">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <h1 className="text-3xl font-bold mb-4">Favorites</h1>
                                        <FavoritesList selectedFolderId={selectedFolderId} />
                                    </>
                                }
                            />
                            <Route path="/tasks" element={<TasksPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
