import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwind from "@tailwindcss/vite";
import { OliveSvelte } from '../../src/olivecss.js';

// https://vite.dev/config/
export default defineConfig(async () => {
  const olivecss = await OliveSvelte();

  return {
    plugins: [
      svelte({
        preprocess: [olivecss],
      }),
      tailwind(),
    ],
  };
})
