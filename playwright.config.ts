import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.WEB_BASE_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: process.env.CI
    ? [
        ['line'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['blob', { outputDir: 'blob-report' }]
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }]
      ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    extraHTTPHeaders: { 'x-test-suite': 'fintech-qe-platform' }
  },
  webServer: {
    command: 'npm run sut',
    url: `${baseURL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  },
  projects: [
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/
    },
    {
      name: 'chromium',
      testIgnore: /api\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Pixel 7'] }
    }
  ]
});
