import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import {
  isAppleConfigured,
  isGoogleConfigured,
  missingAuthKeys,
} from "../config/env";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { AuthSession, TherapistProfile } from "../types/models";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: "project-junipero",
  path: "auth/callback",
});

export function getOAuthRedirectUri(): string {
  return redirectTo;
}

function getParamsFromUrl(url: string): Record<string, string> {
  const parsed = new URL(url.replace("#", "?"));
  const out: Record<string, string> = {};
  parsed.searchParams.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

async function createSessionFromUrl(url: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const params = getParamsFromUrl(url);
  if (params.error || params.error_code) {
    throw new Error(params.error_description || params.error || params.error_code);
  }

  const access_token = params.access_token;
  const refresh_token = params.refresh_token;
  if (!access_token) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token ?? "",
  });
  if (error) throw error;
  return data.session;
}

function profileFromUser(
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
  accessToken: string
): AuthSession {
  const meta = user.user_metadata ?? {};
  const displayName =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.given_name === "string" && meta.given_name) ||
    user.email?.split("@")[0] ||
    "Therapist";

  const therapist: TherapistProfile = {
    id: user.id,
    email: user.email ?? "",
    displayName,
    preferredLocale: "system",
    defaultDurationMin: 50,
    defaultReminder: "1h",
  };

  return { accessToken, therapist };
}

export async function sessionFromSupabase(): Promise<AuthSession | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const session = data.session;
  if (!session?.user) return null;
  return profileFromUser(session.user, session.access_token);
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<AuthSession> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      `Missing keys: ${missingAuthKeys().join(", ") || "Supabase"}`
    );
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  if (!data.session?.user) throw new Error("No session returned");
  return profileFromUser(data.session.user, data.session.access_token);
}

export async function signUpWithEmailPassword(
  email: string,
  password: string
): Promise<AuthSession> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      `Missing keys: ${missingAuthKeys().join(", ") || "Supabase"}`
    );
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.session?.user) {
    throw new Error(
      "Account created. Confirm your email before signing in."
    );
  }
  return profileFromUser(data.session.user, data.session.access_token);
}

/**
 * Google OAuth via Supabase. Requires Google provider enabled in Supabase
 * with Web client ID / secret, and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID set.
 */
export async function signInWithGoogle(): Promise<AuthSession> {
  if (!isGoogleConfigured) {
    throw new Error(
      `Google sign-in needs: ${[
        "EXPO_PUBLIC_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY",
        "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID",
      ].join(", ")}`
    );
  }

  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error("No Google OAuth URL returned");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success" || !("url" in result) || !result.url) {
    throw new Error("Google sign-in was cancelled");
  }

  const session = await createSessionFromUrl(result.url);
  if (!session?.user) throw new Error("Google sign-in did not return a session");
  return profileFromUser(session.user, session.access_token);
}

/**
 * Native Sign in with Apple (iOS). Token exchanged with Supabase.
 * Enable Apple provider in Supabase Auth and the Apple capability on the app.
 */
export async function signInWithApple(): Promise<AuthSession> {
  if (!isAppleConfigured) {
    throw new Error(
      "Apple sign-in needs EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  if (Platform.OS !== "ios") {
    throw new Error("Sign in with Apple is only available on iOS");
  }

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw new Error("Sign in with Apple is not available on this device");
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("Apple did not return an identity token");
  }

  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
  });
  if (error) throw error;
  if (!data.session?.user) throw new Error("Apple sign-in did not return a session");

  // Prefer Apple full name on first sign-in
  const given = credential.fullName?.givenName;
  const family = credential.fullName?.familyName;
  if (given || family) {
    const displayName = [given, family].filter(Boolean).join(" ");
    await supabase.auth.updateUser({
      data: { full_name: displayName, name: displayName },
    });
  }

  return profileFromUser(data.session.user, data.session.access_token);
}

export async function signOutRemote(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export { isSupabaseConfigured, isGoogleConfigured, isAppleConfigured };
