import { test, expect } from '@playwright/test';

test.describe('Pricing Page Calculator', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the pricing page
        await page.goto('http://localhost:3000/cennik');
    });

    test('should load pricing page with default calculator values', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/Cennik | Zalew Kozłowski/);

        // Check if calculator header is visible
        const header = page.getByText('Interaktywny Kalkulator Zasiadki');
        await expect(header).toBeVisible();

        // Default method is Grunt / Spławik
        const gruntBtn = page.getByRole('button', { name: 'Grunt / Spławik' });
        await expect(gruntBtn).toHaveAttribute('aria-pressed', 'true');

        // Default rods is 2
        const rods2Btn = page.getByRole('button', { name: '2 Wędki' });
        await expect(rods2Btn).toHaveAttribute('aria-pressed', 'true');

        // Default duration is 1 day, price is 20 zł
        const priceDisplay = page.locator('div.text-4xl.font-black');
        await expect(priceDisplay).toHaveText(/20\s*zł/);
    });

    test('should update price when changing method and rods', async ({ page }) => {
        const priceDisplay = page.locator('div.text-4xl.font-black');
        const gruntBtn = page.getByRole('button', { name: 'Grunt / Spławik' });
        const spinningBtn = page.getByRole('button', { name: 'Spinning' });
        const rods1Btn = page.getByRole('button', { name: '1 Wędka' });
        const rods2Btn = page.getByRole('button', { name: '2 Wędki' });

        // Switch to 1 rod
        await rods1Btn.click();
        await expect(rods1Btn).toHaveAttribute('aria-pressed', 'true');
        await expect(priceDisplay).toHaveText(/15\s*zł/);

        // Switch to spinning
        await spinningBtn.click();
        await expect(spinningBtn).toHaveAttribute('aria-pressed', 'true');
        
        // Spinning forces 1 rod and disables rods selector
        await expect(priceDisplay).toHaveText(/15\s*zł/);

        // Verify rods button is disabled/frozen (disabled attribute is present)
        await expect(rods1Btn).toBeDisabled();
        await expect(rods2Btn).toBeDisabled();

        // Switch back to Grunt / Spławik
        await gruntBtn.click();
        await expect(gruntBtn).toHaveAttribute('aria-pressed', 'true');
        // Rods should be enabled again and return to its active state
        await expect(rods1Btn).not.toBeDisabled();
    });

    test('should update price when changing duration slider', async ({ page }) => {
        const priceDisplay = page.locator('div.text-4xl.font-black');
        const slider = page.locator('#zasiadka-duration-slider');

        // Move slider to 3 days (1 day = 20zł for 2 rods, 3 days = 60zł)
        await slider.evaluate((node: HTMLInputElement, val) => {
            const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(node), 'value')?.set;
            valueSetter?.call(node, val);
            node.dispatchEvent(new Event('input', { bubbles: true }));
        }, '3');

        await expect(priceDisplay).toHaveText(/60\s*zł/);

        // Move slider to 5 days (5 days = 100zł)
        await slider.evaluate((node: HTMLInputElement, val) => {
            const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(node), 'value')?.set;
            valueSetter?.call(node, val);
            node.dispatchEvent(new Event('input', { bubbles: true }));
        }, '5');

        await expect(priceDisplay).toHaveText(/100\s*zł/);
    });
});
