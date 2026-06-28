import { useState } from 'react'

export function TaskForm({ onAdd }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} data-testid="task-form">
      <input
        type="text"
        className="task-input"
        placeholder="Nova tarefa..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Nova tarefa"
        data-testid="task-input"
      />
      <button
        type="submit"
        className="btn btn-add"
        disabled={!value.trim()}
        data-testid="add-button"
      >
        Adicionar
      </button>
    </form>
  )
}
