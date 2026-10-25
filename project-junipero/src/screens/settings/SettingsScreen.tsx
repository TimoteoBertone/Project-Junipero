import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Button,
  Chip,
  ChipRow,
  Footnote,
  FormRow,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { isSupabaseConfigured } from "../../lib/supabase";
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
    <Screen scroll>
      {therapist?.email ? <Footnote>{therapist.email}</Footnote> : null}

      <Section title={t("settings.profile")}>
        <FormRow
          label={t("settings.name")}
          value={name}
          onChangeText={setName}
        />
        <FormRow
          label={t("settings.defaultDuration")}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          last
        />
      </Section>

      <Section title={t("settings.notifications")} footer={t("settings.defaultReminder")}>
        <View style={{ padding: 16 }}>
          <ChipRow>
            {(["15m", "1h", "24h"] as ReminderOffset[]).map((r) => (
              <Chip
                key={r}
                label={r}
                selected={reminder === r}
                onPress={() => setReminder(r)}
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
                ["system", "System"],
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

      <Button label={t("common.confirm")} onPress={save} />
      <Button label={t("settings.signOut")} variant="danger" onPress={signOut} />
    </Screen>
  );
}
