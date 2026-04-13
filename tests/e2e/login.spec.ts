import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/');

  // Verify elements exist before interaction
  await page.click('text=Login');
  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', '123456');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
