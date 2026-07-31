<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  let count = $state(0);
  let isPending = $state(false);
  let statusText = $derived(count > 10 ? 'Meta atingida!' : 'Em progresso...');

  function increment() {
    count += 1;
  }

  function reset() {
    count = 0;
  }
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 antialiased">
  <div class="w-full max-w-3xl space-y-6 rounded-xl border bg-card p-6 shadow-sm">
    <div class="space-y-2">
      <span class="w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
        shadcn + tailwindcss
      </span>
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Painel Bluecrow</h3>
      <p class="text-sm text-muted-foreground">Demonstração de estado reativo com Svelte 5 Runes e Shadcn.</p>
    </div>

    <div class="rounded-lg border bg-muted/40 p-4 text-center space-y-1">
      <span class="text-xs font-medium uppercase text-muted-foreground tracking-wider">Contador</span>
      <div class="text-4xl font-extrabold tracking-tight">{count}</div>
      <p class="text-xs text-muted-foreground font-medium pt-1">{statusText}</p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <Button variant="default" onclick={increment}>Incrementar</Button>
      <Button variant="outline" onclick={reset}>Resetar</Button>
      <Button variant="ghost" size="icon" aria-label="Go to next step">
        <ArrowRight class="size-4" />
      </Button>
    </div>
  </div>
</div>
