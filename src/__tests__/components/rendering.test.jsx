/**
 * ============================================================
 * TESTES DE COMPONENTES — Renderização
 * ============================================================
 *
 * Estes testes verificam a ESTRUTURA e APRESENTAÇÃO dos componentes:
 * - Elementos corretos aparecem no DOM
 * - Props são refletidas no que é exibido
 * - Estados condicionais (vazio, preenchido, editando) rendem corretamente
 *
 * Ferramentas:
 * - @testing-library/react → render, screen
 * - queries acessíveis (getByRole, getByText, getByTestId)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskForm } from '../../components/TaskForm'
import { TaskItem } from '../../components/TaskItem'
import { TaskList } from '../../components/TaskList'
import { TaskFilter } from '../../components/TaskFilter'

// ─── Fixtures ─────────────────────────────────────────────────────────────

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

const noop = vi.fn()

// ─── TaskForm ─────────────────────────────────────────────────────────────

describe('TaskForm — renderização', () => {
  it('renderiza o campo de input', () => {
    render(<TaskForm onAdd={noop} />)

    expect(screen.getByTestId('task-input')).toBeInTheDocument()
  })

  it('renderiza o botão de adicionar', () => {
    render(<TaskForm onAdd={noop} />)

    expect(screen.getByTestId('add-button')).toBeInTheDocument()
  })

  it('o botão começa desabilitado quando o campo está vazio', () => {
    render(<TaskForm onAdd={noop} />)

    expect(screen.getByTestId('add-button')).toBeDisabled()
  })

  it('o campo tem o placeholder correto', () => {
    render(<TaskForm onAdd={noop} />)

    expect(screen.getByPlaceholderText('Nova tarefa...')).toBeInTheDocument()
  })

  it('o campo tem aria-label acessível', () => {
    render(<TaskForm onAdd={noop} />)

    expect(screen.getByLabelText('Nova tarefa')).toBeInTheDocument()
  })
})

// ─── TaskItem — pendente ──────────────────────────────────────────────────

describe('TaskItem — tarefa pendente', () => {
  it('exibe o texto da tarefa', () => {
    render(
      <TaskItem task={pendingTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('task-text')).toHaveTextContent('Comprar leite')
  })

  it('checkbox aparece desmarcado para tarefa pendente', () => {
    render(
      <TaskItem task={pendingTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('task-checkbox')).not.toBeChecked()
  })

  it('exibe o botão de editar', () => {
    render(
      <TaskItem task={pendingTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('edit-button')).toBeInTheDocument()
  })

  it('exibe o botão de excluir', () => {
    render(
      <TaskItem task={pendingTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('delete-button')).toBeInTheDocument()
  })

  it('não aplica classe de concluída em tarefa pendente', () => {
    render(
      <TaskItem task={pendingTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('task-item')).not.toHaveClass('task-item--completed')
  })
})

// ─── TaskItem — concluída ─────────────────────────────────────────────────

describe('TaskItem — tarefa concluída', () => {
  it('checkbox aparece marcado para tarefa concluída', () => {
    render(
      <TaskItem task={completedTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('task-checkbox')).toBeChecked()
  })

  it('aplica classe CSS de concluída', () => {
    render(
      <TaskItem task={completedTask} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('task-item')).toHaveClass('task-item--completed')
  })
})

// ─── TaskList ─────────────────────────────────────────────────────────────

describe('TaskList — renderização', () => {
  it('exibe mensagem de estado vazio quando não há tarefas', () => {
    render(
      <TaskList tasks={[]} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('não exibe a lista ul quando está vazia', () => {
    render(
      <TaskList tasks={[]} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.queryByTestId('task-list')).not.toBeInTheDocument()
  })

  it('renderiza todos os itens da lista', () => {
    const tasks = [pendingTask, completedTask]
    render(
      <TaskList tasks={tasks} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getAllByTestId('task-item')).toHaveLength(2)
  })

  it('exibe a lista ul quando há tarefas', () => {
    render(
      <TaskList
        tasks={[pendingTask]}
        onToggle={noop}
        onRemove={noop}
        onEdit={noop}
      />
    )

    expect(screen.getByTestId('task-list')).toBeInTheDocument()
  })

  it('exibe o texto de cada tarefa na lista', () => {
    const tasks = [pendingTask, completedTask]
    render(
      <TaskList tasks={tasks} onToggle={noop} onRemove={noop} onEdit={noop} />
    )

    expect(screen.getByText('Comprar leite')).toBeInTheDocument()
    expect(screen.getByText('Ler livro')).toBeInTheDocument()
  })
})

// ─── TaskFilter ───────────────────────────────────────────────────────────

describe('TaskFilter — renderização', () => {
  const stats = { total: 3, active: 2, completed: 1 }

  it('renderiza os três botões de filtro', () => {
    render(
      <TaskFilter currentFilter="all" stats={stats} onFilterChange={noop} />
    )

    expect(screen.getByTestId('filter-all')).toBeInTheDocument()
    expect(screen.getByTestId('filter-active')).toBeInTheDocument()
    expect(screen.getByTestId('filter-completed')).toBeInTheDocument()
  })

  it('o filtro ativo tem aria-pressed="true"', () => {
    render(
      <TaskFilter currentFilter="active" stats={stats} onFilterChange={noop} />
    )

    expect(screen.getByTestId('filter-active')).toHaveAttribute('aria-pressed', 'true')
  })

  it('os filtros inativos têm aria-pressed="false"', () => {
    render(
      <TaskFilter currentFilter="all" stats={stats} onFilterChange={noop} />
    )

    expect(screen.getByTestId('filter-active')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('filter-completed')).toHaveAttribute('aria-pressed', 'false')
  })

  it('exibe a contagem de pendentes nas estatísticas', () => {
    render(
      <TaskFilter currentFilter="all" stats={stats} onFilterChange={noop} />
    )

    expect(screen.getByTestId('filter-stats')).toHaveTextContent('2 pendentes')
  })

  it('exibe a contagem de concluídas nas estatísticas', () => {
    render(
      <TaskFilter currentFilter="all" stats={stats} onFilterChange={noop} />
    )

    expect(screen.getByTestId('filter-stats')).toHaveTextContent('1 concluída')
  })

  it('o botão de filtro ativo tem a classe CSS correta', () => {
    render(
      <TaskFilter currentFilter="completed" stats={stats} onFilterChange={noop} />
    )

    expect(screen.getByTestId('filter-completed')).toHaveClass('btn-filter--active')
    expect(screen.getByTestId('filter-all')).not.toHaveClass('btn-filter--active')
  })
})
