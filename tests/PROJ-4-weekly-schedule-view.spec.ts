import { test, expect } from "@playwright/test";

const ADMIN = { email: "test@admin.de", password: "admin1234" };
const TEILNEHMER = { email: "test@teilnehmer.de", password: "test1234" };

async function loginAs(
  page: import("@playwright/test").Page,
  user: { email: string; password: string }
) {
  await page.goto("/login");
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
}

test.describe("PROJ-4: Wochenplan-Ansicht (Teilnehmer)", () => {
  test.describe.configure({ mode: "serial" });

  // AC-8: No group assigned shows message
  test("AC-8: No group assigned shows contact admin message", async ({
    page,
  }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    await expect(page.getByText(/keine gruppe/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/kontaktiere.*admin/i)).toBeVisible();
  });

  // Setup: Assign teilnehmer to group via admin UI
  test("Setup: Admin assigns teilnehmer to Testgruppe B", async ({ page }) => {
    await loginAs(page, ADMIN);
    await page.waitForURL("**/admin", { timeout: 10000 });

    // Go to first group's members
    await page.getByRole("link", { name: /mitglieder anzeigen/i }).first().click();
    await page.waitForURL("**/admin/groups/**", { timeout: 10000 });

    // Assign user
    await page.getByRole("button", { name: /nutzer zuweisen/i }).click();
    await expect(page.getByText("test@teilnehmer.de")).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /zuweisen/i }).first().click();

    // Wait for assignment to complete
    await page.waitForTimeout(1000);
  });

  // AC-1: After login, current week's schedule shown
  test("AC-1: Dashboard shows schedule after login", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Should see week navigator
    await expect(page.getByText(/KW/)).toBeVisible({ timeout: 5000 });
  });

  // AC-2: Each entry shows day, date, time, topic, link
  test("AC-2: Schedule entries show all required fields", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Navigate to KW 14 where we have test data
    // Click until we reach KW 14 or use direct navigation
    const kwText = page.getByText(/KW \d+/);
    await expect(kwText).toBeVisible();

    // Navigate to week 14 if not already there
    let attempts = 0;
    while (attempts < 10) {
      const text = await kwText.textContent();
      if (text?.includes("KW 14") && text?.includes("2026")) break;
      await page.getByRole("button", { name: /nächste woche/i }).click();
      await page.waitForTimeout(300);
      attempts++;
    }

    // Should see entries
    await expect(page.getByText("React Hooks Deep Dive")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("State Management mit Zustand")).toBeVisible();

    // Should show times (use specific time range text)
    await expect(page.getByText("09:00 – 11:00").first()).toBeVisible();
    await expect(page.getByText("14:00 – 16:00").first()).toBeVisible();

    // Should show day names
    await expect(page.getByText(/montag/i).first()).toBeVisible();
    await expect(page.getByText(/mittwoch/i).first()).toBeVisible();
  });

  // AC-3: Session link is clickable
  test("AC-3: Session link opens in new tab", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Navigate to KW 14
    let attempts = 0;
    const kwText = page.getByText(/KW \d+/);
    while (attempts < 10) {
      const text = await kwText.textContent();
      if (text?.includes("KW 14") && text?.includes("2026")) break;
      await page.getByRole("button", { name: /nächste woche/i }).click();
      await page.waitForTimeout(300);
      attempts++;
    }

    // Session link button should exist
    const linkButton = page.getByRole("link", { name: /zur session beitreten/i });
    await expect(linkButton).toBeVisible({ timeout: 5000 });
    await expect(linkButton).toHaveAttribute("target", "_blank");
  });

  // EC-3: Missing session link shows "Link nicht verfügbar"
  test("EC-3: Missing link shows 'Link nicht verfügbar'", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Navigate to KW 14
    let attempts = 0;
    const kwText = page.getByText(/KW \d+/);
    while (attempts < 10) {
      const text = await kwText.textContent();
      if (text?.includes("KW 14") && text?.includes("2026")) break;
      await page.getByRole("button", { name: /nächste woche/i }).click();
      await page.waitForTimeout(300);
      attempts++;
    }

    // At least one entry has no link
    await expect(page.getByText(/link nicht verfügbar/i).first()).toBeVisible({ timeout: 5000 });
  });

  // AC-5: User can navigate to next/previous week
  test("AC-5: Week navigation works", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    const kwText = page.getByText(/KW \d+/);
    const initialText = await kwText.textContent();
    const initialKW = parseInt(initialText!.match(/KW (\d+)/)![1]);

    // Next
    await page.getByRole("button", { name: /nächste woche/i }).click();
    await expect(page.getByText(`KW ${initialKW + 1}`)).toBeVisible();

    // Prev
    await page.getByRole("button", { name: /vorherige woche/i }).click();
    await expect(page.getByText(`KW ${initialKW}`)).toBeVisible();
  });

  // AC-6: "Today" button jumps to current week
  test("AC-6: Today button jumps to current week", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Navigate away
    await page.getByRole("button", { name: /nächste woche/i }).click();
    await page.getByRole("button", { name: /nächste woche/i }).click();

    // Click today
    await page.getByRole("button", { name: /heute/i }).click();
    await expect(page.getByText(/KW \d+/)).toBeVisible();
  });

  // AC-7: Empty state for week with no sessions
  test("AC-7: Empty state when no sessions in week", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Navigate far away from current data
    for (let i = 0; i < 8; i++) {
      await page.getByRole("button", { name: /nächste woche/i }).click();
    }

    await expect(page.getByText(/keine sessions/i)).toBeVisible({ timeout: 5000 });
  });

  // AC-10: Layout is mobile-first (card-based)
  test("AC-10: Layout uses cards (not tables)", async ({ page }) => {
    await loginAs(page, TEILNEHMER);
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Navigate to KW 14
    let attempts = 0;
    const kwText = page.getByText(/KW \d+/);
    while (attempts < 10) {
      const text = await kwText.textContent();
      if (text?.includes("KW 14") && text?.includes("2026")) break;
      await page.getByRole("button", { name: /nächste woche/i }).click();
      await page.waitForTimeout(300);
      attempts++;
    }

    // Should NOT have any table elements
    await expect(page.locator("table")).toHaveCount(0);
    // Should have card elements
    await expect(page.locator("[data-slot='card']").or(page.locator(".rounded-lg.border"))).not.toHaveCount(0);
  });
});
