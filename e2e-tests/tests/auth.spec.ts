import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173'; // Update this URL to match your frontend URL

test('should allow user to login', async ({ page }) => {
  await page.goto(`${UI_URL}`);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  // check if the sign in page is visible
  await expect(page.getByRole("heading", { name: "Sign In"})).toBeVisible();

  // fill the form
  await page.locator("[name=email]").fill("testuser@email.com");
  await page.locator("[name=password]").fill("password");

  // submit the form
  await page.getByRole("button", {name: "Log In"}).click();

  // check if the sign in was successful
  await expect(page.getByText("User signed in successfully")).toBeVisible();

  // check if the user is redirected to the home page
  await expect(page.getByRole("link", { name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels"})).toBeVisible();

  // Check that the sign out button is visible
  await expect(page.getByRole("button", { name: "Sign Out"})).toBeVisible();
});

// Need to delete created user after test
test('should allow user to register', async ({ page }) => {
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;

  await page.goto(`${UI_URL}`);

  await page.getByRole("link", { name: "Register" }).click();

  await expect(page.getByRole('heading', { name: "Create an Account"})).toBeVisible();

  // fill the form
  await page.locator("[name=firstName]").fill("firstNameTest");
  await page.locator("[name=lastName]").fill("lastNameTest");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("testPassword");
  await page.locator("[name=confirmPassword]").fill("testPassword");

  await page.getByRole("button", { name: "Create Account"}).click();

  // check if the sign in was successful
  await expect(page.getByText("User registered successfully")).toBeVisible();

  // check if the user is redirected to the home page
  await expect(page.getByRole("link", { name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels"})).toBeVisible();

  // Check that the sign out button is visible
  await expect(page.getByRole("button", { name: "Sign Out"})).toBeVisible();
})