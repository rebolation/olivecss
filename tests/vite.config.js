import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import preact from '@preact/preset-vite';
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from '@testing-library/svelte/vite';
import vue from "@vitejs/plugin-vue";
import solid from 'vite-plugin-solid';
import process from 'process';
import olivecss from '../src/olivecss.js';
import { OliveLit } from '../src/olivecss.js';

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
    framework === 'preact' && preact({
      babel: {
        plugins: [
          [ olivecss, { framework: 'preact' } ]
        ]
      },
    }),
    framework === 'solid' && solid({
      babel: {
        plugins: [
          [ olivecss, { framework: 'solid' } ]
        ],
      },
    }),
    framework === 'vue' && vue({
      template: {
        compilerOptions: {
          comments: true
        }
      },
    }),
    framework === 'lit' && OliveLit(),
    framework === 'svelte' && svelte({
      preprocess: [olivecss],
    }),
    framework === 'svelte' && svelteTesting(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  }
});