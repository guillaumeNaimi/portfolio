import { expect, test } from '@playwright/test';

test.describe('CV Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cv');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    // Wait for the CV page component to be visible
    await expect(page.getByTestId('cv-page')).toBeVisible();
  });

  test('should load CV page successfully', async ({ page }) => {
    await expect(page.getByTestId('cv-page')).toBeVisible();
  });

  test('should display all CV sections', async ({ page }) => {
    // Wait for tab navigation to be ready
    const tabsList = page.getByRole('tablist');
    await expect(tabsList).toBeVisible();

    // Wait for all tab buttons to be visible
    await expect(page.getByRole('tab', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /skills/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /education/i })).toBeVisible();
  });

  test('should switch between CV tabs', async ({ page }) => {
    // Wait for tabs to be ready
    await expect(page.getByRole('tablist')).toBeVisible();

    // Start on experience tab (default) - wait for it to be selected
    const experienceTab = page.getByRole('tab', { name: /experience/i });
    await expect(experienceTab).toBeVisible();
    await expect(experienceTab).toHaveAttribute('aria-selected', 'true');

    // Switch to skills tab
    const skillsTab = page.getByRole('tab', { name: /skills/i });
    await expect(skillsTab).toBeVisible();
    await skillsTab.click();
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true');

    // Switch to projects tab
    const projectsTab = page.getByRole('tab', { name: /projects/i });
    await expect(projectsTab).toBeVisible();
    await projectsTab.click();
    await expect(projectsTab).toHaveAttribute('aria-selected', 'true');

    // Switch to education tab
    const educationTab = page.getByRole('tab', { name: /education/i });
    await expect(educationTab).toBeVisible();
    await educationTab.click();
    await expect(educationTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should display experience content', async ({ page }) => {
    // Ensure we're on experience tab
    const experienceTab = page.getByRole('tab', { name: /experience/i });
    await expect(experienceTab).toBeVisible();
    await experienceTab.click();
    await expect(experienceTab).toHaveAttribute('aria-selected', 'true');

    // Wait for experience content to load
    const experienceContent = page.getByRole('tabpanel', {
      name: /experience/i,
    });
    await expect(experienceContent).toBeVisible();

    // Check for at least one experience item with a more specific selector
    const experienceItems = page.locator('[data-testid*="experience"]');
    await expect(experienceItems.first()).toBeVisible();
  });

  test('should display skills content', async ({ page }) => {
    // Switch to skills tab
    const skillsTab = page.getByRole('tab', { name: /skills/i });
    await expect(skillsTab).toBeVisible();
    await skillsTab.click();
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true');

    // Wait for skills content to load
    const skillsContent = page.getByRole('tabpanel', { name: /skills/i });
    await expect(skillsContent).toBeVisible();

    // Check for skills visualization or list
    const skillsItems = page.locator('[data-testid*="skill"]');
    await expect(skillsItems.first()).toBeVisible();
  });

  test('should display projects content', async ({ page }) => {
    // Switch to projects tab
    const projectsTab = page.getByRole('tab', { name: /projects/i });
    await expect(projectsTab).toBeVisible();
    await projectsTab.click();
    await expect(projectsTab).toHaveAttribute('aria-selected', 'true');

    // Wait for projects content to load
    const projectsContent = page.getByRole('tabpanel', { name: /projects/i });
    await expect(projectsContent).toBeVisible();

    // Check for at least one project
    const projectItems = page.locator('[data-testid*="project"]');
    await expect(projectItems.first()).toBeVisible();
  });

  test('should display education content', async ({ page }) => {
    // Switch to education tab
    const educationTab = page.getByRole('tab', { name: /education/i });
    await expect(educationTab).toBeVisible();
    await educationTab.click();
    await expect(educationTab).toHaveAttribute('aria-selected', 'true');

    // Wait for education content to load
    const educationContent = page.getByRole('tabpanel', { name: /education/i });
    await expect(educationContent).toBeVisible();

    // Check for at least one education item
    const educationItems = page.locator('[data-testid*="education"]');
    await expect(educationItems.first()).toBeVisible();
  });

  test('should handle mobile CV navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for layout to adjust
    await page.waitForTimeout(500);

    // Check if tabs are still accessible
    await expect(page.getByRole('tab', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /skills/i })).toBeVisible();

    // Test tab switching on mobile
    const skillsTab = page.getByRole('tab', { name: /skills/i });
    await expect(skillsTab).toBeVisible();
    await skillsTab.click();
    await expect(skillsTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should have proper accessibility for tabs', async ({ page }) => {
    // Wait for tablist to be ready
    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();

    // Check each tab has proper attributes
    const experienceTab = page.getByRole('tab', { name: /experience/i });
    await expect(experienceTab).toBeVisible();
    await expect(experienceTab).toHaveAttribute('role', 'tab');

    // Check tabpanel is associated with active tab
    const tabpanel = page.getByRole('tabpanel', { name: /experience/i });
    await expect(tabpanel).toBeVisible();
  });

  test('should load CV data without errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for content to load and stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for API errors or data loading issues
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('analytics') &&
        !error.includes('speed-insights') &&
        !error.includes('google') &&
        !error.includes('gtag')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
