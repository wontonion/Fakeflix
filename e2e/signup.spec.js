const { test, expect } = require("@playwright/test");

// config for not using login state
// test.use({ storageState: { cookies: [], origins: [] } });
/** @type {import('@playwright/test').Page} */
let page;

test.describe("Sign Up component Tests", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // go to sign in page and then click on sign up button
    await page.goto("/login");
    await page.locator('span.toggler:has-text("Sign Up")').click();
    await page.waitForTimeout(3000);
  });
  
  test.describe("input fields should have correct type", () => {
    test("name input field should have type text", async () => {
      await expect(
        page.getByPlaceholder("Your name")
      ).toHaveAttribute("type", "text");
    });
    test("email input field should have type email", async () => {
      await expect(
        page.getByPlaceholder("E-mail")
      ).toHaveAttribute("type", "email");
    });
    test("password input field should have type password", async () => {
      await expect(
        page.getByPlaceholder("Password").first()
      ).toHaveAttribute("type", "password");
    });
    test("repeat password input field should have type password", async () => {
      await expect(
        page.getByPlaceholder("Repeat your password")
      ).toHaveAttribute("type", "password");
    });
  });

  test.describe("unexpected error message in sign up form", () => {
      test("should show error message for empty input", async () => {
      await page.locator('button[type="submit"]:has-text("Sign Up")').click();

      await expect(
        page.locator('p.InputField__label:has-text("Please enter your name.")')
      ).toBeVisible();
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
      await expect(
        page.locator('p.InputField__label:has-text("Passwords should match")')
      ).toBeVisible();
    });
  });

  test.describe("check validation of each input fields", () => {
    test.describe("name input field", () => {
      test("name should be at least 2 characters", async () => {
        await page.locator('input[name="displayName"]').fill("a");
        await page.locator('button[type="submit"]:has-text("Sign Up")').click();

        await expect(
          page.locator(
            'p.InputField__label:has-text("Please enter your name.")'
          )
        ).toBeVisible();
      });
      test("name should be less than 60 characters", async () => {
        await page.locator('input[name="displayName"]').fill("a".repeat(61));
        await page.locator('button[type="submit"]:has-text("Sign Up")').click();

        await expect(
          page.locator(
            'p.InputField__label:has-text("Please enter your name.")'
          )
        ).toBeVisible();
      });
    });

    test.describe("email input field", () => {
      test("should show error message for invalid email format", async () => {
        await page.locator('input[name="email"]').fill("invalid-email");
        await page.locator('button[type="submit"]:has-text("Sign Up")').click();

        await expect(
          page.locator(
            'p.InputField__label:has-text("Please enter a valid email address.")'
          )
        ).toBeVisible();
      });
    });

    test.describe("password input field", () => {
      test("password should be at least 6 characters", async () => {
        await page.locator('input[name="password"]').fill("pass");
        await page.locator('button[type="submit"]:has-text("Sign Up")').click();

        await expect(
          page.locator(
            'p.InputField__label:has-text("The password should have a length between 6 and 30 characters.")'
          )
        ).toBeVisible();
      });

      test("password should be less than 30 characters", async () => {
        await page.locator('input[name="password"]').fill("a".repeat(31));
        await page.locator('button[type="submit"]:has-text("Sign Up")').click();
        await expect(
          page.locator(
            'p.InputField__label:has-text("The password should have a length between 6 and 30 characters.")'
          )
        ).toBeVisible();
      });
    });

    test.describe("repeat password input field", () => {
      test("should show error message for mismatched passwords", async () => {
        await page.locator('input[name="password"]').fill("password123");
        await page.locator('input[name="check_password"]').fill("password456");
        await page.locator('button[type="submit"]:has-text("Sign Up")').click();

        await expect(
          page.locator('p.InputField__label:has-text("Passwords should match")')
        ).toBeVisible();
      });
    });
  });
});
