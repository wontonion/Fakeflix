import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("http://localhost:3000/login");
  await page.getByPlaceholder("E-mail").fill("test@test.com");
  await page.getByPlaceholder("Password").fill("test@test.com");
  await page.locator('button[type="submit"]:has-text("Sign in")').click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("http://localhost:3000/splash", { timeout: 10000 });
  await page.waitForURL("http://localhost:3000/browse", { timeout: 10000 });
  
  // Add a small delay to ensure everything is properly loaded and saved
  await page.waitForTimeout(1000);
  
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  // await expect(page.url()).toContain("/browse");
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
