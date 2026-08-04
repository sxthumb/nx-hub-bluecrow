# bluecrow-angular 

**⚠️ EM CONSTRUÇÃO — Esta biblioteca está sob desenvolvimento ativo.**

Uma camada de eventos desacoplada para Angular: componentes disparam comandos semânticos (`on:click`, `on:keydown`...) via decorators, e qualquer parte da aplicação pode escutar esses comandos sem precisar de uma relação direta de pai/filho no template.

Gerado usando o nosso projeto [Hub Bluecrow](https://github.com/sxthumb/nx-hub-bluecrow) que é em [Nx](https://nx.dev), a lib evoluiu para um sistema próprio de mensageria interna (`UIBrokerMessenger`) combinado com um catálogo de átomos de UI (`Atom`, `AtomButton`, `AtomTextField`...) e decorators (`@Command`, `@Listener`, `@CommandShortcut`...) que tratam eventos de DOM como comandos publicados num broker, não como `@Output()` amarrados à árvore de componentes.

## Por que isso existe

O padrão `@Output() / EventEmitter` do Angular resolve bem comunicação pai-filho direta, mas fica limitado em cenários comuns em dashboards e design systems maiores:

- **Atalhos de teclado globais** (`alt+m` disparando o mesmo comando que um clique) não têm um lar natural em `@Output()` — normalmente viram `HostListener` no `document` espalhados pelo código.
- **Listeners fora da árvore direta de template** — um painel de log, um sistema de auditoria, ou um componente de debug que precisa saber quando *qualquer* botão de *qualquer* formulário foi clicado, sem que cada botão precise expor um output cabeado manualmente.
- **Fluxos assíncronos (RxJS) e síncronos coexistindo** sob a mesma API de comando, sem duplicar a lógica de despacho.
- **Isolamento por canal**: dois `Container`s diferentes usando o mesmo `atomId` (ex: dois formulários com um campo `"email"` cada) não devem vazar eventos um pro outro.

O `bluecrow-angular` resolve isso tratando eventos como **mensagens publicadas em canais nomeados** (`${containerId}:${atomId}`), com um broker central fazendo o roteamento — parecido com um event bus, mas com tipagem de comando (`CommandType`) e ciclo de vida amarrado ao Angular (`DestroyRef`, `runInInjectionContext`).

## Arquitetura em uma imagem

```
DOM event (click, keydown...)
        │
        ▼
EventDirective (host binding)  ──── captura o evento nativo bruto
        │
        ▼
__commandInterceptors (Map)    ──── decorators registram aqui
        │
        ▼
@Command / @CommandShortcut / @AsyncCommand / @AsyncCommandShortcut
        │  roda a lógica do átomo, decide se publica ou cancela
        ▼
dispatchUIEvent()               ──── guard: só publica se houver subscriber
        │
        ▼
UIBrokerMessenger.publish()     ──── notifica handlers do canal+comando
        │
        ▼
@Listener (em um Container)     ──── recebe a UIEventMessage
```

## Instalação (via GitHub)

Por estar em desenvolvimento, a biblioteca pode ser instalada diretamente a partir do repositório no GitHub:

```bash
npm install github:sxthumb/bluecrow-angular
```

## Uso rápido

Como lib gerada via Nx dentro do workspace, o consumo é direto pelo path do projeto:

```ts
import { AtomButton, Command, provideAtom } from '@bluecrow-angular/core';
```

Exemplo mínimo — um botão que reage a clique do mouse **e** ao atalho `Alt+M`, publicando no broker apenas se algo estiver escutando:

```ts
@Component({
  selector: 'sx-button',
  providers: [provideAtom(Button, AtomButton)]
})
export class Button extends AtomButton {
  @CommandShortcut('alt+m', 'on:click')
  onClick(event: MouseEvent | KeyboardEvent) {
    return event; // retornar algo "truthy" dispara o broker; null/false/undefined cancela
  }
}
```

Do outro lado, um `Container` escuta sem precisar de referência direta ao botão:

```ts
@Listener('on:click', 'my-button-id')
onButtonClicked(message: UIEventMessage) {
  // ...
}
```

## Documentação por conceito

A wiki cobre cada peça da arquitetura em mais profundidade:

| Documento | Conteúdo |
|---|---|
| [`wiki/01-broker.md`](./wiki/01-broker.md) | `UIBrokerMessenger`: canais, isolamento, ciclo de vida de subscription |
| [`wiki/02-atoms-e-containers.md`](./wiki/02-atoms-e-containers.md) | Hierarquia `Atom`/`Container`, `hostDirectives`, o caveat de não-herança |
| [`wiki/03-events-e-directives.md`](./wiki/03-events-e-directives.md) | `EventDirective`, `COMMAND_EVENT_MAP`, o guard de `dispatchUIEvent` |
| [`wiki/04-decorators.md`](./wiki/04-decorators.md) | `@Command`, `@CommandShortcut`, `@AsyncCommand`, `@AsyncCommandShortcut`, `@Listener` |
| [`wiki/05-performance.md`](./wiki/05-performance.md) | Benchmarks reais de `publish`/`register`, características de escala |

## Testes e Benchmarks

Para rodar os testes unitários da biblioteca via Jest:

```bash
npx jest --runInBand --coverage --config libs/bluecrow-angular/jest.config.ts
```
Para executar os testes de performance (benchmarks) do broker via ts-node:

```bash
npx ts-node --project libs/bluecrow-angular/tsconfig.spec.json --transpile-only libs/bluecrow-angular/src/lib/core/providers/ui-broker.bench.ts
```