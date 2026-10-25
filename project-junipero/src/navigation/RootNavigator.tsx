import React from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/AppStore";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ClientsScreen } from "../screens/clients/ClientsScreen";
import { ClientFormScreen } from "../screens/clients/ClientFormScreen";
import { AppointmentsScreen } from "../screens/appointments/AppointmentsScreen";
import { AppointmentFormScreen } from "../screens/appointments/AppointmentFormScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { colors } from "../theme/colors";
import { AdaptiveGlass } from "../components/Glass";
import {
  AppointmentsStackParamList,
  ClientsStackParamList,
  RootTabParamList,
} from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();
const ClientsStack = createNativeStackNavigator<ClientsStackParamList>();
const AppointmentsStack =
  createNativeStackNavigator<AppointmentsStackParamList>();

const isIOS = Platform.OS === "ios";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
    card: isIOS ? "transparent" : colors.surfaceSolid,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function GlassTabBarBackground() {
  if (!isIOS) {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surfaceSolid }]} />;
  }
  return (
    <AdaptiveGlass
      style={StyleSheet.absoluteFill}
      contentStyle={{ flex: 1, padding: 0 }}
      glassEffectStyle="regular"
      intensity={80}
    />
  );
}

function ClientsNavigator() {
  const { t } = useTranslation();
  return (
    <ClientsStack.Navigator
      screenOptions={{
        headerTransparent: isIOS,
        headerBlurEffect: isIOS ? "systemMaterial" : undefined,
        headerStyle: isIOS ? { backgroundColor: "transparent" } : undefined,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <ClientsStack.Screen
        name="ClientsList"
        component={ClientsScreen}
        options={{ headerShown: false }}
      />
      <ClientsStack.Screen
        name="ClientForm"
        component={ClientFormScreen}
        options={{ title: t("clients.add") }}
      />
    </ClientsStack.Navigator>
  );
}

function AppointmentsNavigator() {
  const { t } = useTranslation();
  return (
    <AppointmentsStack.Navigator
      screenOptions={{
        headerTransparent: isIOS,
        headerBlurEffect: isIOS ? "systemMaterial" : undefined,
        headerStyle: isIOS ? { backgroundColor: "transparent" } : undefined,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <AppointmentsStack.Screen
        name="AppointmentsList"
        component={AppointmentsScreen}
        options={{ headerShown: false }}
      />
      <AppointmentsStack.Screen
        name="AppointmentForm"
        component={AppointmentFormScreen}
        options={{ title: t("appointments.add") }}
      />
    </AppointmentsStack.Navigator>
  );
}

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          position: isIOS ? "absolute" : "relative",
          backgroundColor: isIOS ? "transparent" : colors.surfaceSolid,
          borderTopColor: isIOS ? "transparent" : colors.border,
          borderTopWidth: isIOS ? 0 : StyleSheet.hairlineWidth,
          elevation: 0,
        },
        tabBarBackground: isIOS ? () => <GlassTabBarBackground /> : undefined,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            HomeTab: "home",
            ClientsTab: "people",
            AppointmentsTab: "calendar",
            SettingsTab: "settings",
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: t("nav.home") }}
      />
      <Tab.Screen
        name="ClientsTab"
        component={ClientsNavigator}
        options={{ title: t("nav.clients") }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsNavigator}
        options={{ title: t("nav.appointments") }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: t("nav.settings") }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { ready, session } = useAppStore();

  if (!ready) {
    return (
      <View style={styles.boot}>
        {isIOS ? (
          <BlurView intensity={40} tint="systemMaterial" style={StyleSheet.absoluteFill} />
        ) : null}
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {session ? <MainTabs /> : <SignInScreen />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
