import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Home, ListTodo, Menu, X, Sun, Moon, Download, Upload } from "lucide-react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import FolderExplorer from "./components/FolderExplorer";
import FavoritesList from "./components/FavoritesList";
import FavoritesByFuzzyTag from "./components/FavoritesByFuzzyTag";
import TasksPage from "./components/TasksPage";
import ImportDialog from "./components/ImportDialog";
import ExportDialog from "./components/ExportDialog";

function ThemeToggle() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    return (
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}

function AppContent() {
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState("All Favorites");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const handleFolderSelect = useCallback((folderId, folderName) => {
        setSelectedFolderId(folderId === 1 ? null : folderId);
        setSelectedFolderName(folderId === 1 ? "All Favorites" : folderName);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add("sidebar-open");
        } else {
            document.body.classList.remove("sidebar-open");
        }
    }, [isSidebarOpen]);

    return (
        <Router>
            <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
                <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 z-20">
                    {/* ... (navigation code remains the same) ... */}
                </nav>
                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar for mobile */}
                    <div
                        className={`md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity duration-300 ${
                            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        {/* ... (mobile sidebar code remains the same) ... */}
                    </div>
                    {/* Sidebar for desktop */}
                    <div className="hidden md:block md:w-1/4 bg-white dark:bg-gray-800 overflow-hidden">
                        <FolderExplorer onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
                    </div>
                    <div className="w-full md:w-3/4 p-4 overflow-auto bg-gray-100 dark:bg-gray-900">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                                            {selectedFolderName}
                                        </h1>
                                        <FavoritesList
                                            selectedFolderId={selectedFolderId}
                                            onFolderSelect={handleFolderSelect}
                                        />
                                    </>
                                }
                            />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route 
                                path="/tag-search/:query" 
                                element={<FavoritesByFuzzyTag />}
                            />
                        </Routes>
                    </div>
                </div>
                <ImportDialog isOpen={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)} />
                <ExportDialog isOpen={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)} />
            </div>
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;