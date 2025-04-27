const { test, expect } = require("@playwright/test");
const { fetchPopularDataConfig } = require("../src/dataConfig");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("News & Popular Page Tests", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Go directly to browse page - we're already authenticated thanks to storageState
    await page.goto("/login");
    await page.getByPlaceholder("E-mail").fill("test@test.com");
    await page.getByPlaceholder("Password").fill("test@test.com");
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForURL("/splash", { timeout: 10000 });
    await page.waitForURL("/browse", { timeout: 10000 });

    await page.locator("a[href='/popular']").click();

    // Add a small delay to ensure everything is properly loaded and saved
    await page.waitForTimeout(3000);
  });

  test.describe("News & Popular row tests", () => {
    test("should display rows with correct titles", async () => {
      // Check for all movie row titles from fetchPopularDataConfig
      const expectedTitles = fetchPopularDataConfig.map((row) => row.title);

      // Get all row titles on the page
      const rowTitles = await page.locator("h3.Row__title").allTextContents();

      // Verify each expected title is present in the page
      for (const expectedTitle of expectedTitles) {
        expect(
          rowTitles.some((title) => title.includes(expectedTitle))
        ).toBeTruthy();
      }
    });
  });

  test.afterAll(async () => {
    await page.close();
  });
});
