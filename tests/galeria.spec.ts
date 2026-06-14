import { test, expect } from '@playwright/test';

test.describe('Gallery Lightbox E2E and A11y', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the gallery page
        await page.goto('http://localhost:3000/galeria');
    });

    test('should open lightbox, navigate, and restore focus on close', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/Galeria | Zalew Kozłowski/);

        // Find the first thumbnail button
        const firstThumbnail = page.locator('button[aria-label^="Zdjęcie:"]').first();
        await expect(firstThumbnail).toBeVisible();

        // Click the first thumbnail to open the Lightbox
        await firstThumbnail.click();

        // Lightbox modal should be open with dialog attributes
        const lightbox = page.getByRole('dialog', { name: 'Podgląd zdjęcia' });
        await expect(lightbox).toBeVisible();
        await expect(lightbox).toHaveAttribute('aria-modal', 'true');

        // Close button should be automatically focused
        const closeBtn = page.getByRole('button', { name: 'Zamknij podgląd' });
        await expect(closeBtn).toBeFocused();

        // Get the current image src inside the lightbox
        const image = lightbox.locator('img').first();
        const initialSrc = await image.getAttribute('src');
        expect(initialSrc).not.toBeNull();

        // Press ArrowRight to go to the next image
        await page.keyboard.press('ArrowRight');

        // Verify image source changed
        await expect(image).not.toHaveAttribute('src', initialSrc!);

        // Press Escape to close the lightbox
        await page.keyboard.press('Escape');

        // Lightbox should be closed
        await expect(lightbox).not.toBeVisible();

        // Focus should be restored to the triggering thumbnail
        await expect(firstThumbnail).toBeFocused();
    });
});
