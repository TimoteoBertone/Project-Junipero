import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { liquidGlassStackScreenOptions } from "../../../src/navigation/liquidGlass";

export default function SettingsStackLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={liquidGlassStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: t("settings.title") }} />
    </Stack>
  );
}
