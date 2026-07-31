<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
</script>

<div class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-10">
  <span class="w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
    shadcn + tailwindcss
  </span>

  <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
    Svelte app ready for composable UI primitives.
  </h1>

  <p class="max-w-2xl text-base text-slate-600 sm:text-lg">
    The shared build tooling stays at the Nx root, while the app-specific UI dependencies are scoped to the Svelte app, keeping the vanilla core libs clean.
  </p>

  <div class="flex flex-wrap gap-3">
    <Button variant="default">Primary action</Button>
    <Button variant="outline">Secondary action</Button>
    <Button variant="ghost" size="icon" aria-label="Go to next step">
      <ArrowRight class="size-4" />
    </Button>
  </div>
</div>
