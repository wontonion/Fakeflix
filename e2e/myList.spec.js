const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("My List Page Tests", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Go directly to browse page - we're already authenticated thanks to storageState
    await page.goto("/login");
    await page.getByPlaceholder("E-mail").fill("test@test.com");
    await page.getByPlaceholder("Password").fill("test@test.com");
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForURL("/splash", { timeout: 10000 });
    await page.waitForURL("/browse", { timeout: 10000 });

    await page.locator("a[href='/mylist']").click();

    // Add a small delay to ensure everything is properly loaded and saved
    await page.waitForTimeout(2000);
  });

  test.describe("Routing to my list page", () => {
    test("should be on my list page", async () => {
      await expect(page.url()).toContain("mylist");
    });
  });

  test("should display no items in my list", async () => {
    await page.waitForTimeout(5000);
    await page.locator("a[href='/mylist']").click();
    await page.waitForTimeout(5000);
    await expect(
      page.getByText("Sorry, you don't have a favourite movie or tv-show yet.")
    ).toBeVisible();
  });

  test.afterAll(async () => {
    await page.close();
  });
});
