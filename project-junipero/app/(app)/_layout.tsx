import React from "react";
import { NativeTabs } from "expo-router/native-tabs";
import { useTranslation } from "react-i18next";
import { colors } from "../../src/theme/colors";

/**
 * Native UITabBarController — on iOS 26+ the system draws Liquid Glass.
 * Do NOT set custom tabBar backgrounds (Apple HIG / Adopting Liquid Glass).
 */
export default function AppTabsLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      tintColor={colors.tint}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("nav.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="clients">
        <NativeTabs.Trigger.Label>{t("nav.clients")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person.2", selected: "person.2.fill" }} md="people" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="appointments">
        <NativeTabs.Trigger.Label>{t("nav.appointments")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "calendar", selected: "calendar" }} md="calendar-month" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>{t("nav.settings")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
