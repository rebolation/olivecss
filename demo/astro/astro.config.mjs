// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import preact from "@astrojs/preact";
import solid from "@astrojs/solid-js";

import oliveJSX from '../../src/olive-jsx.js'; // dev (vite config in astro.config)
import { OliveAstro } from '../../src/olive-astro.js'; // dev (vite config in astro.config)
import { OliveVue } from '../../src/olive-vue.js'; // dev (vite config in astro.config)
import { OliveSvelte } from '../../src/olive-svelte.js'; // dev (vite config in astro.config)
// import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from 'olivecss'; // prod

const oliveAstro = await OliveAstro();
const oliveVue = await OliveVue();
const oliveSvelte = await OliveSvelte();

export default defineConfig({
  integrations: [
    oliveAstro,
    react({
      include: ['**/components/AstroReact.jsx'],
      babel: {
        plugins: [[ oliveJSX, { framework: 'react' } ]],
      },
    }), 
    vue(), 
    svelte({
      preprocess: [oliveSvelte],
    }), 
    preact({
      include: ['**/components/AstroPreact.jsx'],
    }),
    solid({
      include: ['**/components/AstroSolid.jsx'],
    }),
  ],
  vite: {
    plugins: [
      oliveVue,
      tailwindcss(),
    ],
  },
});