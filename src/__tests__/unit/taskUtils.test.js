/**
 * ============================================================
 * TESTES UNITÁRIOS — Funções de Negócio (taskUtils.js)
 * ============================================================
 *
 * Estes testes são PURAMENTE unitários: testam funções JavaScript
 * isoladas, sem DOM, sem React, sem efeitos colaterais.
 *
 * Por que separar a lógica de negócio em funções puras?
 * → Facilita testar sem montar componentes.
 * → Cada função tem uma responsabilidade clara.
 * → Erros de lógica aparecem nos testes mais simples e rápidos.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  addTask,
  toggleTask,
  removeTask,
  editTask,
  filterTasks,
} from '../../utils/taskUtils'

// ─── Fixture reutilizável ──────────────────────────────────────────────────

/** Gera uma lista de tarefas de exemplo para reusar nos testes. */
function makeTasks() {
  return [
    { id: '1', text: 'Comprar leite', completed: false, createdAt: '2024-01-01' },
    { id: '2', text: 'Ler livro', completed: true, createdAt: '2024-01-02' },
    { id: '3', text: 'Fazer exercício', completed: false, createdAt: '2024-01-03' },
  ]
}

// ─── addTask ──────────────────────────────────────────────────────────────

describe('addTask', () => {
  it('adiciona uma tarefa ao final da lista', () => {
    const tasks = makeTasks()
    const result = addTask(tasks, 'Nova tarefa')

    expect(result).toHaveLength(4)
    expect(result[3].text).toBe('Nova tarefa')
  })

  it('a nova tarefa começa sempre como não concluída', () => {
    const result = addTask([], 'Tarefa inicial')

    expect(result[0].completed).toBe(false)
  })

  it('gera um id único para cada tarefa', () => {
    const result1 = addTask([], 'Tarefa A')
    const result2 = addTask([], 'Tarefa B')

    expect(result1[0].id).not.toBe(result2[0].id)
  })

  it('remove espaços do início e fim do texto (trim)', () => {
    const result = addTask([], '   Texto com espaços   ')

    expect(result[0].text).toBe('Texto com espaços')
  })

  it('não adiciona tarefa quando o texto é vazio', () => {
    const tasks = makeTasks()
    const result = addTask(tasks, '')

    expect(result).toHaveLength(tasks.length)
  })

  it('não adiciona tarefa quando o texto é só espaços em branco', () => {
    const tasks = makeTasks()
    const result = addTask(tasks, '   ')

    expect(result).toHaveLength(tasks.length)
  })

  it('não muta a lista original (imutabilidade)', () => {
    const tasks = makeTasks()
    const original = [...tasks]
    addTask(tasks, 'Nova')

    expect(tasks).toEqual(original)
  })

  it('a tarefa nova inclui o campo createdAt', () => {
    const result = addTask([], 'Com data')

    expect(result[0].createdAt).toBeDefined()
    expect(typeof result[0].createdAt).toBe('string')
  })
})

// ─── toggleTask ───────────────────────────────────────────────────────────

describe('toggleTask', () => {
  it('marca como concluída uma tarefa pendente', () => {
    const tasks = makeTasks()
    const result = toggleTask(tasks, '1') // id '1' está pending

    const toggled = result.find((t) => t.id === '1')
    expect(toggled.completed).toBe(true)
  })

  it('marca como pendente uma tarefa já concluída', () => {
    const tasks = makeTasks()
    const result = toggleTask(tasks, '2') // id '2' está completed

    const toggled = result.find((t) => t.id === '2')
    expect(toggled.completed).toBe(false)
  })

  it('não altera as outras tarefas da lista', () => {
    const tasks = makeTasks()
    const result = toggleTask(tasks, '1')

    // id '2' e '3' permanecem iguais
    expect(result.find((t) => t.id === '2').completed).toBe(true)
    expect(result.find((t) => t.id === '3').completed).toBe(false)
  })

  it('retorna a mesma lista se o id não existir', () => {
    const tasks = makeTasks()
    const result = toggleTask(tasks, 'id-inexistente')

    expect(result).toEqual(tasks)
  })

  it('não muta a lista original (imutabilidade)', () => {
    const tasks = makeTasks()
    const originalState = tasks[0].completed
    toggleTask(tasks, '1')

    expect(tasks[0].completed).toBe(originalState)
  })
})

