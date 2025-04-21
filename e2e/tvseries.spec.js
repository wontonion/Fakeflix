const { test, expect } = require("@playwright/test");
const { fetchSeriesDataConfig } = require("../src/dataConfig");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("TV Series Page Tests", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Go directly to browse page - we're already authenticated thanks to storageState
    await page.goto("/login");
    await page.getByPlaceholder("E-mail").fill("test@test.com");
    await page.getByPlaceholder("Password").fill("test@test.com");
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForURL("/splash", { timeout: 10000 });
    await page.waitForURL("/browse", { timeout: 10000 });

    await page.locator("a[href='/tvseries']").click();

    // Add a small delay to ensure everything is properly loaded and saved
    await page.waitForTimeout(1000);
  });

  test.describe("TV servies row tests", () => {
    test("should display rows with correct titles", async () => {
      // Check for all movie row titles from fetchSeriesDataConfig
      const expectedTitles = fetchSeriesDataConfig.map((row) => row.title);

      // Get all row titles on the page
      const rowTitles = await page.locator("h2.Row__title").allTextContents();

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
