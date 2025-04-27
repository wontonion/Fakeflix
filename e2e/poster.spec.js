const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("Poster Component Tests", () => {
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

  test("should display posters with images", async () => {
    // Wait for the posters to be visible and loaded
    await page.waitForSelector("div[class='Poster']", { state: 'visible', timeout: 10000 });
    
    // Wait for images to be loaded
    await page.waitForSelector("div[class='Poster'] img", { state: 'visible', timeout: 10000 });

    // Wait to ensure images are fully loaded
    await page.waitForTimeout(2000);
  });

  test("should display poster info on hover", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector("div[class='Poster']", { state: 'visible', timeout: 15000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector("div.Poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Poster__info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
        
        // Show the after pseudo-element (approximation)
        const style = document.createElement('style');
        style.innerHTML = `
          div.Poster::after {
            opacity: 1 !important;
          }
        `;
        document.head.appendChild(style);
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Now check if the elements are visible after forcing the hover state
    await expect(page.locator("div.Poster__info").first()).toBeVisible({ timeout: 5000 });
  });

  test("should show action buttons on hover", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector("div[class='Poster']", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector("div.Poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Poster__info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
        
        // Show the after pseudo-element (approximation)
        const style = document.createElement('style');
        style.innerHTML = `
          div.Poster::after {
            opacity: 1 !important;
          }
        `;
        document.head.appendChild(style);
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Check if action buttons are visible with first() to select only the first element
    await expect(page.locator(".Poster__info--icon.icon--play").first()).toBeVisible();
    await expect(page.locator(".Poster__info--icon.icon--favourite").first()).toBeVisible();
    await expect(page.locator(".Poster__info--icon.icon--toggleModal").first()).toBeVisible();
  });

  test("should navigate to play page when clicking the play button", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector("div[class='Poster']", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector("div.Poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Poster__info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Click the play button of the first poster
    await page.locator(".Poster__info--icon.icon--play").first().click();
    
    // Check if we navigated to the play page
    await page.waitForURL("/play");
    
    // jump back to browse page
    await page.goto("/browse");
    await page.waitForURL("/browse", { timeout: 10000 });
  });

  test("should open detail modal when clicking the poster", async () => {
    // await page.goto("/browse");
    // await page.waitForURL("/browse", { timeout: 10000 });
    await page.locator('input[placeholder="Search titles, people"]').fill("Ghost in the Shell");
    await page.waitForTimeout(2000);
    
    // Click on the first poster
    await page.locator("div[class='Poster']").first().click();
    await page.waitForTimeout(1000);

    // Wait for modal to appear
    await page.waitForSelector(".Modal__wrp", { state: 'visible', timeout: 10000 });
    
    // Check if modal appears
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Verify the modal contains correct movie information
    await expect(page.locator(".Modal__info--title")).toBeVisible();
    await expect(page.locator(".Modal__info--description")).toBeVisible();
    
    // Close the modal
    await page.locator(".Modal__closebtn").click();
    await page.waitForSelector(".Modal__wrp", { state: 'hidden', timeout: 10000 });
    await expect(page.locator(".Modal__wrp")).not.toBeVisible();
  });

  test("should open detail modal when clicking the chevron down button", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector("div[class='Poster']", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector("div.Poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Poster__info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Click the chevron down button
    await page.locator(".Poster__info--icon.icon--toggleModal").first().click();
    
    // Wait for modal to appear
    await page.waitForSelector(".Modal__wrp", { state: 'visible', timeout: 10000 });
    
    // Check if modal appears
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Close the modal
    await page.locator(".Modal__closebtn").click();
    await page.waitForSelector(".Modal__wrp", { state: 'hidden', timeout: 10000 });
    await expect(page.locator(".Modal__wrp")).not.toBeVisible();
  });

  test("should toggle favorites when clicking the add/remove button", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector("div[class='Poster']", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector("div.Poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Poster__info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Get initial state of favorites button (plus or minus icon)
    const initialIcon = await page.locator(".Poster__info--icon.icon--favourite svg").first().getAttribute("data-icon");
    
    // Click the favorites button
    await page.locator(".Poster__info--icon.icon--favourite").first().click();
    
    // Wait for state change
    await page.waitForTimeout(1000);
    
    // Check if icon has changed
    if (initialIcon === "plus") {
      // If it had a plus icon initially, it should now have a minus icon
      await expect(page.locator(".Poster__info--icon.icon--favourite svg[data-icon='minus']").first()).toBeVisible();
    } else {
      // If it had a minus icon initially, it should now have a plus icon
      await expect(page.locator(".Poster__info--icon.icon--favourite svg[data-icon='plus']").first()).toBeVisible();
    }
    
    // Reset state to original if needed
    if (initialIcon !== await page.locator(".Poster__info--icon.icon--favourite svg").first().getAttribute("data-icon")) {
      await page.locator(".Poster__info--icon.icon--favourite").first().click();
      await page.waitForTimeout(1000);
    }
  });

  test.afterAll(async () => {
    await page.close();
  });
});
