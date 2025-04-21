import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const loginUrl = 'http://localhost:3000/login';
  const baseUrl = 'http://localhost:3000';
  const validEmail = 'test@test.com';
  const validPassword = 'test@test.com';

  test('TC001 - Successful login with valid credentials', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="email"]', validEmail);
    await page.fill('input[name="password"]', validPassword);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/splash/, { timeout: 10000 });
    await expect(page).toHaveURL(`${baseUrl}/splash`);
  });

  test('TC002 - Invalid email format', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="email"]', 'invalidemail.com');
    await page.fill('input[name="password"]', validPassword);
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(500); // allow error message to render
    const errorLocator = page.locator('.Auth__content--errors');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(/invalid/i);
  });

  test('TC003 - Empty email field', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="password"]', validPassword);
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(500);
    const errorLocator = page.locator('.Auth__content--errors');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(/email/i);
  });

  test('TC004 - Empty password field', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="email"]', validEmail);
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(500);
    const errorLocator = page.locator('.Auth__content--errors');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(/password/i);
  });

  test('TC005 - Invalid credentials', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="email"]', validEmail);
    await page.fill('input[name="password"]', 'wrongPassword123');
    await page.click('button:has-text("Sign In")');
    const errorLocator = page.locator('.Auth__content--errors');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(/invalid/i);
  });

  test('TC008 - Logout works correctly', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="email"]', validEmail);
    await page.fill('input[name="password"]', validPassword);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/splash/, { timeout: 10000 });

    await page.waitForSelector('[alt="User avatar"]', { timeout: 5000 });
    await page.click('[alt="User avatar"]');
    await page.click('text=Logout');
    await page.waitForURL(loginUrl);
    await expect(page).toHaveURL(loginUrl);
  });

  test('TC009 - Access protected route while logged out redirects to login', async ({ page }) => {
    await page.goto(`${baseUrl}/my-list`);
    await expect(page).toHaveURL(loginUrl);
  });

  test('TC010 - Access protected route after login works', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('input[name="email"]', validEmail);
    await page.fill('input[name="password"]', validPassword);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/splash/, { timeout: 10000 });

    await page.goto(`${baseUrl}/my-list`);
    await expect(page).toHaveURL(/\/my-list/);
    await expect(page.locator('h1')).toContainText(/my list/i);
  });
});
