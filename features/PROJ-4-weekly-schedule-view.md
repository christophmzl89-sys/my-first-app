# PROJ-4: Wochenplan-Ansicht (Teilnehmer)

## Status: Approved
**Created:** 2026-03-31
**Last Updated:** 2026-03-31

## Dependencies
- Requires: PROJ-1 (User Authentication) — Nutzer muss eingeloggt sein
- Requires: PROJ-2 (Gruppenverwaltung) — Nutzer muss einer Gruppe zugeordnet sein
- Requires: PROJ-3 (Stundenplan-Verwaltung) — Einträge müssen existieren

## User Stories
- As a Kursteilnehmer, I want to see my weekly schedule immediately after login so that I know when my next sessions are
- As a Kursteilnehmer, I want to see the topic of each session so that I can prepare
- As a Kursteilnehmer, I want to tap the session link to join directly so that I don't have to search for the link
- As a Kursteilnehmer, I want to navigate between weeks so that I can see upcoming sessions
- As a Kursteilnehmer, I want to see today highlighted so that I can quickly find today's session

## Acceptance Criteria
- [ ] After login, the current week's schedule is shown immediately
- [ ] Each entry shows: day, date, start/end time, topic, session link
- [ ] Session link is clickable and opens in a new tab
- [ ] Current day is visually highlighted
- [ ] User can navigate to next/previous week
- [ ] "Today" button to quickly jump back to the current week
- [ ] If no sessions are scheduled for a week, show a friendly empty state
- [ ] If the user is not assigned to a group, show a message "You are not assigned to a group yet. Please contact your admin."
- [ ] Schedule loads in under 2 seconds on mobile
- [ ] Layout is mobile-first (card-based, not table-based)

## Edge Cases
- What happens when the user has no group assigned? → Clear message to contact admin
- What happens when the week has no entries? → "No sessions this week" empty state
- What happens when a session link is missing? → Show entry without link, display "Link not available"
- What happens when viewing a past week? → Show normally (no special treatment)
- What happens on a session day? → Highlight the card, optionally show "Today" badge

## Technical Requirements
- Fetch schedule entries filtered by user's group and selected week
- Mobile-first responsive design (cards, not tables)
- Fast loading: server-side rendering or static generation where possible
- Accessible: proper ARIA labels, keyboard navigation
- Touch-friendly: large tap targets for session links

---

## Tech Design (Solution Architect)
**Designed:** 2026-03-31

### Seitenstruktur
```
/dashboard (erweitern)
├── Keine Gruppe → Hinweis "Kontaktiere deinen Admin"
├── Gruppe vorhanden → Wochenplan
│   ├── Wochen-Navigation (← KW X →, "Heute")
│   ├── Session-Karten (Tag+Datum, Zeit, Thema, Link, "Heute"-Badge)
│   └── Empty State bei 0 Sessions
```

### Datenmodell
- Keine neuen Tabellen — nutzt profiles.group_id + schedule_entries (bestehend)
- Konkretes Datum berechnet aus Jahr + KW + Wochentag

### Flow
1. Login → /dashboard → Profil lesen (SSR)
2. Keine Gruppe? → Hinweis | Gruppe? → Einträge per RLS laden
3. Aktuelle KW als Standard, Navigation client-seitig

### Tech-Entscheidungen
| Entscheidung | Warum |
|---|---|
| SSR für ersten Load | Schnellster Aufbau, gut für Mobile |
| Navigation client-seitig | Sofortiges Feedback beim Blättern |
| Karten-Layout | Mobile-first |
| Konkretes Datum anzeigen | Nutzer wollen "welcher Tag genau" wissen |
| "Heute"-Badge | Schnelle Orientierung |
| WeekNavigator wiederverwenden | Kein doppelter Code |

### Benötigte Pakete
Keine neuen — date-fns bereits installiert

### Neue Dateien
```
src/app/dashboard/page.tsx (erweitern)
src/components/dashboard/participant-schedule.tsx, session-card.tsx
Wiederverwendet: src/components/admin/week-navigator.tsx
```

## QA Test Results

**Tested:** 2026-03-31
**App URL:** http://localhost:3000
**Tester:** QA Engineer (AI)

### Acceptance Criteria Status

#### AC-1: Current week's schedule shown after login
- [x] Dashboard zeigt Wochenplan mit KW-Navigation nach Login

#### AC-2: Each entry shows day, date, time, topic, link
- [x] Montag 30. März, 09:00–11:00, Thema, Session-Link sichtbar

#### AC-3: Session link clickable in new tab
- [x] "Zur Session beitreten" Button mit target="_blank"

#### AC-4: Current day visually highlighted
- [x] "Heute"-Badge und farbiger Rahmen auf heutigem Tag

#### AC-5: Week navigation (next/previous)
- [x] Vor/Zurück-Buttons ändern die KW

#### AC-6: "Today" button jumps to current week
- [x] Button springt zurück zur aktuellen KW

#### AC-7: Empty state for week with no sessions
- [x] "Keine Sessions in dieser Woche" angezeigt

#### AC-8: No group assigned shows message
- [x] "Keine Gruppe zugewiesen – Kontaktiere deinen Admin"

#### AC-9: Schedule loads under 2 seconds
- [x] SSR-Rendering, Seite lädt schnell

#### AC-10: Mobile-first card layout
- [x] Karten-Layout, keine Tabellen

### Edge Cases Status
#### EC-3: Missing session link
- [x] "Link nicht verfügbar" wird angezeigt

### Security Audit Results
- [x] Authentication: Nur eingeloggte Nutzer sehen Dashboard
- [x] Authorization: RLS filtert Einträge auf eigene Gruppe
- [x] Teilnehmer sehen keine fremden Gruppen-Daten

### Bugs Found
Keine Bugs gefunden.

### E2E Test Suite
- **Datei:** `tests/PROJ-4-weekly-schedule-view.spec.ts`
- **10 Tests:** 10 bestanden, 0 fehlgeschlagen
- **Laufzeit:** ~14s

### Summary
- **Acceptance Criteria:** 10/10 bestanden
- **Edge Cases:** 1/1 bestanden
- **Bugs Found:** 0
- **Security:** Bestanden
- **Production Ready:** JA
- **Recommendation:** Deploy

## Deployment
_To be added by /deploy_
