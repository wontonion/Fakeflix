const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("Banner Tests", () => {
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

  test("should display the featured banner", async () => {
    await expect(page.locator("header.Banner")).toBeVisible();
    await expect(page.locator("div.Banner__content")).toBeVisible();
    await expect(page.locator("div.Banner__panel")).toBeVisible();
    await expect(page.locator("div.Banner__bottom-shadow")).toBeVisible();
  });

  test("should display banner content", async () => {
    await expect(page.locator("h1.Banner__content--title")).toBeVisible();
    await expect(page.locator("p.Banner__content--description")).toBeVisible();
  });

  test("should display banner with two buttons", async () => {
    await expect(page.locator("div.Banner__buttons")).toBeVisible();
    // one for play button
    await expect(
      page.locator("a.Banner__button[href='/play']:has-text('Play')")
    ).toBeVisible();
    // one for more info button
    await expect(
      page.locator("button.Banner__button:has-text('More info')")
    ).toBeVisible();
  });

  test("should open movie details modal when clicking More info button", async () => {
    await page.locator("button.Banner__button:has-text('More info')").click();
    await expect(page.locator("div.Modal__overlay")).toBeVisible();
    // Close the modal to not affect other tests
    await page.locator("button.Modal__closebtn").click();
  });

  test.afterAll(async () => {
    await page.close();
  });
});
