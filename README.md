# nx-hub-bluecrow

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Sobre o projeto

O **nx-hub-bluecrow** é um **hub de desenvolvimento multi-framework**, construído como um monorepo [Nx](https://nx.dev). O objetivo do workspace é centralizar, em um único repositório, bibliotecas, aplicações e pacotes que utilizam diferentes frameworks e stacks do ecossistema front-end, permitindo compartilhamento de código, padronização de ferramentas (lint, testes, build, release) e cache/execução de tarefas de forma unificada via Nx.

Frameworks e tecnologias suportados neste hub:

- **Angular** (`~22.0.4`) — aplicações e bibliotecas, com `ng-packagr`, Angular CLI e Angular Build
- **React** (`^19.0.0`)
- **Vue** (`^3.5.13`)
- **Svelte / SvelteKit** (`^5.0.0` / `^2.20.0`), via `@nxext/svelte` e `@nxext/sveltekit`
- Bibliotecas e utilitários de suporte multi-stack: **Tailwind CSS**, **Spartan NG** (Brain/CLI), **D3**, **GSAP**, **XState**, **RxJS**, **Zod**, **OpenTelemetry**, entre outros

## Estrutura do workspace

```
nx-hub-bluecrow/
├── apps/          # Aplicações (Angular, React, Vue, Svelte...)
├── libs/          # Bibliotecas internas compartilhadas
├── packages/       # Pacotes publicáveis (workspaces do npm/yarn)
├── .docs/          # Documentação adicional do projeto
├── .verdaccio/     # Registro npm local (para testes de publicação)
├── nx.json         # Configuração do Nx (plugins, targets, generators, release)
├── tsconfig.base.json
└── package.json
```

O layout de apps/libs segue a convenção padrão do Nx (`workspaceLayout` em `nx.json`: `appsDir: apps`, `libsDir: libs`), enquanto `packages/*` é usado como workspace do npm para pacotes publicáveis.

## Gerando código

Gerar uma nova biblioteca (exemplo genérico, JS/TS):

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

Gerar projetos específicos por framework:

```sh
# Angular
npx nx g @nx/angular:application apps/minha-app-angular
npx nx g @nx/angular:library libs/angular/minha-lib

# React
npx nx g @nx/react:application apps/minha-app-react
npx nx g @nx/react:library libs/react/minha-lib

# Vue
npx nx g @nx/vue:application apps/minha-app-vue
npx nx g @nx/vue:library libs/vue/minha-lib

# Svelte / SvelteKit
npx nx g @nxext/svelte:app apps/minha-app-svelte
npx nx g @nxext/sveltekit:app apps/minha-app-sveltekit
```

> Os defaults de cada generator (diretório, linter, test runner etc.) estão configurados em `nx.json` → `generators`.

## Comandos — build, testes e demais tarefas

Rodar qualquer tarefa (target) do Nx em um projeto específico:

```sh
npx nx <target> <nome-do-projeto>
```

### Build

```sh
npx nx build <nome-do-projeto>
```

### Testes unitários (Jest / Vitest / Angular unit-test, conforme o projeto)

```sh
npx nx test <nome-do-projeto>
```

### Lint

```sh
npx nx eslint:lint <nome-do-projeto>
```

### End-to-end (Cypress)

```sh
npx nx e2e <nome-do-projeto>
# ou, em modo interativo:
npx nx open-cypress <nome-do-projeto>
```

### Typecheck

```sh
npx nx typecheck <nome-do-projeto>
```

### Rodar uma tarefa em todos os projetos afetados

```sh
npx nx affected -t build test eslint:lint
```

### Rodar uma tarefa em todos os projetos do workspace

```sh
npx nx run-many -t build
```

### Visualizar o grafo de dependências do workspace

```sh
npx nx graph
```

### Sincronizar referências de projeto do TypeScript

```sh
npx nx sync
# em CI, para validar sem alterar arquivos:
npx nx sync:check
```

### Versionamento e release

```sh
npx nx release
# simular sem publicar de fato:
npx nx release --dry-run
```

### Conectar ao Nx Cloud (cache remoto e distribuição de tarefas em CI)

```sh
npx nx connect
```

### Gerar workflow de CI

```sh
npx nx g ci-workflow
```

## Saiba mais

- [Documentação do Nx](https://nx.dev)
- [Tarefas inferidas automaticamente](https://nx.dev/concepts/inferred-tasks)
- [Executando tarefas com Nx](https://nx.dev/features/run-tasks)
- [Nx release](https://nx.dev/features/manage-releases)
- [Referências de projeto do TypeScript](https://nx.dev/reference/nx-commands#sync)
- [Nx na CI](https://nx.dev/ci/intro/ci-with-nx)
- [Nx Console](https://nx.dev/getting-started/editor-setup) (extensão para VSCode / IntelliJ)
