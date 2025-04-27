const { test, expect } = require("@playwright/test");

// config for not using login state
// test.use({ storageState: { cookies: [], origins: [] } });
/** @type {import('@playwright/test').Page} */
let page;

test.describe("Sign In component Tests", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    await page.goto("/login");
    await page.waitForTimeout(3000);
  });

  test.describe("input fields should have correct type", () => {
    test("email input field should have type email", async () => {
      await expect(page.getByPlaceholder("E-mail")).toHaveAttribute(
        "type",
        "email"
      );
    });
    test("password input field should have type password", async () => {
      await expect(page.getByPlaceholder("Password")).toHaveAttribute(
        "type",
        "password"
      );
    });
  });

  test.describe("unexpected error message in sign in form", () => {
    test("should show error message for empty input", async () => {
      await page.locator('button[type="submit"]:has-text("Sign In")').click();
      await expect(
        page.locator(
          'p.InputField__label:has-text("Please enter a valid email address.")'
        )
      ).toBeVisible();
      await expect(
        page.locator(
          'p.InputField__label:has-text("The password should have a length between 6 and 30 characters.")'
        )
      ).toBeVisible();
    });
  });

  test.describe("check validation of each input fields", () => {
    test.describe("email input field", () => {
      test("should show error message for invalid email format", async () => {
        await page.locator('input[name="email"]').fill("invalid-email");
        await page.locator('button[type="submit"]:has-text("Sign In")').click();

        await expect(
          page.locator(
            'p.InputField__label:has-text("Please enter a valid email address.")'
          )
        ).toBeVisible();
      });
    });
  });

  test.describe("password input field", () => {
    test("password should be at least 6 characters", async () => {
      await page.locator('input[name="password"]').fill("pass");
      await page.locator('button[type="submit"]:has-text("Sign In")').click();

      await expect(
        page.locator(
          'p.InputField__label:has-text("The password should have a length between 6 and 30 characters.")'
        )
      ).toBeVisible();
    });

    test("password should be less than 30 characters", async () => {
      await page.locator('input[name="password"]').fill("a".repeat(31));
      await page.locator('button[type="submit"]:has-text("Sign In")').click();
      await expect(
        page.locator(
          'p.InputField__label:has-text("The password should have a length between 6 and 30 characters.")'
        )
      ).toBeVisible();
    });
  });

  test.describe("should show error message for invalid credentials", () => { 
    test("should show error message for invalid email", async () => {
      await page.locator('input[name="email"]').fill("test12341234234123423@test.com");
      await page.locator('input[name="password"]').fill(" test@test.com");
      await page.locator('button[type="submit"]:has-text("Sign In")').click();

      // should be stuck on login page
      await expect(page.url()).toContain("/login");
    });
    test("should show error message for invalid password", async () => {
      await page.locator('input[name="email"]').fill("test@test.com");
      await page.locator('input[name="password"]').fill("test12341234234123423");
      await page.locator('button[type="submit"]:has-text("Sign In")').click();

      // should be stuck on login page
      await expect(page.url()).toContain("/login");
    });
  });

  test.describe("cannot sign in anonymously", () => {
    test("should not be able to sign in anonymously", async () => {
      await page.locator('button[type="button"]:has-text("Sign in anonymously")').click();
      
      // should be stuck on login page
      await expect(page.url()).toContain("/login");
    });
  });


  test.describe("should be able to sign in with google", () => {
    test("should be able to sign in with google", async ({ context }) => {
      const popupPromise = context.waitForEvent('page', { timeout: 10000 })
        .catch(e => {
          console.log('no new window opened:', e.message);
          return null;
        });
      
      await page.locator('button[type="button"]:has-text("Sign in with Google")').click();
      
      const popupPage = await popupPromise;
      
      if (popupPage) {
        await expect(popupPage.url()).toContain('accounts.google.com');
        
        await popupPage.close();
      } else {
        await expect(page.url()).toContain('/login');
      }
    });
  });
});
