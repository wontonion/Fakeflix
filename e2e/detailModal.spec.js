const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("Detail Modal Tests", () => {
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
    
    // Search for a movie once at the beginning
    await page.locator('input[placeholder="Search titles, people"]').fill("Ghost in the Shell");
    await page.waitForTimeout(2000); // Wait longer for search results
  });

  // For the "should show detail modal" test, we don't need to reload
  test("should show detail modal when clicking on a movie", async () => {
    // Click on the first movie in the search results
    await page.locator("div[class='Poster']").first().click();

    // Wait for the detail modal to appear
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Check essential modal elements are visible
    await expect(page.locator(".Modal__image--img")).toBeVisible();
    await expect(page.locator(".Modal__info--title")).toBeVisible();
    await expect(page.locator(".Modal__info--description")).toBeVisible();
    await expect(page.locator(".Modal__closebtn")).toBeVisible();
    
    // Check action buttons
    await expect(page.locator(".Modal__image--button:has-text('Play')")).toBeVisible();
    await expect(page.locator(".Modal__image--button-circular")).toBeVisible();
    
    // Check info rows
    await expect(page.locator(".Modal__info--row:has-text('Genres')")).toBeVisible();
    await expect(page.locator(".Modal__info--row:has-text('Average vote')")).toBeVisible();
    await expect(page.locator(".Modal__info--row:has-text('Original language')")).toBeVisible();
    await expect(page.locator(".Modal__info--row:has-text('Age classification')")).toBeVisible();
    
    // Close the modal for the next test
    await page.locator(".Modal__closebtn").click();
    await expect(page.locator(".Modal__wrp")).not.toBeVisible();
  });

  test("should close detail modal when clicking the close button", async () => {
    // Click on the first movie to open modal
    await page.locator("div[class='Poster']").first().click();
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Click the close button
    await page.locator(".Modal__closebtn").click();
    
    // Verify modal is no longer visible
    await expect(page.locator(".Modal__wrp")).not.toBeVisible();
  });

  test("should navigate to play page when clicking the Play button", async () => {
    // Click on the first movie to open modal
    await page.locator("div[class='Poster']").first().click();
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Click the Play button
    await page.locator(".Modal__image--button:has-text('Play')").click();
    
    // Check if we navigated to the play page
    await page.waitForURL("/play");
    
    // Go back to browse page and perform search again for next test
    await page.goto("/browse");
    await page.waitForTimeout(1000);
    
    // Search for the movie again
    await page.locator('input[placeholder="Search titles, people"]').fill("Ghost in the Shell");
    await page.waitForTimeout(2000); // Wait longer for search results
  });

  test("should toggle favorites when clicking the Add/Remove button", async () => {
    // Click on the first movie to open modal
    await page.locator("div[class='Poster']").first().click();
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Get the initial state of the favorites button
    const hasPlusIcon = await page.locator(".Modal__image--button-circular svg[data-icon='plus']").count() > 0;
    
    // Click the favorites button
    await page.locator(".Modal__image--button-circular").click();
    
    if (hasPlusIcon) {
      // If it had a plus icon initially, it should now have a minus icon
      await expect(page.locator(".Modal__image--button-circular svg[data-icon='minus']")).toBeVisible();
      
      // Close the modal
      await page.locator(".Modal__closebtn").click();
    } else {
      // If it had a minus icon initially, the modal should close (as per the handleRemove function)
      await expect(page.locator(".Modal__wrp")).not.toBeVisible();
      
      // Open the modal again to verify the button state changed
      await page.locator("div[class='Poster']").first().click();
      await expect(page.locator(".Modal__image--button-circular svg[data-icon='plus']")).toBeVisible();
      
      // Close the modal
      await page.locator(".Modal__closebtn").click();
    }
  });

  test.afterAll(async () => {
    await page.close();
  });
});
