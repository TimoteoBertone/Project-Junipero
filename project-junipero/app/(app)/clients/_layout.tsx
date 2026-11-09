import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { liquidGlassStackScreenOptions } from "../../../src/navigation/liquidGlass";

export default function ClientsStackLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={liquidGlassStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: t("clients.title") }} />
      <Stack.Screen
        name="form"
        options={{
          title: t("clients.add"),
          headerLargeTitle: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
