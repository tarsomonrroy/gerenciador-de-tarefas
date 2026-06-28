import { useState, useEffect, useCallback } from 'react'
import {
  addTask,
  toggleTask,
  removeTask,
  editTask,
  filterTasks,
  loadTasksFromStorage,
  saveTasksToStorage,
} from '../utils/taskUtils'

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage())
  const [filter, setFilter] = useState('all')

  // Persiste no localStorage sempre que as tarefas mudarem
  useEffect(() => {
    saveTasksToStorage(tasks)
  }, [tasks])

  const handleAddTask = useCallback((text) => {
    setTasks((prev) => addTask(prev, text))
  }, [])

  const handleToggleTask = useCallback((id) => {
    setTasks((prev) => toggleTask(prev, id))
  }, [])

  const handleRemoveTask = useCallback((id) => {
    setTasks((prev) => removeTask(prev, id))
  }, [])

  const handleEditTask = useCallback((id, newText) => {
    setTasks((prev) => editTask(prev, id, newText))
  }, [])

  const filteredTasks = filterTasks(tasks, filter)

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }

  return {
    tasks: filteredTasks,
    filter,
    stats,
    setFilter,
    addTask: handleAddTask,
    toggleTask: handleToggleTask,
    removeTask: handleRemoveTask,
    editTask: handleEditTask,
  }
}
