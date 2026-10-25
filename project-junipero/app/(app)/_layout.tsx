import React from "react";
import { DynamicColorIOS, Platform } from "react-native";
import { NativeTabs } from "expo-router/native-tabs";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";

/**
 * UITabBarController via Expo NativeTabs.
 * iPhone Duo (iOS 27+): system moves bars into the vertical rail; prefer a
 * sidebar on the open/regular-width display (Apple + Expo Duo guidance).
 * @see https://developer.apple.com/iphone-duo/prepare/
 * @see https://expo.dev/blog/supporting-iphone-duo
 * @see https://docs.expo.dev/router/advanced/native-tabs/
 */
export default function AppTabsLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isIOS = Platform.OS === "ios";

  const tintColor = isIOS
    ? DynamicColorIOS({ light: "#007AFF", dark: "#0A84FF" })
    : "#2F6FED";

  const labelColor = isIOS
    ? DynamicColorIOS({ light: "#000000", dark: "#FFFFFF" })
    : undefined;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs
        tintColor={tintColor}
        labelStyle={labelColor ? { color: labelColor } : undefined}
        minimizeBehavior="onScrollDown"
        // Enables sidebar-adaptable tabs; on Duo open / iPad shows sidebar.
        preferredPlacement="sidebar"
      >
        <NativeTabs.Trigger name="home">
          <NativeTabs.Trigger.Label>{t("nav.home")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "house", selected: "house.fill" }}
            md="home"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="clients">
          <NativeTabs.Trigger.Label>{t("nav.clients")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "person.2", selected: "person.2.fill" }}
            md="people"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="appointments">
          <NativeTabs.Trigger.Label>{t("nav.appointments")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "calendar", selected: "calendar" }}
            md="calendar-month"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>{t("nav.settings")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "gearshape", selected: "gearshape.fill" }}
            md="settings"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
