import { expect, test } from "@playwright/test";

test.describe("CV Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByTestId("cv-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );
  });

  // ─── Load ──────────────────────────────────────────────────────────────────

  test("should load CV page successfully", async ({ page }) => {
    await expect(page.getByTestId("cv-page")).toBeVisible();
  });

  test("should display a title heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  test("should display all four tab triggers", async ({ page }) => {
    const tablist = page.getByRole("tablist");
    await expect(tablist).toBeVisible();

    await expect(page.getByRole("tab", { name: /experience/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /skills/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /projects/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /education/i })).toBeVisible();
  });

  test("should default to the Experience tab", async ({ page }) => {
    const experienceTab = page.getByRole("tab", { name: /experience/i });
    await expect(experienceTab).toHaveAttribute("aria-selected", "true");
  });

  test("should switch between tabs", async ({ page }) => {
    for (const name of [/skills/i, /projects/i, /education/i, /experience/i]) {
      const tab = page.getByRole("tab", { name });
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
    }
  });

  // ─── Tab content ───────────────────────────────────────────────────────────

  test("should show skills content when Skills tab is active", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: /skills/i }).click();
    // data-testid is set on each skill row in SkillsRadar / skills list
    await expect(page.locator('[data-testid^="skill-"]').first()).toBeVisible();
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  test("should have correct ARIA roles on tabs", async ({ page }) => {
    const experienceTab = page.getByRole("tab", { name: /experience/i });
    await expect(experienceTab).toHaveAttribute("role", "tab");

    // Active tabpanel is associated with its tab
    const tabpanel = page.getByRole("tabpanel").first();
    await expect(tabpanel).toBeVisible();
  });

  // ─── Mobile ────────────────────────────────────────────────────────────────

  test("should display tabs on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole("tab", { name: /experience/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /skills/i })).toBeVisible();
  });

  // ─── Errors ────────────────────────────────────────────────────────────────

  test("should load CV data without critical console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.waitForLoadState("load");
    await page.waitForTimeout(500);

    const critical = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("analytics") &&
        !e.includes("speed-insights") &&
        !e.includes("google") &&
        !e.includes("gtag"),
    );
    expect(critical).toHaveLength(0);
  });
});
