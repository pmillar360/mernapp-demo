import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

test.beforeEach(async ({ page }) => {
    // Sign in before each test
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
});

test("should show hotel search results", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Destination").fill("Test City");

    await page.getByRole("button", { name: "Search" }).click();

    await expect(page.getByText("Hotel(s) found in Test City")).toBeVisible();
    await expect(page.getByText("Updated Test Hotel")).toBeVisible();
})

test("should show hotel details", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Destination").fill("Test City");

    await page.getByRole("button", { name: "Search" }).click();
    
    await page.getByText("Updated Test Hotel").click();

    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
});