import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { OliveLit } from "../../src/olivecss.js";

export default defineConfig({
  plugins: [
    OliveLit(),
    tailwind(),
  ],
});
