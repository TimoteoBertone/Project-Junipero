import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { colors } from "../../../src/theme/colors";

export default function AppointmentsStackLayout() {
  const { t } = useTranslation();
  const isIOS = Platform.OS === "ios";

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.tint,
        headerTitleStyle: { fontWeight: "600" },
        headerTransparent: isIOS,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.groupedBackground },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="form"
        options={{
          title: t("appointments.add"),
          presentation: "card",
        }}
      />
    </Stack>
  );
}
