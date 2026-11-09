/**
 * Public Expo env keys (EXPO_PUBLIC_*).
 * Values come from `.env` / EAS secrets — never commit real secrets.
 */
function read(name: string): string {
  return (process.env[name] ?? "").trim();
}

export const env = {
  supabaseUrl: read("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  /** Google OAuth Web client ID (required for Expo Go / browser OAuth). */
  googleWebClientId: read("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),
  /** Google iOS client ID (optional; native builds). */
  googleIosClientId: read("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"),
  /** Google Android client ID (optional; native builds). */
  googleAndroidClientId: read("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"),
  /**
   * Apple Services ID used as OAuth client id in Supabase (web / Expo Go flows).
   * Native Sign in with Apple uses the app bundle id + Apple capability.
   */
  appleServiceId: read("EXPO_PUBLIC_APPLE_SERVICE_ID"),
  appleRedirectUri: read("EXPO_PUBLIC_APPLE_REDIRECT_URI"),
};

export function missingAuthKeys(): string[] {
  const missing: string[] = [];
  if (!env.supabaseUrl) missing.push("EXPO_PUBLIC_SUPABASE_URL");
  if (!env.supabaseAnonKey) missing.push("EXPO_PUBLIC_SUPABASE_ANON_KEY");
  return missing;
}

export function missingGoogleKeys(): string[] {
  const missing = missingAuthKeys();
  if (!env.googleWebClientId) missing.push("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
  return missing;
}

export function missingAppleKeys(): string[] {
  const missing = missingAuthKeys();
  // Native Apple uses the bundle id; Services ID is required for Supabase Apple provider setup
  if (!env.appleServiceId) missing.push("EXPO_PUBLIC_APPLE_SERVICE_ID");
  return missing;
}

/** Google OAuth works when Supabase + Google Web client id are present. */
export const isGoogleConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey && env.googleWebClientId
);

/** Apple works when Supabase is present (native token exchange). Service ID documented for dashboard. */
export const isAppleConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey
);
