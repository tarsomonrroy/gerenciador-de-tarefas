/**
 * ============================================================
 * TESTES DE INTERAÇÃO — Simulação de cliques e formulários
 * ============================================================
 *
 * Estes testes simulam o que o USUÁRIO faz na interface:
 * digitar, clicar, pressionar teclas — usando userEvent.
 *
 * Por que userEvent em vez de fireEvent?
 * → userEvent.type() dispara eventos reais (keydown, keypress,
 *   keyup, input, change) em sequência, como um humano faria.
 * → fireEvent é mais baixo nível e não simula o comportamento
 *   completo do browser.
 *
 * Técnicas demonstradas:
 * - userEvent.setup() → instância isolada por teste
 * - userEvent.type() → digitar em campos
 * - userEvent.click() → clicar em elementos
 * - userEvent.keyboard() → teclas especiais (Enter, Escape)
 * - expect(fn).toHaveBeenCalledWith() → verificar callbacks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../../components/TaskForm'
import { TaskItem } from '../../components/TaskItem'
import { TaskFilter } from '../../components/TaskFilter'

// ─── Fixture ──────────────────────────────────────────────────────────────

const pendingTask = {
  id: '1',
  text: 'Comprar leite',
  completed: false,
  createdAt: '2024-01-01',
}

const completedTask = {
  id: '2',
  text: 'Ler livro',
  completed: true,
  createdAt: '2024-01-02',
}

// ─── TaskForm — interações ────────────────────────────────────────────────

describe('TaskForm — interações', () => {
  let user
  let onAdd

  beforeEach(() => {
    user = userEvent.setup()
    onAdd = vi.fn()
  })

  it('habilita o botão ao digitar texto no campo', async () => {
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByTestId('task-input'), 'Nova tarefa')

    expect(screen.getByTestId('add-button')).not.toBeDisabled()
  })

  it('chama onAdd com o texto digitado ao clicar em Adicionar', async () => {
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByTestId('task-input'), 'Fazer compras')
    await user.click(screen.getByTestId('add-button'))

    expect(onAdd).toHaveBeenCalledWith('Fazer compras')
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('chama onAdd ao pressionar Enter no campo', async () => {
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByTestId('task-input'), 'Via Enter{Enter}')

    expect(onAdd).toHaveBeenCalledWith('Via Enter')
  })

  it('limpa o campo após adicionar a tarefa', async () => {
    render(<TaskForm onAdd={onAdd} />)
    const input = screen.getByTestId('task-input')

    await user.type(input, 'Tarefa temporária')
    await user.click(screen.getByTestId('add-button'))

    expect(input).toHaveValue('')
  })

  it('desabilita o botão novamente após limpar o campo', async () => {
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByTestId('task-input'), 'Algo')
    await user.click(screen.getByTestId('add-button'))

    expect(screen.getByTestId('add-button')).toBeDisabled()
  })

  it('não chama onAdd se o campo tiver apenas espaços', async () => {
    render(<TaskForm onAdd={onAdd} />)

    // Força o valor com espaços diretamente, já que o botão ficaria disabled
    const input = screen.getByTestId('task-input')
    await user.type(input, '   ')

    // Tenta submeter via Enter
    await user.keyboard('{Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('adiciona múltiplas tarefas em sequência', async () => {
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByTestId('task-input'), 'Tarefa 1{Enter}')
    await user.type(screen.getByTestId('task-input'), 'Tarefa 2{Enter}')

    expect(onAdd).toHaveBeenCalledTimes(2)
    expect(onAdd).toHaveBeenNthCalledWith(1, 'Tarefa 1')
    expect(onAdd).toHaveBeenNthCalledWith(2, 'Tarefa 2')
  })
})

// ─── TaskItem — interações ────────────────────────────────────────────────

describe('TaskItem — interações: toggle e delete', () => {
  let user
  let onToggle, onRemove, onEdit

  beforeEach(() => {
    user = userEvent.setup()
    onToggle = vi.fn()
    onRemove = vi.fn()
    onEdit = vi.fn()
  })

  it('chama onToggle com o id correto ao clicar no checkbox', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('task-checkbox'))

    expect(onToggle).toHaveBeenCalledWith('1')
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('chama onRemove com o id correto ao clicar em Excluir', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('delete-button'))

    expect(onRemove).toHaveBeenCalledWith('1')
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('não chama onToggle ao clicar em Excluir', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('delete-button'))

    expect(onToggle).not.toHaveBeenCalled()
  })
})

describe('TaskItem — interações: edição', () => {
  let user
  let onToggle, onRemove, onEdit

  beforeEach(() => {
    user = userEvent.setup()
    onToggle = vi.fn()
    onRemove = vi.fn()
    onEdit = vi.fn()
  })

  it('exibe o formulário de edição ao clicar em Editar', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))

    expect(screen.getByTestId('edit-form')).toBeInTheDocument()
    expect(screen.getByTestId('edit-input')).toBeInTheDocument()
  })

  it('preenche o campo de edição com o texto atual da tarefa', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))

    expect(screen.getByTestId('edit-input')).toHaveValue('Comprar leite')
  })

  it('chama onEdit com o novo texto ao salvar', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))
    const editInput = screen.getByTestId('edit-input')
    await user.clear(editInput)
    await user.type(editInput, 'Texto editado')
    await user.click(screen.getByTestId('save-button'))

    expect(onEdit).toHaveBeenCalledWith('1', 'Texto editado')
  })

  it('chama onEdit ao pressionar Enter no campo de edição', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))
    const editInput = screen.getByTestId('edit-input')
    await user.clear(editInput)
    await user.type(editInput, 'Via Enter{Enter}')

    expect(onEdit).toHaveBeenCalledWith('1', 'Via Enter')
  })

  it('cancela a edição ao clicar em Cancelar e restaura o texto original', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))
    const editInput = screen.getByTestId('edit-input')
    await user.clear(editInput)
    await user.type(editInput, 'Texto que não será salvo')
    await user.click(screen.getByTestId('cancel-button'))

    // Volta para modo visualização com o texto original
    expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument()
    expect(screen.getByTestId('task-text')).toHaveTextContent('Comprar leite')
    expect(onEdit).not.toHaveBeenCalled()
  })

  it('cancela a edição ao pressionar Escape', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))
    await user.keyboard('{Escape}')

    expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument()
    expect(onEdit).not.toHaveBeenCalled()
  })

  it('botão Salvar fica desabilitado quando o campo de edição está vazio', async () => {
    render(
      <TaskItem
        task={pendingTask}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    )

    await user.click(screen.getByTestId('edit-button'))
    await user.clear(screen.getByTestId('edit-input'))

    expect(screen.getByTestId('save-button')).toBeDisabled()
  })
})

// ─── TaskFilter — interações ──────────────────────────────────────────────

describe('TaskFilter — interações', () => {
  let user
  let onFilterChange

  const stats = { total: 3, active: 2, completed: 1 }

  beforeEach(() => {
    user = userEvent.setup()
    onFilterChange = vi.fn()
  })

  it('chama onFilterChange com "active" ao clicar em Pendentes', async () => {
    render(
      <TaskFilter
        currentFilter="all"
        stats={stats}
        onFilterChange={onFilterChange}
      />
    )

    await user.click(screen.getByTestId('filter-active'))

    expect(onFilterChange).toHaveBeenCalledWith('active')
  })

  it('chama onFilterChange com "completed" ao clicar em Concluídas', async () => {
    render(
      <TaskFilter
        currentFilter="all"
        stats={stats}
        onFilterChange={onFilterChange}
      />
    )

    await user.click(screen.getByTestId('filter-completed'))

    expect(onFilterChange).toHaveBeenCalledWith('completed')
  })

  it('chama onFilterChange com "all" ao clicar em Todas', async () => {
    render(
      <TaskFilter
        currentFilter="active"
        stats={stats}
        onFilterChange={onFilterChange}
      />
    )

    await user.click(screen.getByTestId('filter-all'))

    expect(onFilterChange).toHaveBeenCalledWith('all')
  })

  it('cada botão de filtro dispara apenas um evento', async () => {
    render(
      <TaskFilter
        currentFilter="all"
        stats={stats}
        onFilterChange={onFilterChange}
      />
    )

    await user.click(screen.getByTestId('filter-active'))

    expect(onFilterChange).toHaveBeenCalledTimes(1)
  })
})
