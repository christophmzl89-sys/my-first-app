# PROJ-7: Kalenderansicht (Teilnehmer)

## Status: Cancelled
**Cancelled:** 2026-03-31
**Reason:** Aus User-Sicht nicht relevant — die bestehende Listenansicht (PROJ-4) reicht für den Use-Case. Kalender-/Wochenraster-Ansichten bieten keinen Mehrwert bei 2 Sessions pro Woche.
**Created:** 2026-03-31
**Last Updated:** 2026-03-31

## Dependencies
- Requires: PROJ-1 (User Authentication) — Nutzer muss eingeloggt sein
- Requires: PROJ-4 (Wochenplan-Ansicht) — Baut auf bestehender Dashboard-Seite auf, nutzt gleiche Daten

## User Stories
- As a Kursteilnehmer, I want to see my sessions in a monthly calendar so that I get an overview of the entire month
- As a Kursteilnehmer, I want to see my sessions in a weekly timetable grid so that I can see exact time blocks
- As a Kursteilnehmer, I want to switch between list view, month view, and week view so that I can use the perspective that suits me best
- As a Kursteilnehmer, I want to click a day in the month view to see session details below so that I can quickly check what's on that day
- As a Kursteilnehmer, I want to navigate between months in the calendar so that I can look ahead

## Acceptance Criteria
- [ ] Dashboard has toggle buttons: "Liste" (existing PROJ-4), "Monat", "Woche"
- [ ] Default view is "Liste" (existing behavior preserved)
- [ ] Month view shows a calendar grid (Mo–So) for the current month
- [ ] Session days are visually marked (dot/highlight) in the month view
- [ ] Today is highlighted in the month view
- [ ] Clicking a session day shows session details inline below the calendar
- [ ] Month view has navigation to previous/next month
- [ ] Week view shows a time grid (hours as rows, days as columns)
- [ ] Session blocks are displayed in the correct time slots in the week view
- [ ] Week view has navigation to previous/next week
- [ ] Clicking a session block in week view shows details (topic, link, material)
- [ ] All views show the same data (schedule_entries for user's group)
- [ ] Switching views preserves the selected time period where possible
- [ ] Layout is mobile-friendly (month grid scales, week view scrollable)
- [ ] Session details include: topic, time, session link, material download (if available)

## Edge Cases
- What happens in month view when a day has 2 sessions? → Show 2 dots/markers, details show both
- What happens in week view on mobile? → Horizontal scroll for all 7 days
- What happens when clicking a day with no sessions? → Show "Keine Sessions an diesem Tag"
- What happens when switching from month to week? → Week view shows the week containing the selected day
- What happens when there are no sessions in a month? → Calendar grid still shown, no markers, message below

## Technical Requirements
- No new database tables or backend — uses existing schedule_entries data
- date-fns for calendar calculations (already installed)
- Mobile-first: month grid and week grid must work on 375px screens
- Reuse existing SessionCard component for detail display where possible

---

## Tech Design (Solution Architect)
**Designed:** 2026-03-31

### Seitenstruktur
```
/dashboard (erweitern)
├── Toggle: [Liste] [Monat] [Woche] — Standard: Liste
├── Liste: Bestehende ParticipantSchedule (PROJ-4, unverändert)
├── Monat: Kalenderraster + Klick → Details inline darunter
└── Woche: Stundenplan-Raster (Stunden × Tage) + Klick → Details inline
```

### Daten
- Keine neuen Tabellen — nutzt schedule_entries
- Monat: Lädt alle Einträge des Monats (max 4-5 KWs)
- Woche: Lädt Einträge für eine KW

### Ansichtswechsel
- Liste→Monat: Monat des aktuellen KW-Datums
- Monat→Woche: KW des ausgewählten Tages
- Woche→Liste: Gleiche KW

### Tech-Entscheidungen
| Entscheidung | Warum |
|---|---|
| Eigene Kalender-Komponenten | Einfach genug, keine Library nötig |
| date-fns | Bereits installiert |
| Details inline (nicht Popup) | Bessere Mobile-UX |
| SessionCard wiederverwenden | Einheitliches Design |

### Neue Dateien
```
src/components/dashboard/view-toggle.tsx, month-view.tsx
src/components/dashboard/week-grid-view.tsx, calendar-day-detail.tsx
Geändert: dashboard/page.tsx, participant-schedule.tsx
Wiederverwendet: week-navigator.tsx, session-card.tsx
```

### Kein Backend nötig

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
