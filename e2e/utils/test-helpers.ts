import { expect, Page } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to a page and wait for it to load
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Check for console errors (excluding known non-critical errors)
   */
  async checkForConsoleErrors() {
    const consoleErrors: string[] = [];

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        // Filter out known non-critical errors
        if (
          !errorText.includes('favicon') &&
          !errorText.includes('analytics') &&
          !errorText.includes('speed-insights') &&
          !errorText.includes('google') &&
          !errorText.includes('gtag')
        ) {
          consoleErrors.push(errorText);
        }
      }
    });

    return consoleErrors;
  }

  /**
   * Check for proper meta tags
   */
  async checkMetaTags() {
    // Check meta description
    await expect(this.page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Guillaume Naimi/
    );

    // Check Open Graph tags
    await expect(
      this.page.locator('meta[property="og:title"]')
    ).toHaveAttribute('content', /Guillaume Naimi/);
    await expect(this.page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website'
    );
  }
}

/**
 * Create a test helper instance
 */
export function createTestHelpers(page: Page): TestHelpers {
  return new TestHelpers(page);
}
