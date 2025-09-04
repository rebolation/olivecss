import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.test.js'],
    exclude: ['node_modules/**', 'dist/**', 'build/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'tests/**',
        '**/*.config.js',
        '**/*.config.mjs'
      ]
    }
  },
  resolve: {
    alias: {
      '@': process.cwd()
    }
  }
});


