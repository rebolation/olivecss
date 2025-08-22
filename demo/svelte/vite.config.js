import { defineConfig } from 'vite'
import { OliveSvelte } from '../../src/olivecss.js';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwind from "@tailwindcss/vite";

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
