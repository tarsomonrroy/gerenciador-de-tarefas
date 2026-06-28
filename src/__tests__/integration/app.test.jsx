/**
 * ============================================================
 * TESTES DE INTEGRAÇÃO — App completo
 * ============================================================
 *
 * Estes testes montam o App inteiro e validam fluxos reais
 * de ponta a ponta: adicionar → filtrar → editar → excluir.
 *
 * Mockamos o localStorage para isolamento total do browser.
 * Usamos userEvent para interações fiéis ao comportamento humano.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

// ─── Mock do localStorage ─────────────────────────────────────────────────

function createLocalStorageMock() {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]) }),
    get length() { return Object.keys(store).length },
    key: vi.fn((i) => Object.keys(store)[i] ?? null),
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createLocalStorageMock())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// ─── Helpers ──────────────────────────────────────────────────────────────

async function addTaskViaUI(user, text) {
  await user.type(screen.getByTestId('task-input'), text)
  await user.click(screen.getByTestId('add-button'))
}

// ─── Testes de integração ─────────────────────────────────────────────────

describe('App — integração completa', () => {
  it('exibe estado vazio ao iniciar sem tarefas', () => {
    render(<App />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('adiciona uma tarefa e a exibe na lista', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Minha primeira tarefa')

    expect(screen.getByText('Minha primeira tarefa')).toBeInTheDocument()
  })

  it('a lista fica visível após adicionar a primeira tarefa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Nova tarefa')

    expect(screen.getByTestId('task-list')).toBeInTheDocument()
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })

  it('adiciona várias tarefas e todas aparecem na lista', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Tarefa A')
    await addTaskViaUI(user, 'Tarefa B')
    await addTaskViaUI(user, 'Tarefa C')

    expect(screen.getAllByTestId('task-item')).toHaveLength(3)
  })

  it('marca uma tarefa como concluída e desmarca em seguida', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Tarefa para marcar')
    const checkbox = screen.getByTestId('task-checkbox')

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('remove uma tarefa da lista', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Tarefa para excluir')
    expect(screen.getByText('Tarefa para excluir')).toBeInTheDocument()

    await user.click(screen.getByTestId('delete-button'))

    expect(screen.queryByText('Tarefa para excluir')).not.toBeInTheDocument()
  })

  it('volta para estado vazio após remover todas as tarefas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Última tarefa')
    await user.click(screen.getByTestId('delete-button'))

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('edita o texto de uma tarefa existente', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Texto original')
    await user.click(screen.getByTestId('edit-button'))

    const editInput = screen.getByTestId('edit-input')
    await user.clear(editInput)
    await user.type(editInput, 'Texto editado')
    await user.click(screen.getByTestId('save-button'))

    expect(screen.getByText('Texto editado')).toBeInTheDocument()
    expect(screen.queryByText('Texto original')).not.toBeInTheDocument()
  })
})

describe('App — integração: filtros', () => {
  async function setupWithTasks() {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Pendente 1')
    await addTaskViaUI(user, 'Pendente 2')
    await addTaskViaUI(user, 'Para concluir')

    // Conclui a terceira tarefa
    const checkboxes = screen.getAllByTestId('task-checkbox')
    await user.click(checkboxes[2])

    return user
  }

  it('filtro "Pendentes" mostra só tarefas não concluídas', async () => {
    const user = await setupWithTasks()

    await user.click(screen.getByTestId('filter-active'))

    const items = screen.getAllByTestId('task-item')
    expect(items).toHaveLength(2)
    expect(screen.getByText('Pendente 1')).toBeInTheDocument()
    expect(screen.getByText('Pendente 2')).toBeInTheDocument()
    expect(screen.queryByText('Para concluir')).not.toBeInTheDocument()
  })

  it('filtro "Concluídas" mostra só tarefas concluídas', async () => {
    const user = await setupWithTasks()

    await user.click(screen.getByTestId('filter-completed'))

    const items = screen.getAllByTestId('task-item')
    expect(items).toHaveLength(1)
    expect(screen.getByText('Para concluir')).toBeInTheDocument()
  })

  it('filtro "Todas" restaura a visualização completa', async () => {
    const user = await setupWithTasks()

    await user.click(screen.getByTestId('filter-active'))
    await user.click(screen.getByTestId('filter-all'))

    expect(screen.getAllByTestId('task-item')).toHaveLength(3)
  })

  it('as estatísticas refletem os contadores corretos', async () => {
    await setupWithTasks()

    const stats = screen.getByTestId('filter-stats')
    expect(stats).toHaveTextContent('2 pendentes')
    expect(stats).toHaveTextContent('1 concluída')
  })
})

describe('App — integração: persistência no localStorage', () => {
  it('salva as tarefas no localStorage ao adicionar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Tarefa persistida')

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tasks',
      expect.stringContaining('Tarefa persistida')
    )
  })

  it('carrega tarefas salvas do localStorage ao iniciar', () => {
    const saved = [
      {
        id: '99',
        text: 'Tarefa do localStorage',
        completed: false,
        createdAt: '2024-01-01',
      },
    ]
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(saved))

    render(<App />)

    expect(screen.getByText('Tarefa do localStorage')).toBeInTheDocument()
  })

  it('persiste no localStorage ao marcar tarefa como concluída', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Salvar ao marcar')
    const initialCallCount = localStorage.setItem.mock.calls.length

    await user.click(screen.getByTestId('task-checkbox'))

    // Deve ter chamado setItem mais uma vez após o toggle
    expect(localStorage.setItem.mock.calls.length).toBeGreaterThan(initialCallCount)
  })

  it('persiste no localStorage ao remover uma tarefa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTaskViaUI(user, 'Será removida')
    await user.click(screen.getByTestId('delete-button'))

    // O último setItem deve ter salvo array vazio (ou sem essa tarefa)
    const lastCall = localStorage.setItem.mock.calls.at(-1)
    const saved = JSON.parse(lastCall[1])
    expect(saved.find((t) => t.text === 'Será removida')).toBeUndefined()
  })
})
