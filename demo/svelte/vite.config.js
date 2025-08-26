import { defineConfig } from 'vite'
import { OliveSvelte } from '../../src/olivecss.js';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwind from "@tailwindcss/vite";

const oliveSvelte = await OliveSvelte();

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [ oliveSvelte ],
    }),
    tailwind(),
  ],
});
