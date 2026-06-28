/**
 * ============================================================
 * TESTES DE MOCK — localStorage
 * ============================================================
 *
 * Por que mockar o localStorage?
 * → Em ambiente jsdom o localStorage existe, mas queremos:
 *   1. Controlar exatamente o que está armazenado antes de cada teste.
 *   2. Verificar SE e COMO as funções chamam o localStorage.
 *   3. Simular erros de storage sem depender do navegador real.
 *
 * Técnicas demonstradas:
 * - vi.stubGlobal → substitui API nativa por spy controlado
 * - beforeEach / afterEach → garantem isolamento entre testes
 * - mockReturnValueOnce → controla o retorno de uma chamada específica
 * - expect(spy).toHaveBeenCalledWith → verifica COMO a função foi chamada
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadTasksFromStorage, saveTasksToStorage } from '../../utils/taskUtils'

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Cria um mock completo do localStorage com spies. */
function createLocalStorageMock() {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]) }),
    get length() { return Object.keys(store).length },
    key: vi.fn((i) => Object.keys(store)[i] ?? null),
    _store: store, // exposto para inspeção nos testes
  }
}

// ─── Setup / Teardown ─────────────────────────────────────────────────────

let localStorageMock

beforeEach(() => {
  localStorageMock = createLocalStorageMock()
  vi.stubGlobal('localStorage', localStorageMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// ─── loadTasksFromStorage ─────────────────────────────────────────────────

describe('loadTasksFromStorage', () => {
  it('retorna array vazio quando o localStorage está vazio', () => {
    localStorageMock.getItem.mockReturnValueOnce(null)
    const result = loadTasksFromStorage()

    expect(result).toEqual([])
  })

  it('lê a chave correta ("tasks") do localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('[]')
    loadTasksFromStorage()

    expect(localStorageMock.getItem).toHaveBeenCalledWith('tasks')
  })

  it('parseia e retorna as tarefas salvas corretamente', () => {
    const saved = [
      { id: '1', text: 'Tarefa salva', completed: false, createdAt: '2024-01-01' },
    ]
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(saved))

    const result = loadTasksFromStorage()

    expect(result).toEqual(saved)
  })

  it('retorna array vazio se o JSON estiver corrompido', () => {
    localStorageMock.getItem.mockReturnValueOnce('json-inválido{{{{')
    const result = loadTasksFromStorage()

    expect(result).toEqual([])
  })

  it('retorna array vazio se o localStorage lançar uma exceção', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Acesso bloqueado pelo navegador')
    })

    const result = loadTasksFromStorage()

    expect(result).toEqual([])
  })

  it('chama getItem exatamente uma vez por load', () => {
    localStorageMock.getItem.mockReturnValueOnce('[]')
    loadTasksFromStorage()

    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1)
  })
})

// ─── saveTasksToStorage ───────────────────────────────────────────────────

describe('saveTasksToStorage', () => {
  it('salva as tarefas na chave "tasks" do localStorage', () => {
    const tasks = [{ id: '1', text: 'Tarefa', completed: false }]
    saveTasksToStorage(tasks)

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'tasks',
      JSON.stringify(tasks)
    )
  })

  it('serializa o array como JSON ao salvar', () => {
    const tasks = [
      { id: '1', text: 'A', completed: false },
      { id: '2', text: 'B', completed: true },
    ]
    saveTasksToStorage(tasks)

    const [, savedValue] = localStorageMock.setItem.mock.calls[0]
    expect(() => JSON.parse(savedValue)).not.toThrow()
    expect(JSON.parse(savedValue)).toEqual(tasks)
  })

  it('salva array vazio sem lançar erro', () => {
    expect(() => saveTasksToStorage([])).not.toThrow()
    expect(localStorageMock.setItem).toHaveBeenCalledWith('tasks', '[]')
  })

  it('não lança exceção se o setItem falhar (ex.: storage cheio)', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError')
    })

    expect(() => saveTasksToStorage([{ id: '1', text: 'X' }])).not.toThrow()
  })

  it('chama setItem exatamente uma vez por save', () => {
    saveTasksToStorage([])

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
  })
})

// ─── Ciclo completo: save → load ──────────────────────────────────────────

describe('localStorage: ciclo completo (save + load)', () => {
  it('o que foi salvo é recuperado corretamente', () => {
    const tasks = [
      { id: '1', text: 'Persistência funciona', completed: false, createdAt: '2024-01-01' },
    ]

    // Simula o setItem gravando de verdade no store interno do mock
    localStorageMock.setItem.mockImplementation((key, value) => {
      localStorageMock._store[key] = value
    })
    localStorageMock.getItem.mockImplementation((key) =>
      localStorageMock._store[key] ?? null
    )

    saveTasksToStorage(tasks)
    const loaded = loadTasksFromStorage()

    expect(loaded).toEqual(tasks)
  })
})
