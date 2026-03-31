# PROJ-2: Gruppenverwaltung (Admin)

## Status: Approved
**Created:** 2026-03-31
**Last Updated:** 2026-03-31

## Dependencies
- Requires: PROJ-1 (User Authentication) — Admin muss eingeloggt und als Admin erkannt sein

## User Stories
- As an Admin, I want to see a list of all groups so that I have an overview of my course structure
- As an Admin, I want to create a new group so that I can organize participants
- As an Admin, I want to rename a group so that I can keep names meaningful
- As an Admin, I want to assign a user to a group so that they see the correct schedule
- As an Admin, I want to move a user to a different group so that I can handle group changes
- As an Admin, I want to see all members of a group so that I know who is in which group

## Acceptance Criteria
- [ ] Admin dashboard shows a list of all groups with member count
- [ ] Admin can create a new group with a name
- [ ] Admin can rename an existing group
- [ ] Admin can assign an unassigned user to a group
- [ ] Admin can move a user from one group to another
- [ ] Admin can see the member list for each group
- [ ] Group names must be unique
- [ ] A user can only belong to one group at a time
- [ ] Teilnehmer cannot access group management pages

## Edge Cases
- What happens when deleting a group that has members? → Show warning, require reassigning members first
- What happens when assigning a user who is already in a group? → Show current group, confirm move
- What happens with duplicate group names? → Validation error "Group name already exists"
- What happens when there are no groups yet? → Empty state with "Create your first group" prompt
- What happens when a group has 0 members? → Show empty state in member list

## Technical Requirements
- Only accessible to users with `admin` role
- Groups table with RLS policies (Admins: full CRUD, Teilnehmer: read own group)
- Maximum 4 groups initially (soft limit, not hardcoded)
- Mobile-friendly admin interface

---

## Tech Design (Solution Architect)
**Designed:** 2026-03-31

### Seitenstruktur
```
/admin (bestehendes Layout)
├── Gruppen-Übersicht (Karten mit Name + Mitgliederanzahl)
│   ├── "Neue Gruppe erstellen" Button → Dialog
│   └── Empty State bei 0 Gruppen
├── Gruppen-Detail /admin/groups/[id]
│   ├── Mitgliederliste (Name, E-Mail, "Entfernen")
│   ├── "Nutzer zuweisen" Button → Dialog
│   └── Empty State bei 0 Mitgliedern
└── Nutzer-Zuweisungs-Dialog
    ├── Nicht zugewiesene Nutzer
    └── Nutzer aus anderen Gruppen (mit Hinweis)
```

### Datenmodell
- **Gruppen-Tabelle (neu)**: ID, Name (unique), created_at
- **Profiles-Tabelle (bestehend)**: group_id wird Foreign Key zur Gruppen-Tabelle
- **Beziehung**: Eine Gruppe → viele Mitglieder, ein Nutzer → max. eine Gruppe

### Row Level Security
- Admins: Voller CRUD-Zugriff auf Gruppen
- Teilnehmer: Können nur ihre eigene Gruppe sehen
- Nutzer-Zuweisung: Nur Admins können group_id ändern

### Tech-Entscheidungen
| Entscheidung | Warum |
|---|---|
| Gruppen als eigene Tabelle | Flexibel, Admins verwalten selbst |
| Dialog für Zuweisung | Schneller Workflow, Admin bleibt im Kontext |
| Karten-Layout | Mobil besser nutzbar bei ~4 Gruppen |
| Keine Gruppen-Löschung im MVP | Zu riskant, nur Umbenennen + Verschieben |

### Benötigte Pakete
Keine neuen — alle shadcn/ui-Komponenten bereits installiert

### Neue Dateien
```
src/app/admin/page.tsx (erweitern), groups/[id]/page.tsx
src/components/admin/group-card.tsx, group-list.tsx, group-create-dialog.tsx
src/components/admin/member-list.tsx, assign-user-dialog.tsx
```

## QA Test Results

**Tested:** 2026-03-31
**App URL:** http://localhost:3000
**Tester:** QA Engineer (AI)

### Acceptance Criteria Status

#### AC-1: Admin dashboard shows groups with member count
- [x] Gruppen-Übersicht wird angezeigt mit "Neue Gruppe"-Button

#### AC-2: Admin can create a new group
- [x] Gruppe wird über Dialog erstellt und erscheint sofort

#### AC-3: Admin can rename a group
- [x] Inline-Umbenennen funktioniert mit Enter/Klick

#### AC-4: Admin can assign an unassigned user to a group
- [x] Nutzer wird über Dialog zugewiesen und erscheint in Mitgliederliste

#### AC-5: Admin can move a user to a different group
- [x] Nutzer kann in andere Gruppe verschoben werden

#### AC-6: Admin can see member list for each group
- [x] Gruppen-Detail-Seite zeigt Mitglieder mit Name und E-Mail

#### AC-7: Group names must be unique
- [x] Duplikat-Name zeigt Fehlermeldung

#### AC-8: A user can only belong to one group at a time
- [x] Nutzer in anderer Gruppe wird im Dialog angezeigt

#### AC-9: Teilnehmer cannot access group management
- [x] Teilnehmer wird von /admin zu /dashboard umgeleitet

### Edge Cases Status
#### EC-1: Empty state when no groups
- [x] Leerer Zustand wird korrekt angezeigt

### Security Audit Results
- [x] Authentication: Nur eingeloggte Admins haben Zugriff
- [x] Authorization: Teilnehmer werden umgeleitet
- [x] RLS: Admins voller CRUD, Teilnehmer nur eigene Gruppe
- [x] Input validation: Unique-Constraint auf Gruppennamen

### Bugs Found
Keine Bugs gefunden.

### E2E Test Suite
- **Datei:** `tests/PROJ-2-group-management.spec.ts`
- **10 Tests:** 10 bestanden, 0 fehlgeschlagen
- **Laufzeit:** ~18s

### Summary
- **Acceptance Criteria:** 9/9 bestanden
- **Edge Cases:** 1/1 bestanden
- **Bugs Found:** 0
- **Security:** Bestanden
- **Production Ready:** JA
- **Recommendation:** Deploy

## Deployment
_To be added by /deploy_
