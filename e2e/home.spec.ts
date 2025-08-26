import { expect, test } from '@playwright/test';

import { createTestHelpers } from './utils/test-helpers';

test.describe('Home Page - Basic', () => {
  test('should have a title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should load without errors', async ({ page }) => {
    const helpers = createTestHelpers(page);
    await helpers.navigateTo('/');

    const consoleErrors = await helpers.checkForConsoleErrors();
    expect(consoleErrors).toHaveLength(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    const helpers = createTestHelpers(page);
    await helpers.navigateTo('/');
    await helpers.checkMetaTags();
  });
});
