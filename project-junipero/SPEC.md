# Project Junipero — Technical & Functional Spec (v1)

React Native (Expo) mobile app for independent therapists: private client management, session scheduling with Argentina time (ART), cloud sync via Supabase, and local notifications.

## Locked decisions

- **Client:** React Native + Expo (free SDK path; local `expo run:*`)
- **Backend:** Supabase (Auth, Postgres, RLS, Realtime)
- **Local cache:** SQLite / AsyncStorage (offline queue)
- **Code language:** English only (identifiers, files, comments, schema)
- **UI language:** English default/fallback; `locales/*.json` selected from device locale (`en`, `es`, …)

## Modules

1. **Auth** — Google / Apple / email+password (Supabase); demo mode without keys
2. **Home** — calendar marks + today’s appointments in ART (local vs origin time)
3. **Clients** — CRUD, place autocomplete → country + IANA TZ, geo filters/stats
4. **Appointments** — UTC persistence + client IANA snapshot, recurrence with per-occurrence exceptions, ART-only overlap checks, local reminders
5. **Settings** — profile, reminders, language override, sync status, sign out

## Critical rules

- Persist `starts_at_utc` + `client_iana_tz` (DST-safe)
- Validate overlaps exclusively in `America/Argentina/Buenos_Aires` (never hard-coded −3)
- Recurrence edits/cancels apply to the selected occurrence only

## Run

```bash
npm install
npx expo start
```

Copy `.env.example` to `.env` and set Supabase keys to enable cloud auth/sync.
