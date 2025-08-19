import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          '../src/olivecss.js', // Olive
        ],
      },
    }),
    svelte(), svelteTesting()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js'
  }
});