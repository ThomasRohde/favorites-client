import React, { useState, useEffect } from 'react';
import { getTasks, restartImport } from '../services/api';
import { RefreshCw } from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRestartImport = async () => {
    try {
      await restartImport();
      // Refetch tasks to show updated status
      fetchTasks();
    } catch (err) {
      console.error('Error restarting import:', err);
      setError('Failed to restart import');
    }
  };

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading tasks...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{task.name}</h3>
          <p className="text-gray-600 dark:text-gray-400">Status: {task.status}</p>
          <p className="text-gray-600 dark:text-gray-400">Progress: {task.progress}</p>
          {task.status === 'restartable' && (
            <button
              onClick={handleRestartImport}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Restart Import
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TasksPage;