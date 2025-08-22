import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from '@testing-library/svelte/vite';
import vue from "@vitejs/plugin-vue";
import solid from 'vite-plugin-solid';
import process from 'process';
import olivecss from '../src/olivecss.js';

const framework = process.env.FRAMEWORK;

export default defineConfig({
  plugins: [
    framework === 'react' && react({
      babel: {
        plugins: [
          [ olivecss, { framework: 'react' } ]
        ],
      },
    }),
    framework === 'solid' && solid({
      babel: {
        plugins: [
          [ olivecss, { framework: 'solid' } ]
        ],
      },
    }),
    framework === 'svelte' && svelte(),
    framework === 'svelte' && svelteTesting(),
    framework === 'vue' && vue({
      template: {
        compilerOptions: {
          comments: true
        }
      },
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js'
  }
});