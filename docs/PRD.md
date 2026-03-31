# Product Requirements Document

## Vision
Eine mobile-optimierte Web-App (PWA), über die Kursteilnehmer ihren persönlichen Wochenplan für einen wiederkehrenden Online-Kurs einsehen können. Admins pflegen die Stundenpläne pro Gruppe über ein integriertes Dashboard. Die App soll auf dem Handy wie eine native App nutzbar sein (Homescreen-Installation via PWA).

## Target Users

### Kursteilnehmer (48 Nutzer)
- Organisiert in 4 Gruppen (je ~12 Teilnehmer)
- Wollen schnell sehen: Wann ist meine nächste Session? Welches Thema? Wie komme ich rein?
- Nutzen die App primär auf dem Handy
- Brauchen einen einfachen, schnellen Zugang ohne Hürden

### Admins (mehrere)
- Pflegen Stundenpläne und Themen pro Gruppe und Woche
- Weisen Nutzer den Gruppen zu
- Brauchen ein übersichtliches Dashboard zum Verwalten

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | Auth: Login mit E-Mail + Passwort | Planned |
| P0 (MVP) | Wochenplan-Ansicht für Kursteilnehmer (Thema, Zeit, Session-Link) | Planned |
| P0 (MVP) | Admin-Dashboard: Stundenpläne pflegen | Planned |
| P0 (MVP) | Admin-Dashboard: Nutzer zu Gruppen zuweisen | Planned |
| P0 (MVP) | PWA-Setup (installierbar auf Homescreen, mobile-optimiert) | Planned |
| P1 | Kursmaterialien: PDF-Upload pro Session | Planned |
| ~~P1~~ | ~~Kalenderansicht (Monats- + Wochenraster)~~ | Cancelled |
| P1 | Nutzerprofil (Name, E-Mail bearbeiten) | Planned |
| P1 | E-Mail-Benachrichtigungen bei Planänderungen | Planned |
| P2 | Push-Notifications (Session-Erinnerungen) | Planned |
| P2 | App Store Veröffentlichung via Capacitor (iOS/Android) | Planned |

## Datenmodell (Übersicht)

### Gruppen
- ID, Name (z.B. "Gruppe A", "Gruppe B", "Gruppe C", "Gruppe D")

### Nutzer
- ID, E-Mail, Name, Gruppe (Zuordnung durch Admin)
- Rolle: `teilnehmer` oder `admin`

### Stundenplan-Eintrag
- ID, Gruppe, Kalenderwoche
- Tag + Uhrzeit (Start/Ende) — 2x2h pro Woche, variabel
- Thema
- Session-Link (z.B. Zoom-URL)

## Technische Rahmenbedingungen

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Mobile-First)
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment**: Vercel
- **PWA**: next-pwa oder Service Worker für Offline-Fähigkeit und Homescreen-Installation

## Success Metrics
- Alle 48 Nutzer können sich einloggen und ihren Stundenplan sehen
- Admins können Pläne innerhalb von 5 Minuten für eine Woche pflegen
- App läuft flüssig auf mobilen Geräten (Lighthouse Performance Score > 90)
- PWA ist auf iOS und Android installierbar

## Constraints
- 48 Nutzer, 4 Gruppen — kein Bedarf für komplexes Scaling
- Sessions: 2x2h pro Woche pro Gruppe, Tage/Zeiten variabel
- Kein App Store Release im MVP — PWA reicht zunächst
- Supabase Free Tier sollte für diese Nutzerzahl ausreichen

## Non-Goals
- Kein Video-Streaming oder Kursinhalt-Hosting
- Keine Bezahlung/Billing-Integration im MVP
- Kein Chat oder Messaging zwischen Teilnehmern
- Keine automatische Kalender-Synchronisation (z.B. Google Calendar) im MVP
- Kein App Store Release im MVP

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
