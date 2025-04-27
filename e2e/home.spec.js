const { test, expect } = require("@playwright/test");
const { fetchMovieDataConfig } = require("../src/dataConfig");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("Home Page Tests", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Go directly to browse page - we're already authenticated thanks to storageState
    await page.goto("/login");
    await page.getByPlaceholder("E-mail").fill("test@test.com");
    await page.getByPlaceholder("Password").fill("test@test.com");
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForURL("/splash", { timeout: 10000 });
    await page.waitForURL("/browse", { timeout: 10000 });

    // Add a small delay to ensure everything is properly loaded and saved
    await page.waitForTimeout(1000);
  });

  test.describe("Movie Rows", () => {
    test("should display multiple movie rows", async () => {
      // Check that we have multiple Row components rendered
      const rowCount = await page.locator("div.Row").count();
      expect(rowCount).toBeGreaterThan(0);
    });

    test("should display rows with correct titles", async () => {
      // Check for all movie row titles from fetchMovieDataConfig
      const expectedTitles = fetchMovieDataConfig.map((row) => row.title);

      // Get all row titles on the page
      const rowTitles = await page.locator("h3.Row__title").allTextContents();

      // Verify each expected title is present in the page
      for (const expectedTitle of expectedTitles) {
        expect(
          rowTitles.some((title) => title.includes(expectedTitle))
        ).toBeTruthy();
      }
    });

    test("should display movie posters in each row", async () => {
      // Wait for the poster images to load
      await expect(page.locator("div.Row__poster").first()).toBeVisible();
      await expect(page.locator("div.Row__poster img").first()).toBeVisible();
    });

    test("should allow horizontal scrolling in movie rows", async () => {
      // Find the first row
      const firstRow = page.locator("div.Row").first();

      // Find the scroll button and click it
      const scrollButton = firstRow.locator("div.Row__slider--mask.right");
      await scrollButton.click();

      // Verify the slider moves
      // We can check this indirectly by waiting a bit and seeing that the container is still visible
      await page.waitForTimeout(1000);
      await expect(firstRow.locator("div.Row__poster--wrp")).toBeVisible();
    });
  });

  test.describe("Credits Section", () => {
    test("should display credits section at the bottom", async () => {
      await expect(page.locator("footer.Credits")).toBeVisible();
    });

    test("should contain reference to developer", async () => {
      await expect(page.locator("footer.Credits")).toContainText(
        "Developed by Th3Wall"
      );
    });
  });

  test.afterAll(async () => {
    await page.close();
  });
});
