//import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const DEMO = !!process.env.DEMO;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: !DEMO,
  workers: DEMO ? 1 : undefined,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: DEMO ? 120_000 : 30_000,
  expect: { timeout: 10_000 },

  reporter: [['list', { printSteps: true }], ['html', { open: 'never' }], ...(CI ? ([['github']] as const) : [])],

  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.BASE_URL ?? 'https://create-asana-like-pr-39y5.bolt.host/',
    headless: !DEMO,
    viewport: { width: 1280, height: 720 },
    launchOptions: { slowMo: DEMO ? Number(process.env.SLOW_MO ?? 400) : 0 },
    trace: DEMO ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: DEMO ? { mode: 'on', size: { width: 1280, height: 720 } } : 'retain-on-failure',
  },

  projects: [{ name: 'chromium' }],
});