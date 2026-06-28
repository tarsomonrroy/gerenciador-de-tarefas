const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
]

export function TaskFilter({ currentFilter, stats, onFilterChange }) {
  return (
    <div className="task-filter" data-testid="task-filter">
      <div className="filter-stats" data-testid="filter-stats">
        <span>{stats.active} pendente{stats.active !== 1 ? 's' : ''}</span>
        <span>·</span>
        <span>{stats.completed} concluída{stats.completed !== 1 ? 's' : ''}</span>
      </div>

      <div className="filter-buttons" role="group" aria-label="Filtrar tarefas">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            className={`btn btn-filter ${currentFilter === value ? 'btn-filter--active' : ''}`}
            onClick={() => onFilterChange(value)}
            aria-pressed={currentFilter === value}
            data-testid={`filter-${value}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
