import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import { OliveVue } from "../../src/olivecss.js";

const oliveVue = await OliveVue();

export default defineConfig({
  plugins: [
    oliveVue,
    vue(),
    tailwind(),
  ]
});
