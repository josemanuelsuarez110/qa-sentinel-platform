import { test, expect } from '@playwright/test';

test('dashboard displays stats', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  
  // Basic check for dashboard content
  await expect(page.locator('h1')).toBeVisible();
  // Expect common dashboard elements
  await expect(page.getByText(/Overview|Statistics|History/i).first()).toBeVisible();
});
