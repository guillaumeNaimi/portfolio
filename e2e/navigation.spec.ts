import { expect, test } from "@playwright/test";

// The home page uses its own HomeNav (no global nav links).
// The CV page uses the standard MainNavDesktop with Home / CV links
// and the data-testid'd theme / language switchers.

test.describe("Navigation", () => {
  // ─── Home → CV ─────────────────────────────────────────────────────────────

  test("should navigate to CV page via the hero CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );

    await page.getByTestId("hero-cv-link").click();
    await expect(page).toHaveURL(/\/cv/);
    await expect(page.getByTestId("cv-page")).toBeVisible();
  });

  // ─── CV → Home ─────────────────────────────────────────────────────────────

  test("should navigate back to home via the global nav", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByTestId("cv-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );

    // The global MainNavDesktop is visible on /cv
    const globalNav = page.getByRole("navigation").first();
    await expect(globalNav).toBeVisible();

    const homeLink = globalNav.getByRole("link", { name: /home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  // ─── Reload persistence ────────────────────────────────────────────────────

  test("should stay on CV page after reload", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByTestId("cv-page")).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/cv/);
    await expect(page.getByTestId("cv-page")).toBeVisible();
  });

  // ─── Theme switching (tested from /cv where global nav is visible) ─────────

  test("should switch theme from the CV page nav", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByTestId("cv-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );

    const themeButton = page.getByTestId("theme-switcher-desktop");
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

  // ─── Language switching (tested from /cv where global nav is visible) ──────

  test("should switch language from the CV page nav", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByTestId("cv-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );

    const langButton = page.getByTestId("local-switcher-desktop");
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
