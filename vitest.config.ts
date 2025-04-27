
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest/setupTests.ts',
    reporters: [
      'default',
      ['html', { outputFile: 'vitest-report/index.html' }],
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
    include: ['./vitest/**/*.test.{ts,tsx,js,jsx}'],
    exclude: ['e2e', 'src/components/**/*.test.jsx', 'playwright.config.ts'],
  },
});

