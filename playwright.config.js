// @ts-check
const { defineConfig, devices } = require('@playwright/test');
// const path = require('path');

// Define auth file path
// const authFile = path.join(__dirname, 'playwright/.auth/user.json');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 45 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 6,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    launchOptions: {
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--js-flags=--expose-gc',
        '--window-size=1280,720'
      ]
    }
  },
  projects: [
    // Auth tests - without authentication state
    {
      name: 'auth-tests',
      testMatch: /.*auth\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Setup project - only for authentication
    // {
    //   name: 'setup',
    //   testMatch: /.*\.setup\.js/,
    // },
    
    
    // Test projects - using the authenticated state for all non-auth tests
    {
      name: 'chromium',
      testIgnore: /.*auth\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        // Use prepared auth state
        // storageState: authFile,
      },
      // dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testIgnore: /.*auth\.spec\.js/,
      use: { 
        ...devices['Desktop Firefox'],
        // Use prepared auth state
        // storageState: authFile,
      },
      // dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testIgnore: /.*auth\.spec\.js/,
      use: { 
        ...devices['Desktop Safari'],
        // Use prepared auth state
        // storageState: authFile,
      },
      // dependencies: ['setup'],
    },
  ],
  outputDir: 'test-results/',
  webServer: {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
}); 