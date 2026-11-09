# Project Junipero

Project Junipero is an Expo and React Native app for independent therapists. It
helps organize client records and appointments, with appointment times managed
in Argentina Time (ART).

## Features

- Client profiles with location, timezone, contact details, and notes.
- Appointment scheduling, recurrence, status, and local reminders.
- ART-based scheduling with client-local timezone display.
- Email and password authentication, plus optional Google and Apple sign-in.
- A demo mode with sample clients when Supabase is not configured.
- English and Spanish interface, following the device language by default.
- Light and dark themes.

## Requirements

- Node.js and npm.
- Expo-compatible iOS or Android device/simulator, or a browser for web.
- Xcode is required to build or run the iOS app locally; iOS builds require
  macOS.

## Getting started

Install dependencies and start Expo:

```bash
npm install
npx expo start
```

Use the Expo terminal shortcuts to open the app on a device or simulator, or
run one of the package scripts:

```bash
npm run android
npm run ios
npm run web
```

`npm run ios` requires macOS and an installed iOS simulator. Some native
authentication and notification features may require a development build
rather than Expo Go.

## Authentication setup

The app can be explored in demo mode without configuring a backend. Demo
clients, appointments, and profile data are stored on the current device.

To enable Supabase authentication:

1. Copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. Enable and configure the desired providers in the Supabase Auth dashboard.
4. For Google, set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` and configure the
   corresponding OAuth client and redirect URI in Google Cloud and Supabase.
5. For native Apple sign-in, enable the Apple capability for the iOS app and
   configure the Apple provider in Supabase. Apple sign-in is available only on
   supported iOS devices.

The optional iOS and Android Google client IDs and the Apple service/redirect
IDs are documented in `.env.example` for provider-specific setups. Restart
Expo after changing environment variables.

Only public client configuration belongs in `EXPO_PUBLIC_*` variables. Never
put a Supabase service-role key or other server secret in the app.

### Current data storage

Client, appointment, and profile data are currently persisted locally with
AsyncStorage. Supabase is used for authentication; remote data storage and
cross-device synchronization are not implemented yet.

## Development

Run the TypeScript check before submitting changes:

```bash
npx tsc --noEmit
```

The central color palette is in `src/theme/palette.json`; interface
translations are in `src/i18n/locales/`.

## Documentation

See [SPEC.md](./SPEC.md) for the functional and technical specification.
