import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { liquidGlassStackScreenOptions } from "../../../src/navigation/liquidGlass";

export default function AppointmentsStackLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={liquidGlassStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: t("appointments.title") }} />
      <Stack.Screen
        name="form"
        options={{
          title: t("appointments.add"),
          headerLargeTitle: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
