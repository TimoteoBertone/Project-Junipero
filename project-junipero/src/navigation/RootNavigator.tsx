import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
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
import {
  AppointmentsStackParamList,
  ClientsStackParamList,
  RootTabParamList,
} from "./types";

const Tab = createBottomTabNavigator<RootTabParamList>();
const ClientsStack = createNativeStackNavigator<ClientsStackParamList>();
const AppointmentsStack =
  createNativeStackNavigator<AppointmentsStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function ClientsNavigator() {
  const { t } = useTranslation();
  return (
    <ClientsStack.Navigator>
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
    <AppointmentsStack.Navigator>
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
          backgroundColor: Platform.select({
            ios: "rgba(255,255,255,0.94)",
            default: colors.surface,
          }),
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            HomeTab: "home-outline",
            ClientsTab: "people-outline",
            AppointmentsTab: "calendar-outline",
            SettingsTab: "settings-outline",
          };
          return (
            <Ionicons name={map[route.name]} size={size} color={color} />
          );
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {session ? <MainTabs /> : <SignInScreen />}
    </NavigationContainer>
  );
}
