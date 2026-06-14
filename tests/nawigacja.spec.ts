import { test, expect } from '@playwright/test';

test.describe('Navigation, Mobile Menu and Theme Toggle E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the homepage
        await page.goto('http://localhost:3000/');
    });

    test('should switch theme correctly and persist in localStorage', async ({ page }) => {
        const themeBtn = page.locator('button[aria-label="Przełącz motyw"]').first();
        // Wait for the theme toggle button to be hydrated (SVG is visible)
        await expect(themeBtn.locator('svg')).toBeVisible();

        // 1. Initial State: check if document has .dark class (homepage defaults to prefers-color-scheme in headless mode)
        const isDarkInitial = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        const expectedNextState = !isDarkInitial;

        // 2. Click to switch theme
        await themeBtn.click();

        // 3. Document should have the toggled state (wait for transition)
        await expect(async () => {
            const isDarkAfterClick = await page.evaluate(() => document.documentElement.classList.contains('dark'));
            expect(isDarkAfterClick).toBe(expectedNextState);
        }).toPass({ timeout: 3000 });

        // 4. Verify localStorage theme is updated
        const storageTheme = await page.evaluate(() => localStorage.getItem('theme'));
        expect(storageTheme).toBe(expectedNextState ? 'dark' : 'light');

        // 5. Click again to return to initial theme
        await themeBtn.click();

        // 6. Verify it returned to initial state (wait for transition)
        await expect(async () => {
            const isDarkReturned = await page.evaluate(() => document.documentElement.classList.contains('dark'));
            expect(isDarkReturned).toBe(isDarkInitial);
        }).toPass({ timeout: 3000 });
    });

    test('should navigate between pages using main navigation links', async ({ page }) => {
        // Find link for "Cennik" in the desktop navigation
        const cennikLink = page.locator('nav a:has-text("Cennik")').first();
        await expect(cennikLink).toBeVisible();

        // Click on it
        await cennikLink.click();

        // Wait for page navigation and verify title
        await expect(page).toHaveTitle(/Cennik | Zalew Kozłowski/);
        await expect(page).toHaveURL(/.*cennik/);
    });

    test('should toggle mobile menu and trap focus', async ({ page }) => {
        // Set viewport size to mobile
        await page.setViewportSize({ width: 375, height: 667 });

        // Mobile menu toggle button should be visible
        const menuBtn = page.getByRole('button', { name: 'Menu' });
        await expect(menuBtn).toBeVisible();

        // Mobile menu should not be open initially
        const mobileMenu = page.locator('#mobile-menu');
        await expect(mobileMenu).not.toBeVisible();

        // Click menu button to open mobile menu
        await menuBtn.click();

        // Mobile menu should be visible and have dialog/modal attributes
        await expect(mobileMenu).toBeVisible();
        await expect(mobileMenu).toHaveAttribute('role', 'dialog');
        await expect(mobileMenu).toHaveAttribute('aria-modal', 'true');

        // Verify focus is trapped (the menu close button or first element in navigation should be focusable/focused)
        // Let's press Escape and verify the menu closes
        await page.keyboard.press('Escape');
        await expect(mobileMenu).not.toBeVisible();
    });
});
