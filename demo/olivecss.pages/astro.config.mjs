// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
// import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from './olivecss.js'; // dev (vite config in astro.config)
import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from 'olivecss'; // prod

const oliveAstro = await OliveAstro();
const oliveVue = await OliveVue();
const oliveSvelte = await OliveSvelte();


export default defineConfig({
  site: 'https://rebolation.github.io',
  base: '/olivecss.pages/',
  integrations: [
    react({
      babel: {
        plugins: [[ oliveJSX, { framework: 'react' } ]],
      },
    }),
    vue(),
    svelte({
      preprocess: [oliveSvelte],
    }),
  ],
  vite: {
    plugins: [
      oliveVue,
      oliveAstro,
      tailwindcss(),
    ],
  },
});