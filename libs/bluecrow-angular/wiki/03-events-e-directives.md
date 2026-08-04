# Directives de evento e o despacho pro broker

## `EventDirective`: a ponte entre DOM e broker

Toda captura de evento nativo passa por uma subclasse de `EventDirective` (`ClickableEvent`, `KeyboardEventDirective`, `PointerEventDirective`...). Cada subclasse só declara os host bindings de eventos DOM que lhe dizem respeito:

```ts
@Directive({
  host: {
    '(click)': 'emitNativeEvent("on:click", $event)',
    '(dblclick)': 'emitNativeEvent("on:dblclick", $event)',
    '(contextmenu)': 'emitNativeEvent("on:contextmenu", $event)'
  }
})
export class ClickableEvent extends EventDirective {}
```

Toda a lógica de fato vive na classe abstrata, compartilhada por todas as subclasses — as subclasses são só "roteadores" de qual evento DOM vira qual `CommandType`.

## O mapa de interceptors

```ts
private readonly __commandInterceptors = new Map<CommandType, EventInterceptor>();
```

Quando um decorator (`@Command`, `@CommandShortcut`...) roda no `ngOnInit` do componente, ele chama `registerCommandInterceptor(command, fn)` pra colocar sua lógica nesse mapa. Quando o DOM dispara o evento nativo:

```ts
public emitNativeEvent(command: CommandType, nativeEvent: any): void {
  const interceptor = this.__commandInterceptors.get(command);
  if (interceptor) {
    interceptor(nativeEvent);
  }
}
```

Se não há interceptor registrado pra aquele comando (nenhum decorator declarado pra ele), o evento DOM é silenciosamente ignorado — comportamento esperado, já que a directive escuta vários eventos DOM por padrão (ex: `ClickableEvent` escuta `click`, `dblclick` e `contextmenu`), mas o componente pode só ter decorado um deles.

## `dispatchUIEvent`: onde o guard de performance vive

```ts
public dispatchUIEvent<TCmd extends CommandType>(command: TCmd, payload: ...): void {
  const parentId = this.contextId;

  if (!parentId) {
    if (isDevMode()) {
      console.warn(`[UIBroker] Disparo de "${command}" cancelado: Átomo "${this.childId}" não está sob um UIContext válido.`);
    }
    return;
  }

  const channelId = `${parentId}:${this.childId}`;

  if (!broker.hasSubscribers(channelId, command)) {
    return;
  }

  const message = createUIEventMessage(command, payload, this.getParentNodeTree());
  broker.publish(channelId, message);
}
```

Duas guardas em sequência, nessa ordem:

1. **Sem `UIContext` pai** — o átomo não está dentro de um `Container` válido. Cancela e avisa em dev mode.
2. **Sem subscribers no canal** — `broker.hasSubscribers(channelId, command)` retorna `false`. Cancela **antes** de montar a mensagem.

A ordem importa: `createUIEventMessage` chama `getParentNodeTree()`, que faz um *walk* pela árvore de elementos pais do DOM (`while (current instanceof HTMLElement) { tree.push(...); current = current.parentNode; }`). Esse walk — e o `publish` em si, que é O(N) no número de handlers — só acontece se de fato existe alguém ouvindo. Átomos sem listener ativo custam praticamente zero no broker.

## Limitação conhecida: descarte silencioso

A guarda 2 (`hasSubscribers`) não tem equivalente de `console.warn` em dev mode, diferente da guarda 1. Isso cria uma janela de debug ruim: se um evento nativo dispara **antes** do `@Listener` correspondente ter rodado seu `ngOnInit` (ordem de inicialização entre componentes irmãos não é garantida), o evento é descartado sem nenhum rastro no console — mesmo em desenvolvimento.

Isso é particularmente fácil de acontecer com `Container`s que populam `viewChildren()` de forma assíncrona/reativa (ver [`02-atoms-e-containers.md`](./02-atoms-e-containers.md)): um usuário interagindo rápido durante o carregamento inicial pode gerar eventos legítimos que simplesmente somem.

**Correção sugerida** (ainda não aplicada no código-base):

```ts
if (!broker.hasSubscribers(channelId, command)) {
  if (isDevMode()) {
    console.warn(`[UIBroker] "${command}" disparado no canal "${channelId}" mas nenhum @Listener está registrado.`);
  }
  return;
}
```

Simétrico ao padrão já usado na guarda 1, sem custo em produção (`isDevMode()` é otimizado away em build de produção pelo Angular).

## `COMMAND_EVENT_MAP`

Tabela estática que conecta cada `CommandType` à directive que o escuta e ao nome de método convencional esperado pelo `@Listener` (ex: `on:click` → `ClickableEvent` / `onClick`). É essa tabela que os decorators usam pra descobrir, em runtime, qual directive fazer `inject()` — sem ela, `@Command('on:click')` não saberia que precisa injetar `ClickableEvent` especificamente.