import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useTranslation } from "react-i18next";
import { Button, Field, Screen, Subtitle, Title } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { colors } from "../../theme/colors";
import {
  isAppleConfigured,
  isGoogleConfigured,
  signInWithApple,
  signInWithEmailPassword,
  signInWithGoogle,
  signUpWithEmailPassword,
} from "../../lib/auth";
import { missingAppleKeys, missingGoogleKeys } from "../../config/env";

export function SignInScreen() {
  const { t } = useTranslation();
  const { establishSession, signInDemo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (e) {
      Alert.alert(
        t("auth.errorTitle"),
        e instanceof Error ? e.message : String(e)
      );
    } finally {
      setBusy(false);
    }
  };

  const onSignIn = () =>
    run(async () => {
      if (!email.trim() || !password) {
        throw new Error(t("auth.credentialsRequired"));
      }
      const session = await signInWithEmailPassword(
        email.trim(),
        password
      );
      await establishSession(session);
    });

  const onSignUp = () =>
    run(async () => {
      if (!email.trim() || !password) {
        throw new Error(t("auth.credentialsRequired"));
      }
      const session = await signUpWithEmailPassword(
        email.trim(),
        password
      );
      await establishSession(session);
    });

  const onGoogle = () =>
    run(async () => {
      if (!isGoogleConfigured) {
        throw new Error(
          `${t("auth.missingKeys")}: ${missingGoogleKeys().join(", ")}`
        );
      }
      const session = await signInWithGoogle();
      await establishSession(session);
    });

  const onApple = () =>
    run(async () => {
      if (!isAppleConfigured) {
        throw new Error(
          `${t("auth.missingKeys")}: ${missingAppleKeys().join(", ")}`
        );
      }
      const session = await signInWithApple();
      await establishSession(session);
    });

  const onDemo = () =>
    run(async () => {
      await signInDemo("demo@local.dev", "Demo Therapist");
    });

  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 48 }}
      >
        <Title>{t("auth.title")}</Title>
        <Subtitle>{t("auth.subtitle")}</Subtitle>

        <Field
          label={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder={t("auth.emailPlaceholder")}
          autoComplete="email"
          textContentType="emailAddress"
        />
        <Field
          label={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t("auth.passwordPlaceholder")}
          autoComplete="password"
          textContentType="password"
        />

        <Button
          label={t("auth.signIn")}
          onPress={onSignIn}
          disabled={busy}
        />
        <Button
          label={t("auth.signUp")}
          variant="secondary"
          onPress={onSignUp}
          disabled={busy}
        />

        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <Text style={{ color: colors.textSecondary }}>{t("auth.or")}</Text>
        </View>

        <Button
          label={t("auth.google")}
          variant="secondary"
          onPress={onGoogle}
          disabled={busy}
        />

        {(Platform.OS === "ios" || appleAvailable) && (
          <Button
            label={t("auth.apple")}
            variant="secondary"
            onPress={onApple}
            disabled={busy}
          />
        )}

        <Button
          label={t("auth.demo")}
          variant="ghost"
          onPress={onDemo}
          disabled={busy}
        />
      </ScrollView>
    </Screen>
  );
}
