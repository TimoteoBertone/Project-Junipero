import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Button, Field, Screen, Subtitle, Title } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { signUpWithEmailPassword } from "../../lib/auth";
import { isSupabaseConfigured } from "../../lib/supabase";

export function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { establishSession } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = async () => {
    if (busy) return;
    setErrorMessage(null);
    setNotice(null);
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage(t("auth.emailInvalid"));
      return;
    }
    if (password.length < 8) {
      setErrorMessage(t("auth.passwordMinLength"));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t("auth.passwordsDoNotMatch"));
      return;
    }

    setBusy(true);
    try {
      const session = await signUpWithEmailPassword(normalizedEmail, password);
      if (session) {
        await establishSession(session);
      } else {
        setNotice(t("auth.emailConfirmationMessage"));
      }
    } catch {
      setErrorMessage(t("auth.requestFailed"));
    } finally {
      setBusy(false);
    }
  };

  const passwordTrailing = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(
        passwordVisible ? "auth.hidePassword" : "auth.showPassword"
      )}
      accessibilityState={{ selected: passwordVisible }}
      onPress={() => setPasswordVisible((visible) => !visible)}
      disabled={busy}
      hitSlop={8}
      style={styles.passwordToggle}
    >
      <Ionicons
        name={passwordVisible ? "eye-off-outline" : "eye-outline"}
        size={21}
        color={colorScheme === "dark" ? "#8FC8B4" : "#356B5E"}
      />
    </Pressable>
  );

  return (
    <Screen scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.brandMark} accessibilityElementsHidden>
            <Text style={styles.brandInitials}>J</Text>
          </View>
          <Title>{t("auth.title")}</Title>
          <Subtitle>{t("auth.signUpWelcome")}</Subtitle>
        </View>

        <View style={styles.authCard}>
          <Text style={[typography.headline, styles.sectionTitle]}>
            {t("auth.emailSignUpSection")}
          </Text>
          <Field
            label={t("auth.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder={t("auth.emailPlaceholder")}
            autoComplete="email"
            textContentType="emailAddress"
            editable={!busy}
            returnKeyType="next"
          />
          <Field
            label={t("auth.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholder={t("auth.passwordPlaceholder")}
            autoComplete="new-password"
            textContentType="newPassword"
            editable={!busy}
            returnKeyType="next"
            trailing={passwordTrailing}
          />
          <Field
            label={t("auth.confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!passwordVisible}
            placeholder={t("auth.passwordPlaceholder")}
            autoComplete="new-password"
            textContentType="newPassword"
            editable={!busy}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            trailing={passwordTrailing}
          />
        </View>

        {errorMessage ? (
          <View
            accessibilityRole="alert"
            style={[styles.message, styles.errorMessage]}
          >
            <Text style={[typography.callout, styles.errorText]}>
              {errorMessage}
            </Text>
          </View>
        ) : null}
        {notice ? (
          <View accessibilityRole="text" style={[styles.message, styles.notice]}>
            <Text style={[typography.callout, styles.noticeText]}>{notice}</Text>
          </View>
        ) : null}
        {!isSupabaseConfigured ? (
          <View style={[styles.message, styles.configurationNotice]}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colorScheme === "dark" ? "#8FC8B4" : "#356B5E"}
            />
            <Text style={[typography.footnote, styles.configurationText]}>
              {t("auth.configurationNeeded")}
            </Text>
          </View>
        ) : null}

        <Button
          label={busy ? t("auth.working") : t("auth.signUp")}
          onPress={() => void onSubmit()}
          disabled={busy || !isSupabaseConfigured}
        />
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(auth)/sign-in");
            }
          }}
          style={styles.accountLink}
        >
          <Text style={[typography.subheadline, styles.accountPrompt]}>
            {t("auth.existingAccountPrompt")}{" "}
          </Text>
          <Text style={[typography.subheadline, styles.accountAction]}>
            {t("auth.switchToSignIn")}
          </Text>
        </Pressable>
        {busy ? (
          <ActivityIndicator
            accessibilityLabel={t("auth.working")}
            color={colors.tint}
            style={styles.activity}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
    paddingBottom: 24,
  },
  hero: {
    alignItems: "center",
    paddingTop: 28,
    marginBottom: 20,
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.tintMuted,
    marginBottom: 20,
  },
  brandInitials: {
    color: colors.tint,
    fontSize: 32,
    fontWeight: "700",
  },
  authCard: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: 20,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  accountLink: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  accountPrompt: {
    color: colors.secondaryLabel,
  },
  accountAction: {
    color: colors.tint,
    fontWeight: "600",
  },
  passwordToggle: {
    minHeight: 44,
    justifyContent: "center",
  },
  message: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  errorMessage: {
    backgroundColor: colors.dangerMuted,
  },
  errorText: {
    color: colors.danger,
  },
  notice: {
    backgroundColor: colors.successMuted,
  },
  noticeText: {
    color: colors.success,
  },
  configurationNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.tintMuted,
    marginTop: 14,
    marginBottom: 4,
  },
  configurationText: {
    flex: 1,
    color: colors.secondaryLabel,
  },
  activity: {
    marginTop: 16,
  },
});
