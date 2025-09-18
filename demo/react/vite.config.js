import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
//import olivecss from "olivecss";
import olivecss from "../../src/olivecss.js";

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