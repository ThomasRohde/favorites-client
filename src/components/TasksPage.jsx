import React, { useState, useEffect, useCallback } from 'react'
import { getTasks } from '../services/api'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])

  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await getTasks()
      setTasks(fetchedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }, [])

  useEffect(() => {
    fetchTasks() // Fetch tasks immediately on component mount

    const intervalId = setInterval(fetchTasks, 2000) // Poll every 2 seconds

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [fetchTasks])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>
      <div className="bg-white rounded shadow p-4">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
                    <p className="text-sm text-gray-500">{task.status}</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {task.progress}%
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TasksPage