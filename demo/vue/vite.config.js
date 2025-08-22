import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import { OliveVue } from "../../src/olivecss.js";

export default defineConfig({
  plugins: [
    OliveVue(),
    vue({
      template: {
        compilerOptions: {
          comments: true
        }
      }
    }),
    tailwind(),
  ],
});
