import { TaskItem } from './TaskItem'

export function TaskList({ tasks, onToggle, onRemove, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="task-empty" data-testid="empty-state">
        <p>Nenhuma tarefa aqui. Adicione uma acima!</p>
      </div>
    )
  }

  return (
    <ul className="task-list" data-testid="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
