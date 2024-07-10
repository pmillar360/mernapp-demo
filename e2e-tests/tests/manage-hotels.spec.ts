import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173'; // Update this URL to match your frontend URL

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

test("should allow user to add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}/add-hotel`);

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("Test Description");
    await page.locator('[name="pricePerNight"]').fill("100");

    await page.selectOption('select[name="starRating"]', "3"); // May be another way to select the option

    await page.getByText("Hostel").click();
    await page.getByLabel("Wi-Fi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("3");

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "jwst-deep-field.png")
    ]);

    await page.getByRole("button", { name: "Save" } ).click();

    await expect(page.getByText("Hotel added successfully")).toBeVisible();
});

test("should allow user to view their hotels", async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await expect(page.getByText("My Hotels")).toBeVisible();
    await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();

    await expect(page.getByText("Test Hotel").first()).toBeVisible();
    await expect(page.getByText("Test Description").first()).toBeVisible();
    await expect(page.getByText("Test City, Test Country").first()).toBeVisible();
    await expect(page.getByText("Hostel").first()).toBeVisible();
    await expect(page.getByText("$100 / night").first()).toBeVisible();
    await expect(page.getByText("2 adults, 3 children").first()).toBeVisible();
    await expect(page.getByText("3 stars").first()).toBeVisible();

    // check for button to be present
    await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible();
});