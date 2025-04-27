const { test, expect } = require("@playwright/test");

// config for not using login state
// test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Authentication Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test.describe("Login Page UI Elements", () => {
    test("should display the Fakeflix logo", async ({ page }) => {
      await expect(page.locator("img.Auth__logo--img")).toBeVisible();
    });

    test("should display the login form title", async ({ page }) => {
      await expect(
        page.locator('h2.Auth__content--title:has-text("Sign In")')
      ).toBeVisible();
    });

    test("should show security warning message", async ({ page }) => {
      await expect(
        page.getByText(
          "Pay attention: this is not the original Netflix sign in. Don't insert your real credentials here!"
        )
      ).toBeVisible();
    });

    test.describe("Login Form Elements", () => {
      test("should display email and password input fields", async ({
        page,
      }) => {
        await expect(page.getByPlaceholder("E-mail")).toBeVisible();
        await expect(page.getByPlaceholder("Password")).toBeVisible();
      });

      test("should display primary sign in button", async ({ page }) => {
        await expect(
          page.locator("button.SignIn__form--button.button__submit")
        ).toBeVisible();
        await expect(
          page.locator('button[type="submit"]:has-text("Sign in")')
        ).toBeVisible();
      });

      test("should display Google sign in option", async ({ page }) => {
        await expect(
          page.locator("button.SignIn__form--button.button__google")
        ).toBeVisible();
        await expect(
          page.locator('button[type="button"]:has-text("Sign in with Google")')
        ).toBeVisible();
      });

      test("should display anonymous sign in option", async ({ page }) => {
        await expect(
          page.locator("button.SignIn__form--button.button__anonymous")
        ).toBeVisible();
        await expect(
          page.locator('button[type="button"]:has-text("Sign in anonymously")')
        ).toBeVisible();
      });
    });

    test("should display sign up prompt for new users", async ({ page }) => {
      await expect(
        page.locator('small:has-text("Haven\'t you registered yet?")')
      ).toBeVisible();
      await expect(
        page.locator('span.toggler:has-text("Sign up")')
      ).toBeVisible();
    });
  });

  test.describe("Sign Up Navigation", () => {
    test("should display sign up form when clicking the Sign up link", async ({
      page,
    }) => {
      await page.locator('span.toggler:has-text("Sign Up")').click();
      await page.waitForTimeout(3000);
      await expect(
        page.locator('h2.Auth__content--title:has-text("Sign Up")')
      ).toBeVisible();

      // Test Sign Up form elements after navigation
      await expect(
        page.locator('input[placeholder="Your name"]')
      ).toBeVisible();
      await expect(page.locator('input[placeholder="E-mail"]')).toBeVisible();
      await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
      await expect(
        page.locator('input[placeholder="Repeat your password"]')
      ).toBeVisible();

      // Test security warning
      await expect(
        page.getByText(
          "Pay attention: this is not the original Netflix sign up. Don't insert your real credentials here!"
        )
      ).toBeVisible();

      // Test sign up button
      await expect(
        page.locator("button.SignUp__form--button.button__submit")
      ).toBeVisible();
      await expect(
        page.locator('button[type="submit"]:has-text("Sign Up")')
      ).toBeVisible();

      // Test sign in link
      await expect(
        page.locator('small:has-text("Do you already have an account?")')
      ).toBeVisible();
      await expect(
        page.locator('span.toggler:has-text("Sign in")')
      ).toBeVisible();
    });

    test.describe("Sign Up and Sign In Navigation", () => {
      test("should navigate back to login form when clicking the Sign in link", async ({
        page,
      }) => {
        // First navigate to sign up form
        await page.locator('span.toggler:has-text("Sign Up")').click();
        await expect(
          page.locator('h2.Auth__content--title:has-text("Sign Up")')
        ).toBeVisible();

        // Then test navigation back to login
        await page.locator('span.toggler:has-text("Sign In")').click();
        await expect(
          page.locator('h2.Auth__content--title:has-text("Sign In")')
        ).toBeVisible();
      });
    });
  });
});
