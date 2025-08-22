import { defineConfig } from "vite";
import olivecss from "../../src/olivecss.js";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [[ olivecss ]],
      },
    }),
    tailwind(),
  ],
});