# Performance do broker

## Metodologia

O benchmark (`ui-broker.bench.ts`, usando [`benny`](https://github.com/caderek/benny)) mede duas operações do `UIBrokerMessenger` — `publish` e `register` — em cinco pontos de escala: 64, 500, 2.000, 5.000 e 10.000 handlers.

Dois cuidados de design garantem que os números sejam confiáveis:

1. **Canais isolados** (`benchmark:channel:publish` vs `benchmark:channel:register`) — nenhuma medição contamina o estado usada pela outra, independente da ordem de execução do runner.
2. **Reset por iteração no `register`** — sem isso, o `Set` de handlers cresceria sem limite a cada chamada medida (o `benny` roda a função milhares de vezes pra calcular ops/s), inflando artificialmente o custo e a margem de erro. Cada iteração de `register` limpa o canal e repopula do zero.

## Resultados medidos

| Escala (N) | publish ops/s | margem | register ops/s | margem |
|---|---|---|---|---|
| 64 | 3.429.052 | ±1.33% | 153.164 | ±3.10% |
| 500 | 407.894 | ±7.53% | 17.359 | ±8.76% |
| 2.000 | 120.719 | ±3.24% | 4.473 | ±7.58% |
| 5.000 | 47.090 | ±3.41% | 1.353 | ±5.48% |
| 10.000 | 22.973 | ±4.39% | 780 | ±3.15% |

## Interpretação: custo por handler, não custo total

Ops/s cai de forma acentuada conforme N sobe — isso é esperado, não um sinal de problema. O que determina se o comportamento é saudável é a **derivada**: o custo por handler individual, não o agregado.

Convertendo ops/s em tempo por chamada e dividindo por N:

| Escala (N) | ns/handler em `publish` | ns/handler em `register` |
|---|---|---|
| 64 | 4.56 | 102.4 |
| 500 | 4.90 | 115.2 |
| 2.000 | 4.14 | 111.8 |
| 5.000 | 4.25 | 147.8 |
| 10.000 | 4.35 | 128.2 |

Ambas as colunas ficam **praticamente planas** ao longo de duas ordens de grandeza de N (64 → 10.000). Isso confirma:

- **`publish` é O(N) no total, O(1) por handler** — o `for` que percorre o `Set` de handlers custa o mesmo por item, não importa se são 64 ou 10.000. Não há sinal de comportamento quadrático.
- **`register` é O(1) amortizado por inserção**, como esperado de `Set.add`. A leve variação em N=5.000 (147.8ns vs 111.8ns em N=2.000) é consistente com ruído de rehash interno do V8, não uma tendência de crescimento.

## O que isso significa na prática

A implementação do broker **não vai surpreender mal** conforme o número de handlers por canal cresce — o crescimento é linear e previsível, sem armadilhas de complexidade escondida.

O número que de fato importa para decisões de arquitetura não é "quantos handlers", é:

```
custo agregado ≈ frequência_de_publish × N_handlers_no_pior_caso
```

Como referência de ordem de grandeza: com 10.000 subscribers, um único `publish` leva ~43.5 µs. Isoladamente irrelevante — mas se o mesmo canal recebe múltiplos `publish` dentro de um único frame de 16.67ms (60fps), por exemplo durante uma sequência de eventos de `pointermove`/`scroll` disparando em cascata, esse custo começa a competir pelo orçamento do frame. Vale medir a frequência real de disparo do seu caso de uso antes de assumir que N alto é, por si só, um problema.

## Reproduzindo os benchmarks

```bash
npx ts-node --project libs/bluecrow-angular/tsconfig.spec.json --transpile-only \
  libs/bluecrow-angular/src/lib/core/providers/ui-broker.bench.ts
```

O script gera um relatório JSON por escala (`ui-broker-benchmark-scale-{N}.json`) e um resumo consolidado (`ui-broker-benchmark-scale-summary.json`) pronto para plotar — eixo X é `scale`, eixo Y é `opsPerSec` de cada uma das duas operações.

Ao interpretar resultados novos, sempre confira a **margem de erro antes do valor central**: uma margem acima de ~10-15% indica ruído estatístico (GC, contenção de CPU, warmup insuficiente) e o número de ops/s não deve ser usado para decisão até que a margem caia — geralmente aumentando `minSamples` nas opções do `benny.add`.