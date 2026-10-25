import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import {
  ART_TZ,
  formatArt,
  formatClientLocal,
  localInputToUtc,
  toInputLocalValue,
} from "../../lib/time";
import { colors } from "../../theme/colors";
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

  const save = async () => {
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
  };

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
    <Screen>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Title>
          {existing ? t("appointments.edit") : t("appointments.add")}
        </Title>
        <Subtitle>{t("appointments.seriesNote")}</Subtitle>

        <Text style={{ color: colors.secondaryLabel, marginBottom: 8, fontWeight: "600" }}>
          {t("appointments.client")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {clients.map((c) => (
            <Chip
              key={c.id}
              label={`${c.firstName} ${c.lastName}`}
              selected={clientId === c.id}
              onPress={() => setClientId(c.id)}
            />
          ))}
        </View>

        {selectedClient && (
          <Card>
            <Text style={{ color: colors.label }}>
              Client TZ: {selectedClient.ianaTz}
            </Text>
            {previewUtc && (
              <Text style={{ color: colors.secondaryLabel, marginTop: 4 }}>
                ART {formatArt(previewUtc)} · origin{" "}
                {formatClientLocal(previewUtc, selectedClient.ianaTz)}
              </Text>
            )}
          </Card>
        )}

        <Field
          label={t("appointments.when")}
          value={localWhen}
          onChangeText={setLocalWhen}
          placeholder="2026-10-25T15:00"
        />
        <Field
          label={t("appointments.duration")}
          value={durationMin}
          onChangeText={setDurationMin}
          keyboardType="numeric"
        />

        <Text style={{ color: colors.secondaryLabel, marginBottom: 8, fontWeight: "600" }}>
          {t("appointments.recurrence")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {RECURRENCE.map((mode) => (
            <Chip
              key={mode}
              label={t(`recurrence.${mode}`)}
              selected={recurrenceMode === mode}
              onPress={() => setRecurrenceMode(mode)}
            />
          ))}
        </View>
        {recurrenceMode === "every_x_days" && (
          <Field
            label="Interval (days)"
            value={intervalDays}
            onChangeText={setIntervalDays}
            keyboardType="numeric"
          />
        )}

        <Text style={{ color: colors.secondaryLabel, marginBottom: 8, fontWeight: "600" }}>
          {t("appointments.reminder")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {REMINDERS.map((r) => (
            <Chip
              key={r}
              label={r}
              selected={reminderOffset === r}
              onPress={() => setReminderOffset(r)}
            />
          ))}
        </View>

        <Text style={{ color: colors.secondaryLabel, marginBottom: 8, fontWeight: "600" }}>
          {t("appointments.status")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {STATUSES.map((s) => (
            <Chip
              key={s}
              label={t(`status.${s}`)}
              selected={status === s}
              onPress={() => setStatus(s)}
            />
          ))}
        </View>

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
      </ScrollView>
    </Screen>
  );
}
