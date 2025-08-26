import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { OliveLit } from "../../src/olivecss.js";

const oliveLit = await OliveLit();

export default defineConfig({
  plugins: [
    oliveLit,
    tailwind(),
  ],
});
