import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    // Wait for the main content to be visible
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display main navigation', async ({ page }) => {
    // Wait for navigation to be ready
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();

    // Wait for main navigation links to be visible
    await expect(navigation.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(navigation.getByRole('link', { name: /cv/i })).toBeVisible();
  });

  test('should navigate to CV page', async ({ page }) => {
    // Wait for navigation to be ready
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();

    // Wait for CV link to be visible and clickable
    const cvLink = navigation.getByRole('link', { name: /cv/i });
    await expect(cvLink).toBeVisible();
    await cvLink.click();

    // Wait for navigation to complete
    await expect(page).toHaveURL(/\/cv/);

    // Wait for CV page content to load
    await expect(page.getByTestId('cv-page')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    // Wait for navigation to be ready
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();

    // Go to CV page first
    const cvLink = navigation.getByRole('link', { name: /cv/i });
    await expect(cvLink).toBeVisible();
    await cvLink.click();
    await expect(page).toHaveURL(/\/cv/);

    // Wait for CV page to load
    await expect(page.getByTestId('cv-page')).toBeVisible();

    // Navigate back to home
    const homeLink = navigation.getByRole('link', { name: /home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    // Wait for navigation to complete
    await expect(page).toHaveURL(/\/$/);

    // Verify we're back on home page
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should have working mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for layout to adjust
    await page.waitForTimeout(500);

    // Wait for mobile navigation to be ready
    const mobileMenu = page.getByRole('navigation');
    await expect(mobileMenu).toBeVisible();

    // Check if mobile menu items are visible
    await expect(mobileMenu.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: /cv/i })).toBeVisible();
  });

  test('should maintain navigation state after page refresh', async ({
    page,
  }) => {
    // Wait for navigation to be ready
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();

    // Navigate to CV page
    const cvLink = navigation.getByRole('link', { name: /cv/i });
    await expect(cvLink).toBeVisible();
    await cvLink.click();
    await expect(page).toHaveURL(/\/cv/);

    // Wait for CV page to load
    await expect(page.getByTestId('cv-page')).toBeVisible();

    // Refresh the page
    await page.reload();

    // Wait for page to reload
    await page.waitForLoadState('networkidle');

    // Verify we're still on CV page
    await expect(page).toHaveURL(/\/cv/);
    await expect(page.getByTestId('cv-page')).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    // Wait for theme switcher to be ready
    const themeButton = page.getByTestId('theme-switcher-desktop');
    await expect(themeButton).toBeVisible();

    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme') ||
      document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
    );

    // Click theme toggle
    await themeButton.click();

    // Wait for dropdown to appear
    await page.waitForTimeout(300);

    const themeOption = page.getByTestId(
      `theme-option-${initialTheme === 'dark' ? 'light' : 'dark'}`
    );
    await expect(themeOption).toBeVisible();

    await themeOption.click();

    // Wait for theme change
    await page.waitForTimeout(500);

    // Check if theme changed
    const newTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme') ||
      document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
    );

    expect(newTheme).not.toBe(initialTheme);
  });

  test('should handle language switching', async ({ page }) => {
    // Wait for language switcher to be ready
    const languageButton = page.getByTestId('local-switcher-desktop');
    await expect(languageButton).toBeVisible();

    // Get initial language
    const initialLang = await page.evaluate(
      () => document.documentElement.getAttribute('lang') || 'en'
    );

    // Click to open dropdown
    await languageButton.click();

    // Wait for dropdown to appear
    await page.waitForTimeout(300);

    // Select the other language (if current is 'en', select 'fr', vice versa)
    const targetLang = initialLang === 'en' ? 'fr' : 'en';
    const languageOption = page.getByTestId(`language-option-${targetLang}`);

    await expect(languageOption).toBeVisible();
    await languageOption.click();

    // Wait for language change
    await page.waitForTimeout(1000);

    // Check if language changed
    const newLang = await page.evaluate(
      () => document.documentElement.getAttribute('lang') || 'en'
    );

    expect(newLang).toBe(targetLang);
  });
});
