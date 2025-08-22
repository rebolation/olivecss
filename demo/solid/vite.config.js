import { defineConfig } from 'vite'
import olivecss from "../../src/olivecss.js";
import solid from 'vite-plugin-solid'
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    solid({
      babel: {
        plugins: [[ olivecss, { framework: 'solid' } ]],
      },
    }),
    tailwind(),
  ],
});