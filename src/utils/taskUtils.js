/**
 * Funções de negócio do Gerenciador de Tarefas.
 * Separadas do componente para facilitar testes unitários puros.
 */

/**
 * Adiciona uma nova tarefa à lista.
 * @param {Array} tasks - Lista atual de tarefas
 * @param {string} text - Texto da nova tarefa
 * @returns {Array} Nova lista com a tarefa adicionada
 */
export function addTask(tasks, text) {
  const trimmed = text.trim()
  if (!trimmed) return tasks

  const newTask = {
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  return [...tasks, newTask]
}

/**
 * Alterna o estado de conclusão de uma tarefa.
 * @param {Array} tasks - Lista atual de tarefas
 * @param {string} id - ID da tarefa a alternar
 * @returns {Array} Nova lista com o estado da tarefa alterado
 */
export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  )
}

/**
 * Remove uma tarefa da lista.
 * @param {Array} tasks - Lista atual de tarefas
 * @param {string} id - ID da tarefa a remover
 * @returns {Array} Nova lista sem a tarefa removida
 */
export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}

/**
 * Edita o texto de uma tarefa existente.
 * @param {Array} tasks - Lista atual de tarefas
 * @param {string} id - ID da tarefa a editar
 * @param {string} newText - Novo texto da tarefa
 * @returns {Array} Nova lista com o texto da tarefa atualizado
 */
export function editTask(tasks, id, newText) {
  const trimmed = newText.trim()
  if (!trimmed) return tasks

  return tasks.map((task) =>
    task.id === id ? { ...task, text: trimmed } : task
  )
}

/**
 * Filtra tarefas com base no filtro selecionado.
 * @param {Array} tasks - Lista completa de tarefas
 * @param {'all'|'active'|'completed'} filter - Tipo de filtro
 * @returns {Array} Lista filtrada
 */
export function filterTasks(tasks, filter) {
  switch (filter) {
    case 'active':
      return tasks.filter((t) => !t.completed)
    case 'completed':
      return tasks.filter((t) => t.completed)
    default:
      return tasks
  }
}

/**
 * Carrega tarefas do localStorage.
 * @returns {Array} Lista de tarefas ou array vazio
 */
export function loadTasksFromStorage() {
  try {
    const stored = localStorage.getItem('tasks')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Salva tarefas no localStorage.
 * @param {Array} tasks - Lista de tarefas a salvar
 */
export function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  } catch {
    // Silencia erros de storage (ex.: modo privado)
  }
}
