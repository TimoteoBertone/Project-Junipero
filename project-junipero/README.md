# Project Junipero

React Native (Expo) app for therapists: private clients, session scheduling with Argentina time (ART), cloud sync (Supabase), and local reminders.

## UI (Apple HIG + iPhone Duo)

- Navigation uses **Expo Router `NativeTabs`** → real `UITabBarController` / Liquid Glass on iOS 26+.
- **iPhone Duo** readiness (SDK 58 / iOS 27+):
  - Orientation unlocked (`default`) so tent / landscape poses work.
  - `preferredPlacement="sidebar"` so open/regular-width displays can show a sidebar.
  - Content pads **left and right** safe areas independently for the vertical rail (never assume symmetry).
  - Layout uses `useWindowDimensions` (not orientation or `UIScreen.main`).
  - Multi-scene enabled. Fold/occlusion APIs (`react-native-reserved-regions`) need a **dev/production build**, not Expo Go.
- Per Apple’s [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass) and [Prepare for iPhone Duo](https://developer.apple.com/iphone-duo/prepare/): let the system draw bars; size from available space.

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
