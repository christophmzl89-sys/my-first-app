import { test, expect } from "@playwright/test";

const ADMIN = { email: "test@admin.de", password: "admin1234" };
const TEILNEHMER = { email: "test@teilnehmer.de", password: "test1234" };

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', ADMIN.email);
  await page.fill('input[type="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin", { timeout: 10000 });
}

test.describe("PROJ-3: Stundenplan-Verwaltung", () => {
  test.describe.configure({ mode: "serial" });

  // AC-1: Admin can select a group and calendar week
  test("AC-1: Schedule page shows group selector and week navigator", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Group selector visible
    await expect(page.getByRole("combobox")).toBeVisible();
    // Week navigator visible
    await expect(page.getByText(/KW/)).toBeVisible();
    // "Session hinzufügen" button visible
    await expect(
      page.getByRole("button", { name: /session hinzufügen/i })
    ).toBeVisible();
  });

  // AC-9: Admin can navigate between weeks
  test("AC-9: Week navigation works", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Get current KW text
    const kwText = await page.getByText(/KW \d+/).textContent();
    const currentKW = parseInt(kwText!.match(/KW (\d+)/)![1]);

    // Click next
    await page.getByRole("button", { name: /nächste woche/i }).click();
    await expect(page.getByText(`KW ${currentKW + 1}`)).toBeVisible();

    // Click prev twice to go back one
    await page.getByRole("button", { name: /vorherige woche/i }).click();
    await expect(page.getByText(`KW ${currentKW}`)).toBeVisible();

    // Click "Heute"
    await page.getByRole("button", { name: /heute/i }).click();
    await expect(page.getByText(/KW \d+/)).toBeVisible();
  });

  // AC-2: Admin can create a schedule entry
  test("AC-2: Admin can create a schedule entry", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    await page.getByRole("button", { name: /session hinzufügen/i }).click();

    // Fill in the form
    // Select day (Montag is default)
    await page.getByLabel("Thema").fill("Einführung in TypeScript");
    await page.getByLabel("Session-Link").fill("https://zoom.us/j/123456");

    await page.getByRole("button", { name: /hinzufügen/i }).click();

    // Entry should appear
    await expect(
      page.getByText("Einführung in TypeScript")
    ).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Session-Link")).toBeVisible();
  });

  // AC-3: Admin can create up to 2 entries (and warning on 3rd)
  test("AC-3: Second entry works, warning shown on third", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Create second entry
    await page.getByRole("button", { name: /session hinzufügen/i }).click();
    await page.getByLabel("Thema").fill("React Grundlagen");
    await page.getByRole("button", { name: /hinzufügen/i }).click();
    await expect(page.getByText("React Grundlagen")).toBeVisible({ timeout: 5000 });

    // Try third — should show warning
    await page.getByRole("button", { name: /session hinzufügen/i }).click();
    await expect(page.getByText(/bereits.*sessions/i)).toBeVisible({ timeout: 3000 });
    // Close dialog
    await page.getByRole("button", { name: /abbrechen/i }).click();
  });

  // AC-6: Weekly overview shows entries
  test("AC-6: Weekly overview shows all entries for group/week", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Should see both entries from previous tests
    await expect(page.getByText("Einführung in TypeScript")).toBeVisible();
    await expect(page.getByText("React Grundlagen")).toBeVisible();
  });

  // AC-4: Admin can edit an existing entry
  test("AC-4: Admin can edit a schedule entry", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Click edit on first entry
    await page.getByRole("button", { name: /bearbeiten/i }).first().click();

    // Change topic
    const topicInput = page.getByLabel("Thema");
    await topicInput.clear();
    await topicInput.fill("TypeScript Advanced");

    await page.getByRole("button", { name: /speichern/i }).click();

    await expect(page.getByText("TypeScript Advanced")).toBeVisible({ timeout: 5000 });
  });

  // AC-7: Session link validated as URL
  test("AC-7: Invalid session link shows error", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    await page.getByRole("button", { name: /session hinzufügen/i }).click();
    await page.getByLabel("Thema").fill("Test Session");
    await page.getByLabel("Session-Link").fill("not-a-url");
    await page.getByRole("button", { name: /hinzufügen/i }).click();

    await expect(page.getByText(/gültige URL/i)).toBeVisible({ timeout: 3000 });
    // Close dialog
    await page.getByRole("button", { name: /abbrechen/i }).click();
  });

  // AC-8: Start time must be before end time
  test("AC-8: Start time before end time validation", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    await page.getByRole("button", { name: /session hinzufügen/i }).click();
    await page.getByLabel("Thema").fill("Test Session");
    await page.getByLabel("Startzeit").fill("14:00");
    await page.getByLabel("Endzeit").fill("12:00");
    await page.getByRole("button", { name: /hinzufügen/i }).click();

    await expect(page.getByText(/startzeit.*vor.*endzeit/i)).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: /abbrechen/i }).click();
  });

  // AC-5: Admin can delete an entry with confirmation
  test("AC-5: Admin can delete an entry with confirmation", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Count entries before
    const entriesBefore = await page.getByRole("button", { name: /löschen/i }).count();

    // Click delete on first entry
    await page.getByRole("button", { name: /löschen/i }).first().click();

    // Confirmation dialog should appear
    await expect(page.getByText(/wirklich löschen/i)).toBeVisible();

    // Confirm
    await page.getByRole("button", { name: /^löschen$/i }).click();

    // Should have one fewer entry
    await expect(page.getByRole("button", { name: /löschen/i })).toHaveCount(
      entriesBefore - 1,
      { timeout: 5000 }
    );
  });

  // AC-10: Teilnehmer cannot access schedule management
  test("AC-10: Teilnehmer cannot access /admin/schedule", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', TEILNEHMER.email);
    await page.fill('input[type="password"]', TEILNEHMER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    await page.goto("/admin/schedule");
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // EC-4: Empty state when navigating to week with no entries
  test("EC-4: Empty state for week with no entries", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/schedule");

    // Navigate far into future
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: /nächste woche/i }).click();
    }

    await expect(page.getByText(/keine sessions/i)).toBeVisible({ timeout: 3000 });
  });
});
