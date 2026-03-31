import { test, expect } from "@playwright/test";

// Test accounts created in Supabase
const ADMIN = { email: "test@admin.de", password: "admin1234" };
const TEILNEHMER = { email: "test@teilnehmer.de", password: "test1234" };

test.describe("PROJ-1: User Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start logged out
    await page.goto("/login");
  });

  // AC-1: Login page with email and password fields
  test("AC-1: Login page shows email and password fields", async ({
    page,
  }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /anmelden/i })).toBeVisible();
  });

  // AC-2: Successful login redirects Teilnehmer to dashboard
  test("AC-2: Teilnehmer login redirects to /dashboard", async ({ page }) => {
    await page.fill('input[type="email"]', TEILNEHMER.email);
    await page.fill('input[type="password"]', TEILNEHMER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // AC-3: Successful login redirects Admin to admin dashboard
  test("AC-3: Admin login redirects to /admin", async ({ page }) => {
    await page.fill('input[type="email"]', ADMIN.email);
    await page.fill('input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin/);
  });

  // AC-4: Invalid credentials show error message
  test("AC-4: Invalid credentials show error message", async ({ page }) => {
    await page.fill('input[type="email"]', "wrong@email.de");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(
      page.getByText(/ungültige anmeldedaten/i)
    ).toBeVisible({ timeout: 5000 });
  });

  // AC-5: Logout button is accessible on authenticated pages
  test("AC-5: Logout button visible on dashboard", async ({ page }) => {
    // Login as Teilnehmer
    await page.fill('input[type="email"]', TEILNEHMER.email);
    await page.fill('input[type="password"]', TEILNEHMER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page.getByRole("button", { name: /abmelden/i })).toBeVisible();
  });

  // AC-6: Logout clears session and redirects to login
  test("AC-6: Logout redirects to /login", async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', TEILNEHMER.email);
    await page.fill('input[type="password"]', TEILNEHMER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Logout
    await page.getByRole("button", { name: /abmelden/i }).click();
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  // AC-7: Unauthenticated users are redirected to login
  test("AC-7: Unauthenticated access to /dashboard redirects to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  // AC-8: Admin role checked for admin routes
  test("AC-8: Teilnehmer cannot access /admin", async ({ page }) => {
    // Login as Teilnehmer
    await page.fill('input[type="email"]', TEILNEHMER.email);
    await page.fill('input[type="password"]', TEILNEHMER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Try to access admin page
    await page.goto("/admin");
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // AC-9: Password must be at least 8 characters
  test("AC-9: Password field requires minimum 8 characters", async ({
    page,
  }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute("minlength", "8");
  });

  // Edge case: Forgot password link exists
  test("EC-1: Forgot password link is visible on login page", async ({
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: /passwort vergessen/i })
    ).toBeVisible();
  });

  // Edge case: Forgot password page works
  test("EC-2: Forgot password page loads correctly", async ({ page }) => {
    await page.click('a:has-text("Passwort vergessen")');
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /link senden/i })
    ).toBeVisible();
  });

  // Security: Already logged in user visiting /login gets redirected
  test("SEC-1: Logged-in user visiting /login is redirected to /dashboard", async ({
    page,
  }) => {
    // Login
    await page.fill('input[type="email"]', TEILNEHMER.email);
    await page.fill('input[type="password"]', TEILNEHMER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Visit login page
    await page.goto("/login");
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
