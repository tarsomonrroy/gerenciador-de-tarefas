import { useState } from 'react'

export function TaskItem({ task, onToggle, onRemove, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.text)

  function handleEditSubmit(e) {
    e.preventDefault()
    if (!editValue.trim()) return
    onEdit(task.id, editValue)
    setIsEditing(false)
  }

  function handleEditCancel() {
    setEditValue(task.text)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') handleEditCancel()
  }

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
      data-testid="task-item"
    >
      {isEditing ? (
        <form
          className="task-edit-form"
          onSubmit={handleEditSubmit}
          data-testid="edit-form"
        >
          <input
            type="text"
            className="task-input task-input--edit"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Editar tarefa"
            data-testid="edit-input"
            autoFocus
          />
          <div className="task-edit-actions">
            <button
              type="submit"
              className="btn btn-save"
              disabled={!editValue.trim()}
              data-testid="save-button"
            >
              Salvar
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleEditCancel}
              data-testid="cancel-button"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <label className="task-label">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              aria-label={`Marcar "${task.text}" como ${task.completed ? 'pendente' : 'concluída'}`}
              data-testid="task-checkbox"
            />
            <span className="task-text" data-testid="task-text">
              {task.text}
            </span>
          </label>

          <div className="task-actions">
            <button
              className="btn btn-edit"
              onClick={() => setIsEditing(true)}
              aria-label={`Editar "${task.text}"`}
              data-testid="edit-button"
            >
              Editar
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onRemove(task.id)}
              aria-label={`Excluir "${task.text}"`}
              data-testid="delete-button"
            >
              Excluir
            </button>
          </div>
        </>
      )}
    </li>
  )
}
