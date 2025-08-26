import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check meta description
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Guillaume Naimi/
    );

    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /Guillaume Naimi/
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website'
    );
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('navigation')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('navigation')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should have working links', async ({ page }) => {
    // Check if CV link in hero section works
    const cvLink = page.getByTestId('hero-cv-link');
    await expect(cvLink).toBeVisible();
    await expect(cvLink).toHaveAttribute('href', /cv/);

    // Check if contact link works
    const contactLink = page.getByTestId('hero-contact-link');
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute(
      'href',
      'mailto:naimi.guillaume@gmail.com'
    );

    // Check if GitHub link works
    const githubLink = page.getByTestId('github-link');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/guillaumeNaimi'
    );

    // Check if LinkedIn link works
    const linkedinLink = page.getByTestId('linkedin-link');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/guillaume-naimi-b60737105/'
    );
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();

    // Wait a bit for any potential errors
    await page.waitForTimeout(2000);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should have proper accessibility structure', async ({ page }) => {
    // Check for navigation landmark
    await expect(page.getByRole('navigation')).toBeVisible();

    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
  });
});
