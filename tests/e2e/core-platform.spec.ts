import { test, expect } from '@playwright/test';

test.describe('Platform Core Verification', () => {
  const baseUrl = 'https://qa-sentinel-platform.vercel.app/';

  test('homepage loads correctly', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/QA Sentinel Dashboard/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation to dashboard works', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.locator('body')).toBeVisible();
    
    const brainIcon = page.locator('svg').first();
    await expect(brainIcon).toBeVisible();
  });
});
