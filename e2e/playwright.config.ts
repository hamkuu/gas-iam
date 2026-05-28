import { defineConfig, devices } from '@playwright/test'

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'
const BACKEND_URL  = process.env.BACKEND_URL  ?? 'http://localhost:8000'

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  globalSetup: './global-setup.ts',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'frontend',
      testMatch: 'frontend/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: FRONTEND_URL,
      },
    },
    {
      name: 'backend',
      testMatch: 'backend/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BACKEND_URL,
      },
    },
  ],
})
