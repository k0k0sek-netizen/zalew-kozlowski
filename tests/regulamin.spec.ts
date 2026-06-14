import { test, expect } from '@playwright/test';

test.describe('Regulations Tabs (WAI-ARIA Tablist Pattern)', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the regulamin page
        await page.goto('http://localhost:3000/regulamin');
    });

    test('should render tablist with tabs and switch panels correctly', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/Regulamin | Zalew Kozłowski/);

        // Check if tablist exists
        const tablist = page.getByRole('tablist', { name: 'Wybór kategorii regulaminu' });
        await expect(tablist).toBeVisible();

        // Get the individual tabs
        const generalTab = page.getByRole('tab', { name: 'Zasady Ogólne' });
        const safetyTab = page.getByRole('tab', { name: 'Bezpieczeństwo' });
        const contactTab = page.getByRole('tab', { name: 'Pomoc & Rezerwacje' });

        // Initial state: General Rules should be selected
        await expect(generalTab).toHaveAttribute('aria-selected', 'true');
        await expect(safetyTab).toHaveAttribute('aria-selected', 'false');
        await expect(contactTab).toHaveAttribute('aria-selected', 'false');

        // Check initial tab panel
        const generalPanel = page.locator('#panel-general');
        await expect(generalPanel).toBeVisible();
        await expect(generalPanel).toHaveAttribute('role', 'tabpanel');
        await expect(generalPanel).toHaveAttribute('aria-labelledby', 'tab-general');
        await expect(generalPanel).toHaveAttribute('tabindex', '0');

        // Click on Safety Rules
        await safetyTab.click();

        // Safety Rules should now be selected, General unselected
        await expect(generalTab).toHaveAttribute('aria-selected', 'false');
        await expect(safetyTab).toHaveAttribute('aria-selected', 'true');

        // General panel should be hidden, safety panel visible
        const safetyPanel = page.locator('#panel-safety');
        await expect(generalPanel).not.toBeVisible();
        await expect(safetyPanel).toBeVisible();
        await expect(safetyPanel).toHaveAttribute('role', 'tabpanel');
        await expect(safetyPanel).toHaveAttribute('aria-labelledby', 'tab-safety');
        await expect(safetyPanel).toHaveAttribute('tabindex', '0');
    });
});
