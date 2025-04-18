const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Basic assertion that the page loaded
  await expect(page).toHaveTitle(/Fakeflix/);
}); 