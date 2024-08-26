import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Home, ListTodo, Menu, X } from "lucide-react";
import FolderExplorer from "./components/FolderExplorer";
import FavoritesList from "./components/FavoritesList";
import TasksPage from "./components/TasksPage";

function App() {
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState("All Favorites");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleFolderSelect = useCallback((folderId, folderName) => {
        setSelectedFolderId(folderId === 1 ? null : folderId);
        setSelectedFolderName(folderId === 1 ? "All Favorites" : folderName);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    }, [isSidebarOpen]);

    return (
        <Router>
            <div className="flex flex-col h-screen bg-gray-100">
                <nav className="bg-white text-gray-800 border-b border-gray-200 z-20">
                    <ul className="flex justify-between h-14 items-center px-4">
                        <li className="md:hidden">
                            <button onClick={toggleSidebar} className="p-2">
                                <Menu size={24} />
                            </button>
                        </li>
                        <li className="flex">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 p-2 rounded transition-colors ${
                                        isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                                    }`
                                }
                            >
                                <Home size={20} />
                                <span className="hidden md:inline">Home</span>
                            </NavLink>
                            <NavLink
                                to="/tasks"
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 p-2 rounded transition-colors ${
                                        isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                                    }`
                                }
                            >
                                <ListTodo size={20} />
                                <span className="hidden md:inline">Tasks</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar for mobile */}
                    <div className={`md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className={`fixed inset-y-0 left-0 w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold">Folders</h2>
                                <button onClick={toggleSidebar} className="p-2">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-4 h-full overflow-auto">
                                <FolderExplorer onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
                            </div>
                        </div>
                    </div>
                    {/* Sidebar for desktop */}
                    <div className="hidden md:block md:w-1/4 bg-white shadow-md">
                        <div className="p-4 h-full overflow-auto">
                            <FolderExplorer onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
                        </div>
                    </div>
                    <div className="w-full md:w-3/4 p-4 overflow-auto">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <h1 className="text-3xl font-bold mb-4">{selectedFolderName}</h1>
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