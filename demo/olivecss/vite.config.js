import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwind from '@tailwindcss/vite';
import olivecss_jsx from 'olivecss';
import { OliveSvelte } from 'olivecss';

export default defineConfig(async () => {
  const olivecss_svelte = await OliveSvelte();

  return {
    plugins: [
      react({
        babel: { plugins: [ olivecss_jsx ] } // OliveCSS JSX
      }),
      svelte({
        preprocess: [ olivecss_svelte ], // OliveCSS Svelte
      }),
      tailwind()
    ],
    base: './', // Project Root
  }
});