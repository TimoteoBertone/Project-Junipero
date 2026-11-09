import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Chip,
  ChipRow,
  FormRow,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { isSupabaseConfigured } from "../../lib/supabase";
import { ReminderOffset } from "../../types/models";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function SettingsScreen() {
  const { t } = useTranslation();
  const { session, updateProfile, signOut } = useAppStore();
  const therapist = session?.therapist;

  const [name, setName] = useState(therapist?.displayName ?? "");
  const [duration, setDuration] = useState(
    String(therapist?.defaultDurationMin ?? 50)
  );
  const [reminder, setReminder] = useState<ReminderOffset>(
    therapist?.defaultReminder ?? "1h"
  );
  const [locale, setLocale] = useState<"system" | "en" | "es">(() => {
    const preferred = therapist?.preferredLocale;
    return preferred === "en" || preferred === "es" ? preferred : "system";
  });
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<"saved" | "error" | null>(
    null
  );
  useEffect(() => {
    if (saveFeedback !== "saved") return;
    const timeout = setTimeout(() => setSaveFeedback(null), 20_000);
    return () => clearTimeout(timeout);
  }, [saveFeedback]);
  const savedLocale =
    therapist?.preferredLocale === "en" || therapist?.preferredLocale === "es"
      ? therapist.preferredLocale
      : "system";
  const parsedDuration = Number(duration);
  const savedDuration = therapist?.defaultDurationMin ?? 50;
  const hasChanges =
    name.trim() !== (therapist?.displayName ?? "") ||
    (Number.isFinite(parsedDuration) && parsedDuration > 0
      ? parsedDuration
      : 50) !== savedDuration ||
    reminder !== (therapist?.defaultReminder ?? "1h") ||
    locale !== savedLocale;

  const save = useCallback(async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    setSaveFeedback(null);
    try {
      await updateProfile({
        displayName:
          name.trim() || therapist?.displayName || t("settings.defaultName"),
        defaultDurationMin: Number(duration) || 50,
        defaultReminder: reminder,
        preferredLocale: locale,
      });
      setSaveFeedback("saved");
    } catch {
      setSaveFeedback("error");
    } finally {
      setSaving(false);
    }
  }, [
    hasChanges,
    saving,
    updateProfile,
    name,
    therapist,
    t,
    duration,
    reminder,
    locale,
  ]);
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={Platform.OS === "ios" ? "checkmark" : undefined}
          variant={Platform.OS === "ios" ? "prominent" : "done"}
          separateBackground
          tintColor={Platform.OS === "ios" ? "#C7425D" : colors.tint}
          accessibilityLabel={saving ? t("settings.saving") : t("settings.save")}
          onPress={() => void save()}
          disabled={!hasChanges || saving}
        >
          {Platform.OS === "ios" ? undefined : t("settings.save")}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Screen
        scroll
        style={{ paddingTop: Platform.OS === "ios" ? 8 : 4 }}
      >
        {saveFeedback ? (
          <View
            accessibilityRole={saveFeedback === "error" ? "alert" : "text"}
            style={[
              styles.saveFeedback,
              saveFeedback === "error"
                ? styles.saveError
                : styles.saveSuccess,
            ]}
          >
            <Text
              style={[
                typography.callout,
                saveFeedback === "error"
                  ? styles.saveErrorText
                  : styles.saveSuccessText,
              ]}
            >
              {t(
                saveFeedback === "error"
                  ? "settings.saveFailed"
                  : "settings.saved"
              )}
            </Text>
          </View>
        ) : null}
        <Section title={t("settings.profile")} footer={therapist?.email}>
          <FormRow
            label={t("settings.name")}
            value={name}
            onChangeText={(value) => {
              setName(value);
              setSaveFeedback(null);
            }}
          />
          <FormRow
            label={t("settings.defaultDuration")}
            value={duration}
            onChangeText={(value) => {
              setDuration(value);
              setSaveFeedback(null);
            }}
            keyboardType="numeric"
            last
          />
        </Section>

        <Section
          title={t("settings.notifications")}
          footer={t("settings.defaultReminder")}
        >
          <View style={{ padding: 16 }}>
            <ChipRow>
              {(["15m", "1h", "24h"] as ReminderOffset[]).map((r) => (
                <Chip
                  key={r}
                  label={r}
                  selected={reminder === r}
                  onPress={() => {
                    setReminder(r);
                    setSaveFeedback(null);
                  }}
                />
              ))}
            </ChipRow>
          </View>
        </Section>

        <Section title={t("settings.language")}>
          <View style={{ padding: 16 }}>
            <ChipRow>
              {(
                [
                  ["system", t("settings.languageOptions.system")],
                  ["en", t("settings.languageOptions.en")],
                  ["es", t("settings.languageOptions.es")],
                ] as const
              ).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  selected={locale === key}
                  onPress={() => {
                    setLocale(key);
                    setSaveFeedback(null);
                  }}
                />
              ))}
            </ChipRow>
          </View>
        </Section>

        <Section title={t("settings.sync")}>
          <ListRow
            title={
              isSupabaseConfigured ? t("settings.syncOn") : t("settings.syncOff")
            }
            last
          />
        </Section>

        <Section title={t("common.account")}>
          <ListRow
            title={t("settings.signOut")}
            destructive
            onPress={signOut}
            last
          />
        </Section>
        <Text style={[typography.footnote, styles.version]}>
          {t("common.version", { version: Constants.expoConfig?.version })}
        </Text>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  saveFeedback: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  saveSuccess: {
    backgroundColor: colors.successMuted,
  },
  saveSuccessText: {
    color: colors.success,
  },
  saveError: {
    backgroundColor: colors.dangerMuted,
  },
  saveErrorText: {
    color: colors.danger,
  },
  version: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
});
