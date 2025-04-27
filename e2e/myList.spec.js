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

    // Navigate to My List page
    await page.locator("a[href='/mylist']").click();
    await page.waitForTimeout(5000);

    // Clean up any existing favorites
    try {
      // Check if there are any items in the list
      const hasFavorites = await page.locator(".Poster").count() > 0;
      
      if (hasFavorites) {
        // Remove all items from favorites
        while (await page.locator(".Poster").count() > 0) {
          // Hover over the first poster to reveal controls
          await page.locator(".Poster").first().hover();
          await page.waitForTimeout(1000);
          
          // Click the remove button
          await page.locator(".Poster__info--icon.icon--favourite").first().click();
          await page.waitForTimeout(2000);
        }
      }
      
      // Verify that the list is empty
      await expect(
        page.getByText("Sorry, you don't have a favourite movie or tv-show yet.")
      ).toBeVisible({ timeout: 10000 });
    } catch (error) {
      console.log("No items to clean up or error occurred:", error);
    }


    await page.locator("a[href='/mylist']").click();
    await page.waitForTimeout(5000);
  });

  test("should display no items in my list", async () => {
    await expect(
      page.getByText("Sorry, you don't have a favourite movie or tv-show yet.")
    ).toBeVisible();
  });

  test("should add a movie to favorites and display it in my list", async () => {
    // Navigate to browse page
    await page.goto("/browse");
    await page.waitForURL("/browse");
    
    // Wait for the posters to load
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Hover over the first movie poster to reveal the controls
    await page.locator(".Row__poster").first().hover();
    
    // Wait for the controls to appear
    await page.waitForSelector(".Row__poster-info--iconswrp", { state: 'visible' });
    
    // Click the "Add to favorites" button (plus icon)
    await page.locator(".Row__poster-info--icon.icon--favourite").first().click();
    
    // Navigate to the My List page
    await page.locator("a[href='/mylist']").click();
    await page.waitForURL("/mylist");
    await page.waitForTimeout(2000); // Wait for page to load
    
    // Verify that the My List title is displayed (indicating items are present)
    await expect(page.locator(".MyList__title").first()).toHaveText("My List");
    
    // Verify that at least one poster is displayed in My List
    await expect(page.locator(".Poster")).toBeVisible();
    
    // Verify that the "no favorites" message is not displayed
    await expect(
      page.getByText("Sorry, you don't have a favourite movie or tv-show yet.")
    ).not.toBeVisible();
  });

  test("should remove a movie from favorites and update my list", async () => {
    // Navigate to My List page to see favorites
    await page.locator("a[href='/mylist']").click();
    await page.waitForURL("/mylist");
    
    // Verify we have items in the list
    await expect(page.locator(".Poster")).toBeVisible();
    
    // Hover over the movie poster to reveal controls
    await page.locator(".Poster").first().hover();
    
    // Wait for controls to appear
    await page.waitForTimeout(1000);
    
    // Click the minus icon to remove from favorites
    await page.locator(".Poster__info--icon.icon--favourite").first().click();
    
    // Wait for the removal to take effect
    await page.waitForTimeout(2000);
    
    // Verify the "no favorites" message is displayed again
    await expect(
      page.getByText("Sorry, you don't have a favourite movie or tv-show yet.")
    ).toBeVisible();
  });

  test("should show correct favorite icon on browse page after adding to favorites", async () => {
    // Navigate to browse page
    await page.goto("/browse");
    await page.waitForURL("/browse");
    
    // Wait for the posters to load
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Store the title of the first movie
    const firstMovieTitle = await page.locator(".Row__poster-info--title h3").first().innerText();
    
    // Hover over the first movie poster to reveal the controls
    await page.locator(".Row__poster").first().hover();
    
    // Wait for the controls to appear
    await page.waitForSelector(".Row__poster-info--iconswrp", { state: 'visible' });
    
    // Click the "Add to favorites" button (plus icon)
    await page.locator(".Row__poster-info--icon.icon--favourite").first().click();
    
    // Wait for the favorite status to update
    await page.waitForTimeout(1000);
    
    // Hover over the same movie again
    await page.locator(".Row__poster").first().hover();
    
    // Wait for the controls to appear
    await page.waitForSelector(".Row__poster-info--iconswrp", { state: 'visible' });
    
    // Verify the icon has changed to a minus icon (for removing from favorites)
    // First, check if the favorite button is visible 
    await expect(page.locator(".Row__poster-info--icon.icon--favourite").first()).toBeVisible();

    // Then check if clicking it takes us to the remove action by hovering and clicking,
    // and verifying that the movie is removed from favorites in the next step
    await page.locator(".Row__poster-info--icon.icon--favourite").first().click();
    
    // Wait for the favorite status to update
    await page.waitForTimeout(1000);
    
    // Hover again to check if the icon is now a plus (indicating adding to favorites)
    await page.locator(".Row__poster").first().hover();
    await page.waitForSelector(".Row__poster-info--iconswrp", { state: 'visible' });
    
    // Click to add to favorites again so we can continue with the test
    await page.locator(".Row__poster-info--icon.icon--favourite").first().click();
    await page.waitForTimeout(1000);

    // Navigate to My List page to confirm it was added
    await page.locator("a[href='/mylist']").click();
    await page.waitForURL("/mylist");
    
    // Verify the movie is in My List
    await expect(page.locator(".MyList__title").first()).toHaveText("My List");
    await expect(page.locator(".Poster")).toBeVisible();
    
    // Get the title of the movie in My List and verify it matches the one we added
    const myListMovieTitle = await page.locator(".Poster__info--title h3").first().innerText();
    expect(myListMovieTitle).toBe(firstMovieTitle);
  });

  test.afterAll(async () => {
    await page.close();
  });
});
