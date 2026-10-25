import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { colors } from "../../../src/theme/colors";

export default function ClientsStackLayout() {
  const { t } = useTranslation();
  const isIOS = Platform.OS === "ios";

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.tint,
        headerTitleStyle: { fontWeight: "600" },
        // Let the system draw Liquid Glass nav bar — no custom header background
        headerTransparent: isIOS,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.groupedBackground },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="form"
        options={{
          title: t("clients.add"),
          presentation: "card",
        }}
      />
    </Stack>
  );
}
