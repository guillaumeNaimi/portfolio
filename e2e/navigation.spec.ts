import { expect, test } from "@playwright/test";

// The /cv route no longer exists — all CV content lives in the one-pager home.
// Navigation tests operate exclusively from the home page and its HomeNav.

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );
  });

  // ─── HomeNav ───────────────────────────────────────────────────────────────

  test("should display the home nav with brand and controls", async ({
    page,
  }) => {
    const homeNav = page.locator("[data-home-nav]");
    await expect(homeNav).toBeVisible();

    // Brand button
    const brand = homeNav.getByRole("button").first();
    await expect(brand).toBeVisible();

    // Theme + language switchers
    await expect(page.getByTestId("theme-switcher-home")).toBeVisible();
    await expect(page.getByTestId("local-switcher-home")).toBeVisible();
  });

  // ─── Reload persistence ────────────────────────────────────────────────────

  test("should stay on home after reload", async ({ page }) => {
    await page.reload();
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  // ─── Theme switching ───────────────────────────────────────────────────────

  test("should switch theme via the home nav", async ({ page }) => {
    const themeButton = page.getByTestId("theme-switcher-home");
    await expect(themeButton).toBeVisible();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );

    await themeButton.click();
    await page.waitForTimeout(200);

    const targetOption = page.getByTestId(
      `theme-option-${isDark ? "light" : "dark"}`,
    );
    await expect(targetOption).toBeVisible();
    await targetOption.click();
    await page.waitForTimeout(300);

    const isNowDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isNowDark).toBe(!isDark);
  });

  // ─── Language switching ────────────────────────────────────────────────────

  test("should switch language via the home nav", async ({ page }) => {
    const langButton = page.getByTestId("local-switcher-home");
    await expect(langButton).toBeVisible();

    const initialLang =
      (await page.evaluate(() =>
        document.documentElement.getAttribute("lang"),
      )) ?? "en";

    await langButton.click();
    await page.waitForTimeout(200);

    const targetLang = initialLang === "en" ? "fr" : "en";
    const langOption = page.getByTestId(`language-option-${targetLang}`);
    await expect(langOption).toBeVisible();
    await langOption.click();
    await page.waitForTimeout(500);

    const newLang =
      (await page.evaluate(() =>
        document.documentElement.getAttribute("lang"),
      )) ?? "en";
    expect(newLang).toBe(targetLang);
  });
});
