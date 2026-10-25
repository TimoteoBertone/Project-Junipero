# Project Junipero

React Native (Expo) app for therapists: private clients, session scheduling with Argentina time (ART), cloud sync (Supabase), and local reminders.

## Language policy

- **Source code:** English only (identifiers, files, comments, schema/API names).
- **Default UI:** English (`locales/en.json`) — also the fallback.
- **Other languages:** JSON files under `src/i18n/locales/` selected from the device locale (e.g. `es.json` for `es*`). Add new locales without changing business logic.

## Quick start

```bash
npm install
npx expo start
```

Optional cloud sync: copy `.env.example` → `.env` and set Supabase URL + anon key.

See [SPEC.md](./SPEC.md) for the full technical specification.
