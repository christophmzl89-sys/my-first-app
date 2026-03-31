# Feature Index

> Central tracking for all features. Updated by skills automatically.

## Status Legend
- **Planned** - `/requirements` done, spec written, architecture not yet designed
- **Architected** - `/architecture` done, tech design approved, ready to build
- **In Progress** - `/frontend` or `/backend` active or completed, not yet in QA
- **In Review** - `/qa` active, testing in progress
- **Approved** - `/qa` passed, no critical/high bugs, ready to deploy
- **Deployed** - `/deploy` done, live in production

## Features

| ID | Feature | Status | Spec | Created |
|----|---------|--------|------|---------|
| PROJ-1 | User Authentication | Deployed | [Spec](PROJ-1-user-authentication.md) | 2026-03-31 |
| PROJ-2 | Gruppenverwaltung (Admin) | Deployed | [Spec](PROJ-2-group-management.md) | 2026-03-31 |
| PROJ-3 | Stundenplan-Verwaltung (Admin) | Deployed | [Spec](PROJ-3-schedule-management.md) | 2026-03-31 |
| PROJ-4 | Wochenplan-Ansicht (Teilnehmer) | Deployed | [Spec](PROJ-4-weekly-schedule-view.md) | 2026-03-31 |
| PROJ-5 | PWA-Setup | Deployed | [Spec](PROJ-5-pwa-setup.md) | 2026-03-31 |

| PROJ-6 | Kursmaterialien (PDF-Upload) | Deployed | [Spec](PROJ-6-course-materials.md) | 2026-03-31 |

| PROJ-7 | ~~Kalenderansicht (Teilnehmer)~~ | Cancelled | [Spec](PROJ-7-calendar-view.md) | 2026-03-31 |

<!-- Add features above this line -->

## Recommended Build Order
1. PROJ-1 → Auth (Grundlage für alles)
2. PROJ-2 → Gruppen (benötigt für Stundenplan-Zuordnung)
3. PROJ-3 → Stundenplan pflegen (Admin)
4. PROJ-4 → Wochenplan anzeigen (Teilnehmer)
5. PROJ-5 → PWA (App installierbar machen)

## Next Available ID: PROJ-8
