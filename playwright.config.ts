import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  reporter: [['html', { open: 'never', outputFolder: 'test-results/reports' }]],
  outputDir: 'test-results/',
});