// ─── removeTask ───────────────────────────────────────────────────────────

describe('removeTask', () => {
  it('remove a tarefa com o id informado', () => {
    const tasks = makeTasks()
    const result = removeTask(tasks, '2')

    expect(result).toHaveLength(2)
    expect(result.find((t) => t.id === '2')).toBeUndefined()
  })

  it('mantém as demais tarefas intactas', () => {
    const tasks = makeTasks()
    const result = removeTask(tasks, '2')

    expect(result.find((t) => t.id === '1')).toBeDefined()
    expect(result.find((t) => t.id === '3')).toBeDefined()
  })

  it('retorna a mesma lista se o id não existir', () => {
    const tasks = makeTasks()
    const result = removeTask(tasks, 'nao-existe')

    expect(result).toHaveLength(tasks.length)
  })

  it('funciona em lista com um único item', () => {
    const single = [{ id: 'x', text: 'Só eu', completed: false }]
    const result = removeTask(single, 'x')

    expect(result).toHaveLength(0)
  })

  it('não muta a lista original (imutabilidade)', () => {
    const tasks = makeTasks()
    removeTask(tasks, '1')

    expect(tasks).toHaveLength(3)
  })
})

// ─── editTask ─────────────────────────────────────────────────────────────

describe('editTask', () => {
  it('atualiza o texto da tarefa com o id informado', () => {
    const tasks = makeTasks()
    const result = editTask(tasks, '1', 'Comprar pão')

    expect(result.find((t) => t.id === '1').text).toBe('Comprar pão')
  })

  it('preserva o estado de conclusão ao editar', () => {
    const tasks = makeTasks()
    const result = editTask(tasks, '2', 'Ler outro livro') // id '2' era completed

    expect(result.find((t) => t.id === '2').completed).toBe(true)
  })

  it('aplica trim no texto editado', () => {
    const tasks = makeTasks()
    const result = editTask(tasks, '1', '  Texto limpo  ')

    expect(result.find((t) => t.id === '1').text).toBe('Texto limpo')
  })

  it('não edita se o novo texto for vazio', () => {
    const tasks = makeTasks()
    const result = editTask(tasks, '1', '')

    expect(result.find((t) => t.id === '1').text).toBe('Comprar leite')
  })

  it('não edita se o novo texto for só espaços', () => {
    const tasks = makeTasks()
    const result = editTask(tasks, '1', '   ')

    expect(result.find((t) => t.id === '1').text).toBe('Comprar leite')
  })

  it('não muta a lista original (imutabilidade)', () => {
    const tasks = makeTasks()
    editTask(tasks, '1', 'Novo texto')

    expect(tasks[0].text).toBe('Comprar leite')
  })
})

// ─── filterTasks ──────────────────────────────────────────────────────────

describe('filterTasks', () => {
  let tasks

  beforeEach(() => {
    tasks = makeTasks()
    // 2 pendentes (id 1, 3), 1 concluída (id 2)
  })

  it('filtro "all" retorna todas as tarefas', () => {
    expect(filterTasks(tasks, 'all')).toHaveLength(3)
  })

  it('filtro "active" retorna somente as pendentes', () => {
    const result = filterTasks(tasks, 'active')

    expect(result).toHaveLength(2)
    result.forEach((t) => expect(t.completed).toBe(false))
  })

  it('filtro "completed" retorna somente as concluídas', () => {
    const result = filterTasks(tasks, 'completed')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })

  it('filtro desconhecido age como "all"', () => {
    expect(filterTasks(tasks, 'desconhecido')).toHaveLength(3)
  })

  it('retorna array vazio se não houver tarefas pendentes', () => {
    const allDone = tasks.map((t) => ({ ...t, completed: true }))
    expect(filterTasks(allDone, 'active')).toHaveLength(0)
  })

  it('retorna array vazio se não houver tarefas concluídas', () => {
    const allPending = tasks.map((t) => ({ ...t, completed: false }))
    expect(filterTasks(allPending, 'completed')).toHaveLength(0)
  })
})
