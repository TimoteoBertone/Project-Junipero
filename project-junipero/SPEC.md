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

## Appointment date and time contract

- The therapist chooses a date and time with the native system picker, interpreted as ART wall-clock time.
- Convert that selection once to an ISO-8601 UTC timestamp (`Appointment.startsAtUtc`, e.g. `2026-11-09T15:00:00.000Z`) before persistence. A backend column should be `timestamptz` (`starts_at_utc`), not a formatted date string.
- Keep the client timezone snapshot as an IANA identifier (`Appointment.clientIanaTz`, e.g. `America/Santiago`, stored as text/`client_iana_tz`) so the appointment can be displayed in the client's local time.
- Keep `durationMin`, status, reminder, and recurrence as their typed values; localized labels and display-formatted dates are presentation only and must not be sent as canonical data.
- Appointments are currently persisted in local storage. Supabase is configured for authentication only; appointment CRUD/sync requires a database schema and remote store implementation.

## Run

```bash
npm install
npx expo start
```

Copy `.env.example` to `.env` and set Supabase keys to enable cloud auth/sync.
