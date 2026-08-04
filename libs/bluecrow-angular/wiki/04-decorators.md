# Decorators

Cinco decorators cobrem o ciclo completo: quatro no lado de quem **dispara** um comando (`@Command`, `@CommandShortcut`, `@AsyncCommand`, `@AsyncCommandShortcut`) e um no lado de quem **escuta** (`@Listener`).

Todos compartilham um padrão estrutural: interceptam `ngOnInit` (encadeando o original, nunca sobrescrevendo), usam `runInInjectionContext` pra poder chamar `inject()` fora do construtor, e resolvem a directive de evento correspondente via `COMMAND_EVENT_MAP`.

## Tabela comparativa

| Decorator | Dispara em | Retorno esperado do método | Suporta atalho de teclado global |
|---|---|---|---|
| `@Command(command)` | Evento DOM nativo do comando | Valor síncrono (ou `null`/`false`/`undefined` cancela) | Não |
| `@CommandShortcut(shortcut, command)` | Evento DOM **ou** atalho de teclado global | Valor síncrono, ou `Observable` (assinado internamente) | Sim |
| `@AsyncCommand(command)` | Evento DOM nativo do comando | `Observable<any>` obrigatório | Não |
| `@AsyncCommandShortcut(shortcut, command)` | Evento DOM **ou** atalho de teclado global | `Observable<any>` obrigatório | Sim |
| `@Listener(command, atomId)` | Mensagem publicada no broker | — (recebe `UIEventMessage`) | — |

## `@Command`: o caso síncrono simples

```ts
@Command('on:click')
onClick(event: MouseEvent) {
  console.log('clicado', event);
  return event; // truthy → dispara pro broker
}
```

Internamente, registra um interceptor que roda o método original e aplica a "regra de guarda": se o retorno for `null`, `false` ou `undefined`, o evento **não** é despachado pro broker — só executa a lógica local. Isso permite que o método decida, por sua própria lógica de negócio, se aquele evento vale a pena virar uma mensagem pro resto da aplicação.

## `@AsyncCommand`: o caso reativo (RxJS)

Em vez de retornar um valor, o método recebe um `Observable` de eventos e retorna outro `Observable` — o pipeline de transformação (debounce, map, filter...) fica todo declarativo:

```ts
@AsyncCommand('on:click')
onClickAsync(events$: Observable<MouseEvent>): Observable<any> {
  return events$.pipe(
    debounceTime(300),
    map(event => ({ type: event.type, target: event.target }))
  );
}
```

Cada emissão do `Observable` de saída (desde que não seja `false`/`null`/`undefined`) dispara `dispatchUIEvent`. A subscription é limpa automaticamente via `destroyRef.onDestroy()`.

## `@CommandShortcut` e `@AsyncCommandShortcut`: atalhos globais

Essas duas variantes fazem o registro em **dois** lugares simultaneamente:

1. Na directive de evento nativa do comando alvo (ex: `ClickableEvent`, pra capturar clique de mouse).
2. Num listener global de `keydown`/`keyup` anexado ao `DOCUMENT` (injetado via `DOCUMENT` token do Angular), pra capturar o atalho de teclado **de qualquer lugar da página**, não só quando o elemento está focado.

```ts
@CommandShortcut('alt+m', 'on:click')
onClick(event: MouseEvent | KeyboardEvent) { ... }
```

### Parsing do atalho

A string do atalho (`'alt+m'`, `'ctrl+shift+s'`) é parseada uma única vez, no momento em que o decorator é aplicado à classe (fora do `ngOnInit`, então o custo de parsing não se repete a cada instância do componente):

```ts
const MODIFIER_ALIASES: Record<string, ShortcutModifier> = {
  ctrl: 'ctrl', control: 'ctrl',
  shift: 'shift',
  alt: 'alt', option: 'alt',
  meta: 'meta', cmd: 'meta', command: 'meta', win: 'meta',
};
```

Aceita aliases comuns entre plataformas (`cmd`/`command`/`win` todos mapeiam pra `meta`, `option` mapeia pra `alt`) e teclas especiais (`esc` → `escape`, `space`/`spacebar` → `' '`, setas por extenso). O matching final compara `event.key` (normalizado para minúsculo) contra os quatro modificadores booleanos (`ctrlKey`, `shiftKey`, `altKey`, `metaKey`) — precisa bater exatamente, incluindo modificadores que **não** foram pedidos (ou seja, `alt+m` não dispara se `ctrl` também estiver pressionado).

### Por que dois pontos de registro

Um atalho como `alt+m` precisa dar o mesmo resultado que clicar no botão — inclusive publicando o mesmo `command` (`on:click`) no broker. Por isso ambos os caminhos convergem pro mesmo `directiveInstance.dispatchUIEvent(command, ...)`: do ponto de vista de quem escuta via `@Listener('on:click', ...)`, não importa se o evento veio de um clique real ou do atalho.

## `@Listener`: o lado de quem escuta

```ts
@Listener('on:click', 'my-button-id')
onButtonClicked(message: UIEventMessage) { ... }
```

Diferente dos decorators de disparo, `@Listener` não interage com `EventDirective` — ele fala diretamente com o broker:

```ts
const channelId = containerId ? `${containerId}:${atomId}` : atomId;

const subscriptionToken = broker.register(channelId, command, (message) => {
  originalMethod.call(this, message);
});
```

O `containerId` é resolvido lendo `this.id` da própria classe que aplica o decorator — ou seja, `@Listener` normalmente é usado em métodos de um `Container` (que tem `id` como getter), não de um `Atom` isolado. O `atomId` vem como segundo argumento explícito do decorator porque, ao contrário do lado de disparo, quem escuta *não* está fisicamente ligado ao átomo — precisa declarar por string qual `atomId` quer ouvir.

A limpeza é feita via `DestroyRef.onDestroy()` quando disponível, com fallback para sobrescrever `ngOnDestroy` manualmente (`bindCleanupOnDestroy`) nos casos em que o registro acontece fora do contexto de injeção do Angular.