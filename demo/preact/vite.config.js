import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwind from "@tailwindcss/vite";
import olivecss from "../../src/olivecss.js";

export default defineConfig({
  plugins: [
    preact({
      babel: {
        plugins: [[ olivecss ]],
      },
    }),
    tailwind(),
  ],
});
