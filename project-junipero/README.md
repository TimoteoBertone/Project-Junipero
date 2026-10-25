# Project Junipero

React Native (Expo) app for therapists: private clients, session scheduling with Argentina time (ART), cloud sync (Supabase), and local reminders.

## UI (Apple HIG)

- Navigation uses **Expo Router `NativeTabs`** → real `UITabBarController`.
- On **iOS 26+**, the system draws the **Liquid Glass** tab bar automatically.
- Per Apple’s [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass): do **not** paint custom backgrounds on the tab bar.
- Content uses grouped system backgrounds; buttons follow Cupertino styles (filled / gray / destructive / plain).

## Language policy

- **Source code:** English only (identifiers, files, comments, schema/API names).
- **Default UI:** English (`locales/en.json`) — also the fallback.
- **Other languages:** JSON files under `src/i18n/locales/` selected from the device locale (e.g. `es.json` for `es*`).

## Quick start

```bash
npm install
npx expo start
```

Optional cloud sync: copy `.env.example` → `.env` and set Supabase / Google / Apple keys.

See [SPEC.md](./SPEC.md) for the full technical specification.
