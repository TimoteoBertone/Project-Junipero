import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
import {
  ART_TZ,
  formatArt,
  formatClientLocal,
  localInputToUtc,
  toInputLocalValue,
} from "../../lib/time";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import {
  AppointmentStatus,
  RecurrenceMode,
  ReminderOffset,
} from "../../types/models";

const RECURRENCE: RecurrenceMode[] = [
  "once",
  "every_x_days",
  "weekly",
  "biweekly",
  "monthly",
];
const REMINDERS: ReminderOffset[] = ["15m", "1h", "24h"];
const STATUSES: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
];

export function AppointmentFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const appointmentId =
    typeof params.appointmentId === "string" ? params.appointmentId : undefined;
  const {
    appointments,
    clients,
    session,
    upsertAppointment,
    cancelOccurrence,
  } = useAppStore();

  const existing = appointments.find((a) => a.id === appointmentId);

  const [clientId, setClientId] = useState(
    existing?.clientId ?? clients[0]?.id ?? ""
  );
  const selectedClient = clients.find((c) => c.id === clientId);

  const defaultLocal = existing
    ? toInputLocalValue(existing.startsAtUtc, ART_TZ)
    : toInputLocalValue(new Date().toISOString(), ART_TZ);

  const [localWhen, setLocalWhen] = useState(defaultLocal);
  const [durationMin, setDurationMin] = useState(
    String(existing?.durationMin ?? session?.therapist.defaultDurationMin ?? 50)
  );
  const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceMode>(
    existing?.recurrenceMode ?? "once"
  );
  const [intervalDays, setIntervalDays] = useState(
    String(existing?.recurrenceIntervalDays ?? 3)
  );
  const [reminderOffset, setReminderOffset] = useState<ReminderOffset>(
    existing?.reminderOffset ?? session?.therapist.defaultReminder ?? "1h"
  );
  const [status, setStatus] = useState<AppointmentStatus>(
    existing?.status ?? "scheduled"
  );

  const previewUtc = useMemo(() => {
    try {
      return localInputToUtc(localWhen, ART_TZ);
    } catch {
      return null;
    }
  }, [localWhen]);

  const save = useCallback(async () => {
    if (!clientId || !selectedClient) {
      Alert.alert("Client required", "Select a client first.");
      return;
    }
    if (!previewUtc) {
      Alert.alert("Invalid time", "Use format YYYY-MM-DDTHH:mm");
      return;
    }
    const duration = Number(durationMin) || 50;
    try {
      await upsertAppointment({
        ...(existing?.id ? { id: existing.id } : {}),
        clientId,
        startsAtUtc: previewUtc,
        durationMin: duration,
        clientIanaTz: selectedClient.ianaTz,
        status,
        reminderOffset,
        recurrenceMode,
        recurrenceIntervalDays:
          recurrenceMode === "every_x_days" ? Number(intervalDays) || 1 : undefined,
        seriesId: existing?.seriesId,
        exceptionOf: existing?.exceptionOf,
        originalStartsAtUtc: existing?.originalStartsAtUtc,
      });
      router.back();
    } catch (e) {
      Alert.alert(
        t("appointments.overlapError"),
        e instanceof Error ? e.message : String(e)
      );
    }
  }, [
    clientId,
    selectedClient,
    previewUtc,
    durationMin,
    upsertAppointment,
    existing,
    status,
    reminderOffset,
    recurrenceMode,
    intervalDays,
    router,
    t,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: existing ? t("appointments.edit") : t("appointments.add"),
      headerRight: () => (
        <Pressable
          onPress={save}
          hitSlop={12}
          accessibilityRole="button"
          style={{
            paddingHorizontal: 8,
            minHeight: 44,
            justifyContent: "center",
          }}
        >
          <Text style={[typography.headline, { color: colors.tint }]}>
            {t("appointments.save")}
          </Text>
        </Pressable>
      ),
    });
  }, [existing, navigation, save, t]);

  const onCancelOccurrence = () => {
    if (!existing) return;
    Alert.alert(t("appointments.cancelOccurrence"), t("appointments.seriesNote"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.confirm"),
        style: "destructive",
        onPress: async () => {
          await cancelOccurrence(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scroll headerAware>
      <Footnote>{t("appointments.seriesNote")}</Footnote>

      <Section title={t("appointments.client")}>
        {clients.map((c, index) => (
          <ListRow
            key={c.id}
            title={`${c.firstName} ${c.lastName}`}
            subtitle={c.ianaTz}
            detail={clientId === c.id ? "✓" : undefined}
            last={index === clients.length - 1}
            showChevron={false}
            onPress={() => setClientId(c.id)}
          />
        ))}
      </Section>

      {selectedClient && previewUtc ? (
        <Section title={t("common.preview")}>
          <ListRow
            title={`ART ${formatArt(previewUtc)}`}
            subtitle={formatClientLocal(previewUtc, selectedClient.ianaTz)}
            last
          />
        </Section>
      ) : null}

      <Section title={t("appointments.when")}>
        <FormRow
          label={t("appointments.when")}
          value={localWhen}
          onChangeText={setLocalWhen}
          placeholder="2026-10-25T15:00"
        />
        <FormRow
          label={t("appointments.duration")}
          value={durationMin}
          onChangeText={setDurationMin}
          keyboardType="numeric"
          last
        />
      </Section>

      <Section title={t("appointments.recurrence")}>
        <View style={{ padding: 16 }}>
          <ChipRow>
            {RECURRENCE.map((mode) => (
              <Chip
                key={mode}
                label={t(`recurrence.${mode}`)}
                selected={recurrenceMode === mode}
                onPress={() => setRecurrenceMode(mode)}
              />
            ))}
          </ChipRow>
        </View>
        {recurrenceMode === "every_x_days" ? (
          <FormRow
            label="Interval"
            value={intervalDays}
            onChangeText={setIntervalDays}
            keyboardType="numeric"
            last
          />
        ) : null}
      </Section>

      <Section title={t("appointments.reminder")}>
        <View style={{ padding: 16 }}>
          <ChipRow>
            {REMINDERS.map((r) => (
              <Chip
                key={r}
                label={r}
                selected={reminderOffset === r}
                onPress={() => setReminderOffset(r)}
              />
            ))}
          </ChipRow>
        </View>
      </Section>

      <Section title={t("appointments.status")}>
        <View style={{ padding: 16 }}>
          <ChipRow>
            {STATUSES.map((s) => (
              <Chip
                key={s}
                label={t(`status.${s}`)}
                selected={status === s}
                onPress={() => setStatus(s)}
              />
            ))}
          </ChipRow>
        </View>
      </Section>

      <Button label={t("appointments.save")} onPress={save} />
      {existing && (
        <Button
          label={t("appointments.cancelOccurrence")}
          variant="danger"
          onPress={onCancelOccurrence}
        />
      )}
      <Button
        label={t("common.cancel")}
        variant="ghost"
        onPress={() => router.back()}
      />
    </Screen>
  );
}
