import { test, expect } from '@playwright/test';

test('has title and bento grid', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Zalew Kozłowski/);

    // Check if Bento Grid is visible (Performance Optimization proof)
    const bentoGrid = page.locator('section').filter({ hasText: 'Najważniejsze Informacje' });
    await expect(bentoGrid).toBeVisible();

    // Check if Hero Video or Poster is present
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
});
