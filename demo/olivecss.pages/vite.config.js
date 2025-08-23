import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwind from '@tailwindcss/vite';
import olivecss from 'olivecss';
import { OliveSvelte } from 'olivecss';

export default defineConfig({
  plugins: [
    react({
      babel: { plugins: [ olivecss ] } // OliveCSS JSX
    }),
    svelte({
      preprocess: [ OliveSvelte ], // OliveCSS Svelte
    }),
    tailwind()
  ],
  base: './', // Project Root
});