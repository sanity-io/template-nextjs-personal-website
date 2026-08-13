import {defineConfig, devices} from '@playwright/test'

const PORT = Number(process.env.PORT || 3000)
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
})
