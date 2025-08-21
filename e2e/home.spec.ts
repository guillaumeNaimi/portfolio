import test, { expect } from '@playwright/test';

test.describe('Home', () => {
  test('should have a title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Hello' })).toBeVisible();
  });
});
