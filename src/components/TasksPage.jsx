import React, { useState, useEffect } from 'react';
import { getTasks } from '../services/api';
import { useTheme } from '../ThemeContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();

    // Set up polling every 5 seconds
    const pollInterval = setInterval(fetchTasks, 5000);

    // Clean up function to clear the interval when the component unmounts
    return () => clearInterval(pollInterval);
  }, []);

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading tasks...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Tasks</h2>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {tasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{task.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">Status: {task.status}</p>
                <p className="text-gray-600 dark:text-gray-400">Progress: {task.progress}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TasksPage;