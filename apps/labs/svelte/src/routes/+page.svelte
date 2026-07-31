<script lang="ts">
	// Estado local usando Runes do Svelte 5
	let count = $state(0);
	let isPending = $state(false);

	// Estado derivado reativo
	let statusText = $derived(count > 10 ? 'Meta atingida!' : 'Em progresso...');

	function increment() {
		count += 1;
	}

	function reset() {
		count = 0;
	}
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 antialiased">
	<div class="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm">
		<!-- Header -->
		<div class="space-y-1.5">
			<h3 class="text-2xl font-semibold leading-none tracking-tight">Painel Bluecrow</h3>
			<p class="text-sm text-muted-foreground">Demonstração de estado reativo com Svelte 5 Runes e Shadcn.</p>
		</div>

		<!-- Main Content / Metric -->
		<div class="rounded-lg border bg-muted/40 p-4 text-center space-y-1">
			<span class="text-xs font-medium uppercase text-muted-foreground tracking-wider">Contador</span>
			<div class="text-4xl font-extrabold tracking-tight">{count}</div>
			<p class="text-xs text-muted-foreground font-medium pt-1">{statusText}</p>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-3">
			<button
				onclick={increment}
				class="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				Incrementar
			</button>

			<button
				onclick={reset}
				class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				Resetar
			</button>
		</div>
	</div>
</div>