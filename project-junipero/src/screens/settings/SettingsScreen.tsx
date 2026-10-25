import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Chip,
  Field,
  Screen,
  Subtitle,
  Title,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { isSupabaseConfigured } from "../../lib/supabase";
import { colors } from "../../theme/colors";
import { ReminderOffset } from "../../types/models";

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
  const [locale, setLocale] = useState(therapist?.preferredLocale ?? "system");

  const save = async () => {
    await updateProfile({
      displayName: name.trim() || therapist?.displayName || "Therapist",
      defaultDurationMin: Number(duration) || 50,
      defaultReminder: reminder,
      preferredLocale: locale,
    });
  };

  return (
    <Screen>
      <ScrollView>
        <Title>{t("settings.title")}</Title>
        <Subtitle>{therapist?.email}</Subtitle>

        <Card>
          <Text style={{ fontWeight: "700", color: colors.text, marginBottom: 8 }}>
            {t("settings.profile")}
          </Text>
          <Field label={t("settings.name")} value={name} onChangeText={setName} />
          <Field
            label={t("settings.defaultDuration")}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </Card>

        <Card>
          <Text style={{ fontWeight: "700", color: colors.text, marginBottom: 8 }}>
            {t("settings.notifications")}
          </Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            {t("settings.defaultReminder")}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {(["15m", "1h", "24h"] as ReminderOffset[]).map((r) => (
              <Chip
                key={r}
                label={r}
                selected={reminder === r}
                onPress={() => setReminder(r)}
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={{ fontWeight: "700", color: colors.text, marginBottom: 8 }}>
            {t("settings.language")}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {(
              [
                ["system", "System default"],
                ["en", "English"],
                ["es", "Español"],
              ] as const
            ).map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                selected={locale === key}
                onPress={() => setLocale(key)}
              />
            ))}
          </View>
        </Card>

        <Card>
          <Text style={{ fontWeight: "700", color: colors.text, marginBottom: 8 }}>
            {t("settings.sync")}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {isSupabaseConfigured
              ? t("settings.syncOn")
              : t("settings.syncOff")}
          </Text>
        </Card>

        <Button label={t("common.confirm")} onPress={save} />
        <Button label={t("settings.signOut")} variant="danger" onPress={signOut} />
      </ScrollView>
    </Screen>
  );
}
