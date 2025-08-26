// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import preact from "@astrojs/preact";
import solid from "@astrojs/solid-js";
// import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from './olivecss.js'; // dev (vite config in astro.config)
import oliveJSX, { OliveAstro, OliveVue, OliveSvelte } from 'olivecss'; // prod

const oliveAstro = await OliveAstro();
const oliveVue = await OliveVue();
const oliveSvelte = await OliveSvelte();


export default defineConfig({
  integrations: [
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
      // babel: { // not supported
      //   plugins: [
      //     [oliveJSX, { framework: 'preact' }],
      //   ],
      // },
    }),
    solid({
      include: ['**/components/AstroSolid.jsx'],
      // babel: { // not supported
      //   plugins: [
      //     [oliveJSX, { framework: 'solid' }],
      //   ],
      // },
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