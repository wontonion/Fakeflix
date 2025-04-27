// beyond login page, navbar should be visible and have identical elements as home page

const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("Navbar Tests", () => {
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

  test.describe("Navbar logo", () => {
    test("should display the correct logo", async () => {
      await expect(page.locator("nav.Navbar")).toBeVisible();
      await expect(page.locator("img.Navbar__logo")).toBeVisible();
    });
  });

  test.describe("Navbar links", () => {
    test("should display Home link", async () => {
      await expect(
        page.locator('a[href="/browse"]:has-text("Home")')
      ).toBeVisible();
      await expect(
        page.locator('a[href="/tvseries"]:has-text("TV Series")')
      ).toBeVisible();
      await expect(
        page.locator('a[href="/movies"]:has-text("Movies")')
      ).toBeVisible();
      await expect(
        page.locator('a[href="/popular"]:has-text("New & Popular")')
      ).toBeVisible();
      await expect(
        page.locator('a[href="/mylist"]:has-text("My List")')
      ).toBeVisible();
    });
  });
  
  test.describe("Active link highlighting", () => {
    test("should add activeNavLink class to clicked navbar links", async () => {
      // Check Home link (should be active by default on /browse)
      await expect(page.locator('a[href="/browse"]')).toHaveClass(
        "activeNavLink"
      );

      // Click on TV Series link and verify it gets activeNavLink class
      await page.locator('a[href="/tvseries"]:has-text("TV Series")').click();
      await page.waitForURL("/tvseries");
      await expect(page.locator('a[href="/tvseries"]')).toHaveClass(
        "activeNavLink"
      );

      // Click on Movies link and verify it gets activeNavLink class
      await page.locator('a[href="/movies"]:has-text("Movies")').click();
      await page.waitForURL("/movies");
      await expect(page.locator('a[href="/movies"]')).toHaveClass(
        "activeNavLink"
      );

      // Click on New & Popular link and verify it gets activeNavLink class
      await page
        .locator('a[href="/popular"]:has-text("New & Popular")')
        .click();
      await page.waitForURL("/popular");
      await expect(page.locator('a[href="/popular"]')).toHaveClass(
        "activeNavLink"
      );

      // Click on My List link and verify it gets activeNavLink class
      await page.locator('a[href="/mylist"]:has-text("My List")').click();
      await page.waitForURL("/mylist");
      await expect(page.locator('a[href="/mylist"]')).toHaveClass(
        "activeNavLink"
      );

      // Return to Home/browse
      await page.locator('a[href="/browse"]:has-text("Home")').click();
      await page.waitForURL("/browse");
      await expect(page.locator('a[href="/browse"]')).toHaveClass(
        "activeNavLink"
      );
    });
  });

  test.describe("Search Functionality", () => {
    test("should display search icon in the navbar", async () => {
      await expect(page.locator("div.Searchbar")).toBeVisible();
      await expect(page.locator("div.Searchbar--toggler")).toBeVisible();
    });

    test("should show search bar after clicking search icon", async () => {
      await page.locator("div.Searchbar--toggler").click();
      await expect(
        page.locator('input[placeholder="Search titles, people"]')
      ).toBeVisible();
    });

    test("should show search results after typing in search bar", async () => {
      await page.locator('input[placeholder="Search titles, people"]').fill("Ghost in the Shell");
      await page.waitForTimeout(1000);
      await expect(page.locator("h2[class='Search__title']:has-text('Search results for: ')")).toBeVisible();
      await expect(page.locator("h2[class='Search__title']:has-text('Ghost in the Shell')")).toBeVisible();
    });
  });

  test.describe("user avatar and logout functionality", () => {
    test("should display user avatar in the navbar", async () => {
      await expect(page.locator("div.Navbar__navprofile")).toBeVisible();
      // the dropdown should be visible
      await expect(
        page.locator("div.Navbar__navprofile--content")
      ).toBeVisible();
    });

    test("should display sign out button after clicking the dropdown button", async () => {
      await page.locator("div.Navbar__navprofile").click();
      await expect(page.locator('li:has-text("Sign out")')).toBeVisible();
      await page.locator("div.Navbar__navprofile").click();
      await expect(page.locator('li:has-text("Sign out")')).toBeHidden();
    });
    
    test("should sign out when clicking sign out button", async () => {
      await page.locator("div.Navbar__navprofile").click();
      await expect(page.locator('li:has-text("Sign out")')).toBeVisible();
      await page.locator('li:has-text("Sign Out")').click();
      await page.waitForURL("/login");
      await expect(page.locator('input[placeholder="E-mail"]')).toBeVisible();
      await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    });
  });

  test.afterAll(async () => {
    await page.close();
  });
});
