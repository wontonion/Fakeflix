import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
    setupFiles: './src/unit-tests/setupTests.ts',
    include: ['src/unit-tests/**/*.test.{ts,tsx,js,jsx}'],
    exclude: ['e2e', 'src/components/**/*.test.jsx', 'playwright.config.ts'],
  },
});