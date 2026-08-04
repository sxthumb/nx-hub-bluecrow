# O broker (`UIBrokerMessenger`)

O broker é o coração do sistema: um roteador de mensagens em memória, sem estado persistente, sem dependência de RxJS ou do ciclo de change detection do Angular. É uma classe standalone (`export const broker = new UIBrokerMessenger()`), instanciada uma única vez como singleton do módulo.

## Modelo de dados

```ts
private readonly channels = new Map<
  string,                              // channelId
  Map<CommandType, Set<MessageHandler<any>>>  // command -> handlers
>();
```

Três níveis de aninhamento:

1. **Canal** (`channelId`) — normalmente `${containerId}:${atomId}`, isolando eventos por instância de componente. Dois `Container`s diferentes nunca compartilham canal, mesmo com IDs de átomo iguais.
2. **Comando** (`CommandType`) — `on:click`, `on:keydown`, etc. Um canal pode ter handlers para vários comandos simultaneamente.
3. **Handlers** (`Set<MessageHandler>`) — um `Set`, não um `Array`: garante que a mesma função de referência não seja registrada duas vezes, e dá remoção O(1) via `.delete()`.

## API pública

| Método | Papel |
|---|---|
| `register(channelId, command, handler)` | Inscreve um handler; retorna um `SubscriptionToken` com `.unsubscribe()` |
| `publish(channelId, message)` | Notifica todos os handlers do canal+comando da mensagem |
| `hasSubscribers(channelId, command?)` | Checagem O(1)/O(k) usada como guard antes de montar e publicar uma mensagem |
| `unregisterAll(channelId)` | Remove o canal inteiro — usado em `ngOnDestroy` de containers e em testes |

## Isolamento e limpeza automática

O `register` cria estruturas sob demanda (`Map`/`Set` só nascem quando o primeiro handler chega) e o `unsubscribe` retornado por ele faz limpeza em cascata:

```ts
return {
  unsubscribe: () => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      channelCommands.delete(command);
    }
    if (channelCommands.size === 0) {
      this.channels.delete(channelId);
    }
  }
};
```

Isso significa que o broker **não acumula lixo** de canais/comandos vazios ao longo do tempo — quando o último handler de um comando sai, a entrada do comando morre; quando o último comando de um canal morre, o canal inteiro é removido do `Map` raiz. Componentes que montam e desmontam repetidamente (listas virtualizadas, modais, tabs) não vazam memória no broker, desde que o `unsubscribe()` seja de fato chamado — o que os decorators (`@Listener`, ver [`04-decorators.md`](./04-decorators.md)) fazem automaticamente via `DestroyRef.onDestroy`.

## Resiliência a exceções

`publish` isola falhas por handler — um handler que lança exceção não impede os demais de rodar:

```ts
for (const handler of handlers) {
  try {
    handler(message);
  } catch (error) {
    console.error(`[UIBroker] (Failed to process handler for channel "${channelId}")`, error);
  }
}
```

Isso é uma decisão de design deliberada: num sistema pub-sub onde múltiplos subscribers desconhecidos entre si escutam o mesmo canal, um bug em um listener não deve derrubar a notificação dos outros.

## Características de performance

Medido via benchmark próprio (`ui-broker.bench.ts`, ver [`05-performance.md`](./05-performance.md) para a metodologia completa):

- **`publish`**: custo total por chamada é proporcional ao número de handlers do canal+comando (percorre o `Set` inteiro), mas o custo **por handler** se mantém estável entre ~4–5 ns em toda a faixa testada (64 a 10.000 handlers) — sem sinal de degradação quadrática.
- **`register`**: custo por inserção também estável, entre ~100–150 ns por handler, consistente com o comportamento amortizado de `Set.add`.

Na prática: o broker escala bem em número de handlers por canal. O que precisa ser monitorado em produção não é "quantos handlers", mas sim a frequência de `publish` multiplicada pelo tamanho médio do `Set` de handlers — esse produto é o que determina o custo agregado por frame/segundo.