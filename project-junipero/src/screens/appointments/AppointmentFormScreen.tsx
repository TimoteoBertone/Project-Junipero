import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { HeaderSaveButton } from "../../components/HeaderActions";
import { AppointmentDateTimeFields } from "../../components/AppointmentDateTimeFields";
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
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import {
  ART_TZ,
  displayArtDate,
  formatArt,
  formatClientLocal,
  wallClockToUtc,
} from "../../lib/time";
import { toZonedTime } from "date-fns-tz";
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
  const { t, i18n } = useTranslation();
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
    existing?.clientId ?? ""
  );
  const selectedClient = clients.find((c) => c.id === clientId);
  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const filteredClients = useMemo(() => {
    const normalizeSearch = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
    const query = normalizeSearch(clientSearch.trim());
    if (!query) return clients;
    return clients.filter((client) =>
      normalizeSearch(
        `${client.firstName} ${client.lastName} ${client.nickname ?? ""}`
      ).includes(query)
    );
  }, [clientSearch, clients]);

  const [wallClock, setWallClock] = useState(() =>
    toZonedTime(
      existing ? new Date(existing.startsAtUtc) : new Date(),
      ART_TZ
    )
  );
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
      return wallClockToUtc(wallClock, ART_TZ);
    } catch {
      return null;
    }
  }, [wallClock]);

  const save = useCallback(async () => {
    if (!clientId || !selectedClient) {
      Alert.alert(
        t("appointments.clientRequiredTitle"),
        t("appointments.clientRequiredMessage")
      );
      return;
    }
    if (!previewUtc) {
      Alert.alert(
        t("appointments.invalidTimeTitle"),
        t("appointments.invalidTimeMessage")
      );
      return;
    }
    const duration = Number(durationMin);
    if (!Number.isInteger(duration) || duration <= 0) {
      Alert.alert(t("appointments.validationError"), t("appointments.invalidDuration"));
      return;
    }
    const interval = Number(intervalDays);
    if (
      recurrenceMode === "every_x_days" &&
      (!Number.isInteger(interval) || interval <= 0)
    ) {
      Alert.alert(t("appointments.validationError"), t("appointments.invalidInterval"));
      return;
    }
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
          recurrenceMode === "every_x_days" ? interval : undefined,
        seriesId: existing?.seriesId,
        exceptionOf: existing?.exceptionOf,
        originalStartsAtUtc: existing?.originalStartsAtUtc,
      });
      router.back();
    } catch (e) {
      const isOverlap =
        e instanceof Error && e.message.startsWith("ART schedule overlap");
      Alert.alert(
        isOverlap ? t("appointments.overlapError") : t("common.systemError"),
        isOverlap
          ? t("appointments.overlapHint")
          : e instanceof Error
            ? e.message
            : String(e)
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
    });
  }, [existing, navigation, t]);

  const onCancelOccurrence = () => {
    if (!existing) return;
    Alert.alert(
      t("appointments.cancelOccurrence"),
      t("appointments.cancelOccurrenceConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("appointments.cancelOccurrence"),
          style: "destructive",
          onPress: async () => {
            await cancelOccurrence(existing.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <HeaderSaveButton label={t("appointments.save")} onPress={save} />
      <Screen
        scroll
        keyboardAware={!clientPickerVisible}
        style={{ paddingTop: Platform.OS === "ios" ? 8 : 4 }}
      >
      {existing && existing.recurrenceMode !== "once" ? (
        <Footnote>{t("appointments.seriesNote")}</Footnote>
      ) : null}

      <Section title={t("appointments.client")}>
        <ListRow
          title={
            selectedClient
              ? selectedClient.nickname
                ? `${selectedClient.firstName} ${selectedClient.lastName} (${selectedClient.nickname})`
                : `${selectedClient.firstName} ${selectedClient.lastName}`
              : t("appointments.selectClient")
          }
          subtitle={selectedClient?.ianaTz}
          onPress={() => {
            setClientSearch("");
            setClientPickerVisible(true);
          }}
          last
        />
      </Section>

      <Modal
        visible={clientPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClientPickerVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable
            accessibilityLabel={t("common.cancel")}
            style={styles.modalBackdrop}
            onPress={() => setClientPickerVisible(false)}
          />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={[typography.headline, styles.pickerTitle]}>
                {t("appointments.selectClient")}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setClientPickerVisible(false)}
                hitSlop={10}
              >
                <Text style={[typography.subheadline, styles.closeLabel]}>
                  {t("common.cancel")}
                </Text>
              </Pressable>
            </View>
            <TextInput
              value={clientSearch}
              onChangeText={setClientSearch}
              placeholder={t("appointments.searchClients")}
              placeholderTextColor={colors.tertiaryLabel}
              accessibilityLabel={t("appointments.searchClients")}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
              style={[typography.body, styles.searchInput]}
            />
            <FlatList
              data={filteredClients}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={[typography.subheadline, styles.emptyResults]}>
                  {t("appointments.noClientResults")}
                </Text>
              }
              renderItem={({ item, index }) => (
                <ListRow
                  title={
                    item.nickname
                      ? `${item.firstName} ${item.lastName} (${item.nickname})`
                      : `${item.firstName} ${item.lastName}`
                  }
                  subtitle={`${item.nickname ? `${item.nickname} · ` : ""}${item.ianaTz}`}
                  detail={clientId === item.id ? "✓" : undefined}
                  last={index === filteredClients.length - 1}
                  showChevron={false}
                  onPress={() => {
                    setClientId(item.id);
                    setClientPickerVisible(false);
                  }}
                />
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {selectedClient && previewUtc ? (
        <Section title={t("common.preview")}>
          <ListRow
            title={displayArtDate(
              previewUtc,
              i18n.resolvedLanguage?.startsWith("es") ? "es-AR" : "en-US",
              true
            )}
            subtitle={t("home.localVsOrigin", {
              art: formatArt(previewUtc),
              origin: formatClientLocal(previewUtc, selectedClient.ianaTz),
            })}
            last
          />
        </Section>
      ) : null}

      <Section title={t("appointments.when")}>
        <AppointmentDateTimeFields
          value={wallClock}
          onChange={setWallClock}
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
            label={t("appointments.interval")}
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

      {existing && (
        <Button
          label={t("appointments.cancelOccurrence")}
          variant="danger"
          onPress={onCancelOccurrence}
        />
      )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  pickerSheet: {
    height: "70%",
    maxHeight: "85%",
    minHeight: "45%",
    backgroundColor: colors.groupedBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  pickerHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pickerTitle: {
    color: colors.label,
  },
  closeLabel: {
    color: colors.tint,
  },
  searchInput: {
    minHeight: 48,
    backgroundColor: colors.secondaryGrouped,
    borderColor: colors.separator,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    color: colors.label,
  },
  emptyResults: {
    color: colors.secondaryLabel,
    textAlign: "center",
    paddingVertical: 28,
  },
});
