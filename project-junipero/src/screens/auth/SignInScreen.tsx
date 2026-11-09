import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { useTranslation } from "react-i18next";
import {
  Button,
  Field,
  Screen,
  Subtitle,
  Title,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import {
  isAppleConfigured,
  isGoogleConfigured,
  signInWithApple,
  signInWithEmailPassword,
  signInWithGoogle,
} from "../../lib/auth";
import { isSupabaseConfigured } from "../../lib/supabase";

export function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { establishSession, signInDemo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setErrorMessage(null);
    setNotice(null);
    try {
      await action();
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? error.code
          : undefined;
      if (code !== "ERR_REQUEST_CANCELED") {
        setErrorMessage(t("auth.requestFailed"));
      }
    } finally {
      setBusy(false);
    }
  };

  const validateCredentials = () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage(t("auth.emailInvalid"));
      return false;
    }
    if (!password) {
      setErrorMessage(t("auth.passwordRequired"));
      return false;
    }
    return true;
  };

  const onEmailSubmit = () => {
    if (!validateCredentials()) return;
    void run(async () => {
      const session = await signInWithEmailPassword(email.trim(), password);
      await establishSession(session);
    });
  };

  const onGoogle = () =>
    run(async () => {
      const session = await signInWithGoogle();
      if (session) await establishSession(session);
    });

  const onApple = () =>
    run(async () => {
      await establishSession(await signInWithApple());
    });

  const onDemo = () =>
    run(async () => {
      await signInDemo("demo@local.dev", "Demo Therapist");
    });

  const showAppleButton =
    Platform.OS === "ios" && appleAvailable && isAppleConfigured;
  const showGoogleButton = isGoogleConfigured;

  return (
    <Screen scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.brandMark} accessibilityElementsHidden>
            <Text style={styles.brandInitials}>J</Text>
          </View>
          <Title>{t("auth.title")}</Title>
          <Subtitle>{t("auth.welcome")}</Subtitle>
        </View>

        <View style={styles.authCard}>
          <Text style={[typography.headline, styles.sectionTitle]}>
            {t("auth.emailSection")}
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
            autoComplete="password"
            textContentType="password"
            editable={!busy}
            returnKeyType="go"
            onSubmitEditing={onEmailSubmit}
            trailing={
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
            }
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
          label={busy ? t("auth.working") : t("auth.signIn")}
          onPress={onEmailSubmit}
          disabled={busy || !isSupabaseConfigured}
        />
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => router.push("/(auth)/sign-up")}
          style={styles.accountLink}
        >
          <Text style={[typography.subheadline, styles.accountPrompt]}>
            {t("auth.createAccountPrompt")}{" "}
          </Text>
          <Text style={[typography.subheadline, styles.accountAction]}>
            {t("auth.switchToSignUp")}
          </Text>
        </Pressable>

        {showGoogleButton || showAppleButton ? (
          <View style={styles.providers}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[typography.footnote, styles.dividerLabel]}>
                {t("auth.orContinueWith")}
              </Text>
              <View style={styles.dividerLine} />
            </View>
            {showGoogleButton ? (
              <Button
                label={t("auth.google")}
                variant="secondary"
                onPress={onGoogle}
                disabled={busy}
              />
            ) : null}
            {showAppleButton ? (
              <View pointerEvents={busy ? "none" : "auto"}>
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={
                    colorScheme === "dark"
                      ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                      : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                  }
                  cornerRadius={14}
                  onPress={onApple}
                  style={styles.appleButton}
                />
              </View>
            ) : null}
          </View>
        ) : null}

        {!isSupabaseConfigured ? (
          <View style={styles.demoContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[typography.footnote, styles.dividerLabel]}>
                {t("auth.demoDivider")}
              </Text>
              <View style={styles.dividerLine} />
            </View>
            <Text style={[typography.subheadline, styles.demoHint]}>
              {t("auth.demoHint")}
            </Text>
            <Button
              label={t("auth.demo")}
              variant="secondary"
              onPress={onDemo}
              disabled={busy}
            />
          </View>
        ) : null}

        {busy ? (
          <ActivityIndicator
            accessibilityLabel={t("auth.working")}
            color={colors.tint}
            style={styles.activity}
          />
        ) : null}
        <Text style={[typography.footnote, styles.version]}>
          {t("common.version", { version: Constants.expoConfig?.version })}
        </Text>
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
  providers: {
    marginTop: 20,
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
  dividerLabel: {
    color: colors.secondaryLabel,
  },
  appleButton: {
    width: "100%",
    height: 52,
    marginTop: 12,
  },
  demoContainer: {
    marginTop: 16,
    paddingTop: 4,
  },
  demoHint: {
    textAlign: "center",
    marginBottom: 8,
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
  errorText: {
    color: colors.danger,
  },
  notice: {
    backgroundColor: colors.successMuted,
  },
  noticeText: {
    color: colors.success,
  },
  passwordToggle: {
    minHeight: 44,
    justifyContent: "center",
  },
  activity: {
    marginTop: 16,
  },
  version: {
    textAlign: "center",
    marginTop: 24,
  },
});
