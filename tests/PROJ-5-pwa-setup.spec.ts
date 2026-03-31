import { test, expect } from "@playwright/test";

test.describe("PROJ-5: PWA-Setup", () => {
  // AC-1: Web App Manifest with correct fields
  test("AC-1: Manifest is linked and has required fields", async ({ page }) => {
    await page.goto("/login");

    // Check manifest link exists
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", "/manifest.json");

    // Fetch and verify manifest content
    const response = await page.goto("/manifest.json");
    expect(response?.status()).toBe(200);
    const manifest = await response?.json();

    expect(manifest.name).toBe("Stundenplan");
    expect(manifest.short_name).toBe("Stundenplan");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#EB574C");
    expect(manifest.background_color).toBe("#ffffff");
    expect(manifest.start_url).toBe("/dashboard");
  });

  // AC-4: Custom app icons in multiple sizes
  test("AC-4: App icons exist in required sizes", async ({ page }) => {
    // Check 192x192 icon
    const res192 = await page.goto("/icons/icon-192x192.png");
    expect(res192?.status()).toBe(200);
    expect(res192?.headers()["content-type"]).toContain("image/png");

    // Check 512x512 icon
    const res512 = await page.goto("/icons/icon-512x512.png");
    expect(res512?.status()).toBe(200);
    expect(res512?.headers()["content-type"]).toContain("image/png");

    // Check manifest references both
    const manifestRes = await page.goto("/manifest.json");
    const manifest = await manifestRes?.json();
    const iconSizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(iconSizes).toContain("192x192");
    expect(iconSizes).toContain("512x512");
  });

  // AC-6: display: standalone
  test("AC-6: Manifest uses display standalone", async ({ page }) => {
    const response = await page.goto("/manifest.json");
    const manifest = await response?.json();
    expect(manifest.display).toBe("standalone");
  });

  // AC-8: Meta tags for iOS compatibility
  test("AC-8: iOS meta tags present", async ({ page }) => {
    await page.goto("/login");

    // mobile-web-app-capable (Next.js renders this instead of apple-mobile-web-app-capable)
    const capable = page.locator('meta[name="mobile-web-app-capable"]');
    await expect(capable).toHaveAttribute("content", "yes");

    // apple-mobile-web-app-status-bar-style
    const statusBar = page.locator(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    await expect(statusBar).toHaveAttribute("content", "default");

    // apple-mobile-web-app-title
    const title = page.locator('meta[name="apple-mobile-web-app-title"]');
    await expect(title).toHaveAttribute("content", "Stundenplan");

    // apple-touch-icon
    const touchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(touchIcon).toBeAttached();
  });

  // AC-9: Viewport configured for mobile
  test("AC-9: Viewport meta tag configured", async ({ page }) => {
    await page.goto("/login");

    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute("content");
    expect(content).toContain("width=device-width");
    expect(content).toContain("initial-scale=1");
  });

  // AC-5 + EC-1: Offline page exists and is accessible
  test("EC-1: Offline page renders correctly", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByText(/du bist offline/i)).toBeVisible();
    await expect(page.getByText(/internetverbindung/i)).toBeVisible();
  });

  // Theme color meta tag
  test("Theme color meta tag is set", async ({ page }) => {
    await page.goto("/login");
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute("content", "#EB574C");
  });

  // Language attribute
  test("HTML lang attribute is set to de", async ({ page }) => {
    await page.goto("/login");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("de");
  });
});
