/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Recria o __dirname para o ambiente ES Module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Altera temporariamente o CWD para a pasta do app para o SvelteKit achar o src/app.html
const originalCwd = process.cwd();
process.chdir(__dirname);

export default defineConfig(() => {
  // Restaura o CWD padrão após a inicialização dos plugins
  process.chdir(originalCwd);

  return {
    root: __dirname,
    cacheDir: '../../../node_modules/.vite/apps/labs/svelte',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [
      sveltekit(),
      tsconfigPaths()
    ],
    build: {
      outDir: '../../../dist/apps/labs/svelte',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});