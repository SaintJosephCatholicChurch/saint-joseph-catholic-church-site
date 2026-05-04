import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === 'true';

export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{projectName}/{arg}{ext}',
  use: {
    baseURL,
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'America/Chicago',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css'
    }
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'desktop-firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'desktop-webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7']
      }
    },
    {
      name: 'mobile-firefox',
      use: {
        browserName: 'firefox',
        viewport: {
          width: 393,
          height: 851
        },
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0'
      }
    },
    {
      name: 'mobile-webkit',
      use: {
        ...devices['iPhone 14']
      }
    }
  ],
  webServer: {
    command: 'npm run smoke:serve',
    url: baseURL,
    reuseExistingServer,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 180000
  }
});
