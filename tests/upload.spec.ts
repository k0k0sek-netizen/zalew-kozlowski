import { test, expect } from '@playwright/test';

test.describe('Gallery Upload Form Client-Side Validation', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the gallery page where the form is located
        await page.goto('http://localhost:3000/galeria');
    });

    test('should validate file type constraints', async ({ page }) => {
        const fileInput = page.locator('input#file-upload');
        const errorAlert = page.locator('#upload-error');

        // Select an invalid file type (e.g. text file)
        await fileInput.setInputFiles({
            name: 'test-document.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('dummy text content'),
        });

        // Error message should appear instantly due to client-side handleFileChange validation
        await expect(errorAlert).toBeVisible();
        await expect(errorAlert).toContainText(/Dozwolone są wyłącznie pliki/);
    });

    test('should validate file size constraints', async ({ page }) => {
        const fileInput = page.locator('input#file-upload');
        const errorAlert = page.locator('#upload-error');

        // Select a file that is too large (6MB)
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
        await fileInput.setInputFiles({
            name: 'large-fish.jpg',
            mimeType: 'image/jpeg',
            buffer: largeBuffer,
        });

        // Error message should appear instantly due to size validation
        await expect(errorAlert).toBeVisible();
        await expect(errorAlert).toContainText(/Plik jest za duży/);
    });

    test('should show file name when a valid file is selected', async ({ page }) => {
        const fileInput = page.locator('input#file-upload');
        const dropzoneText = page.locator('.peer-hover\\:border-sunset-orange >> text=Kliknij lub upuść zdjęcie tutaj');

        // Select a valid file
        await fileInput.setInputFiles({
            name: 'carp-catch.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('fake image data'),
        });

        // Dropzone should update to display the file name
        const fileNameText = page.getByText('carp-catch.jpg');
        await expect(fileNameText).toBeVisible();
        await expect(dropzoneText).not.toBeVisible();
    });

    test('should trigger honeypot and return decoy success when hidden field is filled', async ({ page }) => {
        const fileInput = page.locator('input#file-upload');
        const titleInput = page.locator('input#title');
        const authorInput = page.locator('input#author');
        const honeypotInput = page.locator('input[name="website"]');
        const submitBtn = page.getByRole('button', { name: 'Wyślij do Galerii' });

        // 1. Fill valid data
        await fileInput.setInputFiles({
            name: 'honeypot-test.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('fake image data'),
        });
        await titleInput.fill('Oszukany Karp');
        await authorInput.fill('Bot');

        // 2. Fill the honeypot input (simulating bot behavior, using evaluate because element is hidden)
        await honeypotInput.evaluate((el: HTMLInputElement) => el.value = 'http://spam-bot.com');

        // 3. Submit
        await submitBtn.click();

        // 4. Verify decoy success message is displayed (client-side transitions to success page)
        const successTitle = page.getByText('Dzięki za zdjęcie!');
        await expect(successTitle).toBeVisible();
    });
});
