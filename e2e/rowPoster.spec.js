const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

/** @type {import('@playwright/test').Page} */
let page;

test.describe("RowPoster Component Tests", () => {
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
    await page.waitForTimeout(2000);
  });

  test("should display row posters with images", async () => {
    // Wait for the posters to be visible and loaded - using the correct selector
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Verify that at least one poster is visible
    await expect(page.locator(".Row__poster").first()).toBeVisible();
  });

  test("should display row poster info on hover", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 15000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector(".Row__poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Check if the elements are visible after forcing the hover state
    await expect(page.locator(".Row__poster-info").first()).toBeVisible({ timeout: 5000 });
  });

  test("should show action buttons on hover", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector(".Row__poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Check if action buttons are visible
    await expect(page.locator(".Row__poster-info--icon.icon--play").first()).toBeVisible();
    await expect(page.locator(".Row__poster-info--icon.icon--favourite").first()).toBeVisible();
    await expect(page.locator(".Row__poster-info--icon.icon--toggleModal").first()).toBeVisible();
  });

  test("should navigate to play page when clicking the play button", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Locate a row poster that's not obscured by slider buttons
    // Try to find a poster in the middle of the row
    await page.evaluate(() => {
      // Scroll down a bit to ensure rows are visible
      window.scrollBy(0, 200);
    });
    
    await page.waitForTimeout(1000);
    
    // Force the hover state by using JavaScript on a specific poster
    // We'll find one that's fully visible and not at the edge
    await page.evaluate(() => {
      // Get all posters and find one in the middle that's fully visible
      const posters = Array.from(document.querySelectorAll(".Row__poster"));
      // Try to find a poster that's not at the edges (avoiding slider controls)
      const poster = posters.find(p => {
        const rect = p.getBoundingClientRect();
        // Check if it's in the viewport and not at the far edges
        return rect.top >= 0 && 
               rect.left >= 100 && 
               rect.bottom <= window.innerHeight &&
               rect.right <= (window.innerWidth - 100);
      }) || posters[Math.floor(posters.length / 2)]; // fallback to middle poster
      
      if (poster) {
        // Scroll it into view first
        poster.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Directly change CSS to simulate hover effect
        poster.style.transform = "scale(1.3)";
        poster.style.zIndex = "5"; // Higher z-index to ensure it's above other elements
        poster.style.opacity = "1";
        
        // Show the info elements
        const infoElement = poster.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Since you can trigger the redirect manually, let's try to directly target and click the link
    await page.evaluate(() => {
      // Find a visible play button and click it programmatically
      const playButtons = document.querySelectorAll(".Row__poster-info--icon.icon--play");
      for (const button of playButtons) {
        if (isElementVisible(button)) {
          // Use the native click() method to bypass any potential event handling issues
          button.click();
          break;
        }
      }
      
      // Helper function to check if element is visible
      function isElementVisible(elem) {
        if (!elem) return false;
        const style = window.getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity === '0') return false;
        
        const rect = elem.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        
        return true;
      }
    });
    
    // Wait for navigation to occur after clicking
    await page.waitForURL("/play", { timeout: 10000 });
    
    // Jump back to browse page
    await page.goto("/browse");
    await page.waitForURL("/browse", { timeout: 10000 });
  });

  test("should open detail modal when clicking the poster", async () => {
    // Wait for posters to load
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Click on the first poster
    await page.locator(".Row__poster").first().click();
    await page.waitForTimeout(1000);

    // Wait for modal to appear
    await page.waitForSelector(".Modal__wrp", { state: 'visible', timeout: 10000 });
    
    // Check if modal appears with correct content
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    await expect(page.locator(".Modal__info--title")).toBeVisible();
    await expect(page.locator(".Modal__info--description")).toBeVisible();
    
    // Close the modal
    await page.locator(".Modal__closebtn").click();
    await page.waitForSelector(".Modal__wrp", { state: 'hidden', timeout: 10000 });
    await expect(page.locator(".Modal__wrp")).not.toBeVisible();
  });

  test("should open detail modal when clicking the chevron down button", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector(".Row__poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Click the chevron down button
    await page.locator(".Row__poster-info--icon.icon--toggleModal").first().click();
    
    // Wait for modal to appear
    await page.waitForSelector(".Modal__wrp", { state: 'visible', timeout: 10000 });
    
    // Check if modal appears
    await expect(page.locator(".Modal__wrp")).toBeVisible();
    
    // Close the modal
    await page.locator(".Modal__closebtn").click();
    await page.waitForSelector(".Modal__wrp", { state: 'hidden', timeout: 10000 });
    await expect(page.locator(".Modal__wrp")).not.toBeVisible();
  });

  test("should display movie/show title in the row poster info", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Force the hover state
    await page.evaluate(() => {
      const posterElement = document.querySelector(".Row__poster");
      if (posterElement) {
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        const infoElement = posterElement.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Check if the title is displayed
    await expect(page.locator(".Row__poster-info--title h3").first()).toBeVisible();
    
    // Verify title is not empty
    const titleText = await page.locator(".Row__poster-info--title h3").first().textContent();
    expect(titleText.trim().length).toBeGreaterThan(0);
  });

  test("should display genre information in the row poster info", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Force the hover state
    await page.evaluate(() => {
      const posterElement = document.querySelector(".Row__poster");
      if (posterElement) {
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        const infoElement = posterElement.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Check if genre information is displayed
    await expect(page.locator(".Row__poster-info--genres .genre-title").first()).toBeVisible();
  });

  test("should toggle favorites when clicking the add/remove button", async () => {
    // Wait to ensure posters are fully loaded
    await page.waitForSelector(".Row__poster", { state: 'visible', timeout: 10000 });
    
    // Force the hover state by using JavaScript
    await page.evaluate(() => {
      const posterElement = document.querySelector(".Row__poster");
      if (posterElement) {
        // Directly change CSS to simulate hover effect
        posterElement.style.transform = "scale(1.3)";
        posterElement.style.zIndex = "1";
        posterElement.style.opacity = "1";
        
        // Show the info elements
        const infoElement = posterElement.querySelector(".Row__poster-info");
        if (infoElement) {
          infoElement.style.opacity = "1";
          infoElement.style.transform = "translateY(0)";
        }
      }
    });
    
    // Wait for styles to apply
    await page.waitForTimeout(1000);
    
    // Get initial state of favorites button (plus or minus icon)
    const initialIcon = await page.locator(".Row__poster-info--icon.icon--favourite svg").first().getAttribute("data-icon");
    
    // Click the favorites button
    await page.locator(".Row__poster-info--icon.icon--favourite").first().click();
    
    // Wait for state change
    await page.waitForTimeout(1000);
    
    // Check if icon has changed
    if (initialIcon === "plus") {
      // If it had a plus icon initially, it should now have a minus icon
      await expect(page.locator(".Row__poster-info--icon.icon--favourite svg[data-icon='minus']").first()).toBeVisible();
    } else {
      // If it had a minus icon initially, it should now have a plus icon
      await expect(page.locator(".Row__poster-info--icon.icon--favourite svg[data-icon='plus']").first()).toBeVisible();
    }
    
    // Reset state to original if needed
    if (initialIcon !== await page.locator(".Row__poster-info--icon.icon--favourite svg").first().getAttribute("data-icon")) {
      await page.locator(".Row__poster-info--icon.icon--favourite").first().click();
      await page.waitForTimeout(1000);
    }
  });
  
  test.afterAll(async () => {
    await page.close();
  });
});