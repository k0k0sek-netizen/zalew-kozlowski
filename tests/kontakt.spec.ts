import { test, expect } from '@playwright/test';

test.describe('Contact and Booking Form', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the contact page
        await page.goto('http://localhost:3000/kontakt');
    });

    test('should load contact page with default reservation values', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/Kontakt | Zalew Kozłowski/);

        // Check if SMS preview container is visible
        const smsPreviewHeader = page.getByText('Podgląd wiadomości SMS');
        await expect(smsPreviewHeader).toBeVisible();

        // Default type is Zasiadka Karpiowa 🎣
        const karpBtn = page.getByRole('button', { name: 'Zasiadka Karpiowa 🎣' });
        await expect(karpBtn).toHaveAttribute('aria-pressed', 'true');

        // Default duration is Weekend (2 doby)
        const weekendBtn = page.getByRole('button', { name: 'Weekend (2 doby)' });
        await expect(weekendBtn).toHaveAttribute('aria-pressed', 'true');

        // Verify default SMS preview text
        const smsText = page.locator('div:has-text("Podgląd wiadomości SMS") > p.text-xs.italic');
        await expect(smsText).toContainText(/weekendową \(2 doby\) zasiadkę karpiową/);
    });

    test('should update SMS body when changing type and duration', async ({ page }) => {
        const smsText = page.locator('div:has-text("Podgląd wiadomości SMS") > p.text-xs.italic');
        const ogolneBtn = page.getByRole('button', { name: 'Wędkowanie Ogólne 🐟' });
        const dayBtn = page.getByRole('button', { name: '1 Doba' });

        // Switch to Wędkowanie Ogólne
        await ogolneBtn.click();
        await expect(ogolneBtn).toHaveAttribute('aria-pressed', 'true');

        // In ContactClient.tsx:
        // `Dzień dobry, chciałbym zarezerwować stanowisko na weekendowe wędkowanie ogólne na Zalewie Kozłowskim. Proszę o informację o dostępnych miejscach.`
        await expect(smsText).toContainText(/dwudniowe wędkowanie ogólne/);

        // Switch duration to 1 Doba
        await dayBtn.click();
        await expect(dayBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(smsText).toContainText(/jednodniowe/);
    });

    test('should show custom question field and update SMS when "Inne Pytanie" is selected', async ({ page }) => {
        const smsText = page.locator('div:has-text("Podgląd wiadomości SMS") > p.text-xs.italic');
        const pytanieBtn = page.getByRole('button', { name: 'Inne Pytanie 💬' });

        // Select Inne Pytanie
        await pytanieBtn.click();
        await expect(pytanieBtn).toHaveAttribute('aria-pressed', 'true');

        // Textarea should be visible
        const textarea = page.locator('textarea#custom-question');
        await expect(textarea).toBeVisible();

        // Duration buttons should be hidden (not present or not visible)
        const dayBtn = page.getByRole('button', { name: '1 Doba' });
        await expect(dayBtn).not.toBeVisible();

        // Fill textarea and verify SMS preview updates
        await textarea.fill('Czy można łowić w nocy z łodzi?');
        await expect(smsText).toContainText(/Czy można łowić w nocy z łodzi\?/);
    });
});
