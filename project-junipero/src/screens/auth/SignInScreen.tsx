import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button, Field, Screen, Subtitle, Title } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { colors } from "../../theme/colors";
import { isSupabaseConfigured } from "../../lib/supabase";

export function SignInScreen() {
  const { t } = useTranslation();
  const { signInDemo } = useAppStore();
  const [email, setEmail] = useState("therapist@example.com");
  const [password, setPassword] = useState("demo-password");
  const [busy, setBusy] = useState(false);

  const enterDemo = async () => {
    setBusy(true);
    try {
      await signInDemo(email.trim() || "therapist@example.com", "Demo Therapist");
    } finally {
      setBusy(false);
    }
  };

  const socialStub = (provider: string) => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        provider,
        "Configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable OAuth. Use demo mode for now."
      );
      return;
    }
    Alert.alert(provider, "Wire expo-auth-session + Supabase Auth for production.");
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: 48 }}>
        <Title>{t("auth.title")}</Title>
        <Subtitle>{t("auth.subtitle")}</Subtitle>

        <Field
          label={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Field
          label={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          label={t("auth.signIn")}
          onPress={enterDemo}
          disabled={busy}
        />
        <Button
          label={t("auth.signUp")}
          variant="secondary"
          onPress={enterDemo}
          disabled={busy}
        />

        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <Text style={{ color: colors.textSecondary }}>{t("auth.or")}</Text>
        </View>

        <Button
          label={t("auth.google")}
          variant="secondary"
          onPress={() => socialStub("Google")}
        />
        {Platform.OS === "ios" && (
          <Button
            label={t("auth.apple")}
            variant="secondary"
            onPress={() => socialStub("Apple ID")}
          />
        )}
        <Button
          label={t("auth.demo")}
          variant="ghost"
          onPress={enterDemo}
          disabled={busy}
        />
      </ScrollView>
    </Screen>
  );
}
