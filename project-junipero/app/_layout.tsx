import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import "../src/i18n";
import { AppProvider, useAppStore } from "../src/store/AppStore";
import { colors, getThemeColors } from "../src/theme/colors";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, session } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) {
      router.replace("/(auth)/sign-in");
    } else if (session && inAuth) {
      router.replace("/(app)/home");
    }
  }, [ready, session, segments, router]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.groupedBackground,
        }}
      >
        <ActivityIndicator color={colors.tint} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

function AppNavigationTheme({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const themeColors = getThemeColors(isDark);

  return (
    <ThemeProvider
      value={{
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: themeColors.groupedBackground,
          card: themeColors.secondaryGrouped,
          border: themeColors.separator,
        },
      }}
    >
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <AppNavigationTheme>
          <AuthGate>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.groupedBackground },
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
            </Stack>
          </AuthGate>
        </AppNavigationTheme>
      </AppProvider>
    </SafeAreaProvider>
  );
}
