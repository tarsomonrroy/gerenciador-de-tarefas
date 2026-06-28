# Task Manager

Projeto front-end usando React + Vite para gerenciar tarefas (to‑do).

## Pré-requisitos
- Node.js 18+ (recomendado)
- npm (ou yarn / pnpm)

## Instalação

1. Clone o repositório.
2. Instale dependências:

```bash
npm install
```

## Scripts úteis

- `npm run dev` — Inicia o servidor de desenvolvimento (Vite).
- `npm run build` — Gera build de produção.
- `npm run preview` — Serve a build localmente para ver o resultado de produção.
- `npm run test` — Executa os testes com Vitest (modo run).
- `npm run test:watch` — Executa Vitest em modo watch (UI reativa).
- `npm run test:coverage` — Gera relatório de cobertura.
- `npm run test:ui` — Abre a interface do Vitest.
- `npm run lint` — Roda o ESLint nos arquivos `src/**/*.{js,jsx}`.
- `npm run lint:fix` — Roda o ESLint com `--fix` para corrigir problemas detectáveis automaticamente.

Os scripts vêm de `package.json` e usam `vite` e `vitest` para desenvolvimento e testes.

## Executando localmente

Desenvolvimento:

```bash
npm run dev
```

Testes:

```bash
npm run test
npm run test:watch
npm run test:coverage
```

Build:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

Raiz:

- `index.html` — entrada HTML do Vite.
- `package.json` — scripts e dependências.
- `vite.config.js` — configuração do Vite e do ambiente de teste.

`src/`:

- `main.jsx` — ponto de montagem do React.
- `App.jsx` — componente principal da aplicação.
- `index.css` — estilos globais.
- `setupTests.js` — configuração do ambiente de teste (Vitest + jsdom).

Componentes (`src/components/`):

- `TaskFilter.jsx` — filtro/visibilidade das tarefas.
- `TaskForm.jsx` — formulário para criar/editar tarefas.
- `TaskItem.jsx` — representação de uma tarefa (marca feita, editar, remover).
- `TaskList.jsx` — lista que renderiza `TaskItem` para cada tarefa.

Hook (`src/hooks/`):

- `useTasks.js` — hook personalizado responsável pelo estado das tarefas, lógica de CRUD e persistência (ex.: `localStorage`).

Utilitários (`src/utils/`):

- `taskUtils.js` — helpers puros para manipular arrays de tarefas, formatação e persistência.

Testes (`src/__tests__/`):

- `components/` — testes de renderização de componentes.
- `integration/` — testes de fluxo de usuário (ex.: criar/filtrar/remover tarefas).
- `unit/` — testes unitários de utilitários e lógica isolada.

## Arquitetura e decisões

- Projeto em React com abordagem baseada em componentes e um hook central `useTasks` para separar estado/efeitos da UI.
- `taskUtils.js` contém funções puras (fáceis de testar) — a UI consome essas funções através do hook.
- Testes usam Vitest + Testing Library para garantir comportamento (renderização, eventos, integração).
- Configuração de testes em `vite.config.js` define `jsdom` e `setupFiles` para inicializar matchers e mocks.

## Linting e formatação

Este projeto já inclui configuração básica de ESLint e Prettier:

- Arquivos de configuração: `.eslintrc.cjs` e `.prettierrc`.
- Dependências de desenvolvimento: `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier` e `prettier` (já adicionadas ao `package.json`).
- Execute o lint localmente:

```bash
npm run lint
npm run lint:fix
```

Recomenda-se instalar as extensões **ESLint** e **Prettier** no VS Code para receber feedback em tempo real.

## Como estender

- Adicionar um novo componente: crie o arquivo em `src/components`, exporte e importe em `App.jsx` ou onde for necessário.
- Adicionar lógica de negócio: atualize ou adicione funções em `src/utils/taskUtils.js` e escreva testes unitários em `src/__tests__/unit`.
- Persistência alternativa: substitua a implementação de armazenamento em `useTasks` (ex.: trocar `localStorage` por um backend).

## Boas práticas

- Manter funções puras em `utils` para facilitar testes.
- Componentes pequenos e focados (apenas apresentação). Use `useTasks` ou outros hooks para lógica e efeitos.
- Escrever testes unitários para regras e testes de integração para fluxos críticos.

## Próximos passos sugeridos

- Rodar `npm run test:coverage` e abrir o relatório em `coverage/index.html`.
- Revisar e rodar `npm run lint` para ajustar o código às regras do ESLint.
- Já foi adicionada uma pipeline de CI em `.github/workflows/ci.yml` que roda `npm ci`, `npm run lint`, `npm run test:coverage` e `npm run build` em pushes e PRs nas branches `main` e `master`.
