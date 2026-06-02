import { expect, test } from "@playwright/test";

test.describe("Home Page (one-pager)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for client-side hydration
    await expect(page.getByTestId("home-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );
  });

  // ─── Layout ────────────────────────────────────────────────────────────────

  test("should render without errors", async ({ page }) => {
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  // ─── HomeNav ───────────────────────────────────────────────────────────────

  test("should display the home nav", async ({ page }) => {
    const homeNav = page.locator("[data-home-nav]");
    await expect(homeNav).toBeVisible();
  });

  test("should display anchor links in home nav on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const nav = page.locator("[data-home-nav] nav");
    await expect(nav).toBeVisible();
    // At least Skills and Experience anchors should be present
    await expect(nav.getByRole("button").first()).toBeVisible();
  });

  test("should scroll to top when brand button is clicked", async ({
    page,
  }) => {
    // Brand is the first button inside the home nav header
    const brand = page.locator("[data-home-nav] button").first();
    await expect(brand).toBeVisible();
    await brand.click();
    // Page should remain on / with no navigation error
    await expect(page).toHaveURL("/");
  });

  // ─── Hero section ──────────────────────────────────────────────────────────

  test("should display the hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should display the contact CTA with correct href", async ({ page }) => {
    const contactLink = page.getByTestId("hero-contact-link");
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute(
      "href",
      "mailto:naimi.guillaume@gmail.com",
    );
  });

  test("should display the CV link in hero", async ({ page }) => {
    const cvLink = page.getByTestId("hero-cv-link");
    await expect(cvLink).toBeVisible();
    await expect(cvLink).toHaveAttribute("href", /\/cv/);
  });

  // ─── Sections ──────────────────────────────────────────────────────────────

  test("should have all one-pager section anchors in DOM", async ({ page }) => {
    for (const id of ["skills", "stack", "experience", "projects", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  // ─── Meta ──────────────────────────────────────────────────────────────────

  test("should have Guillaume Naimi in meta tags", async ({ page }) => {
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Guillaume Naimi/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Guillaume Naimi/,
    );
  });

  // ─── Errors ────────────────────────────────────────────────────────────────

  test("should load without critical console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.reload();
    await expect(page.getByTestId("home-page")).toHaveAttribute(
      "data-hydrated",
      "true",
    );

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
