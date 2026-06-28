import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskFilter } from './components/TaskFilter'

export default function App() {
  const {
    tasks,
    filter,
    stats,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
    editTask,
  } = useTasks()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="app-title__icon">✓</span>
          Gerenciador de Tarefas
        </h1>
        <p className="app-subtitle">
          {stats.total === 0
            ? 'Comece adicionando sua primeira tarefa'
            : `${stats.total} tarefa${stats.total !== 1 ? 's' : ''} no total`}
        </p>
      </header>

      <main className="app-main">
        <TaskForm onAdd={addTask} />

        {stats.total > 0 && (
          <TaskFilter
            currentFilter={filter}
            stats={stats}
            onFilterChange={setFilter}
          />
        )}

        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onRemove={removeTask}
          onEdit={editTask}
        />
      </main>
    </div>
  )
}
