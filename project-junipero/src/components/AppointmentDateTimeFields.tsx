import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useTranslation } from "react-i18next";
import { colors, getThemeColors } from "../theme/colors";
import { typography } from "../theme/typography";

type PickerMode = "date" | "time";

function mergeWallClockValue(
  current: Date,
  selected: Date,
  mode: PickerMode
): Date {
  if (mode === "date") {
    return new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate(),
      current.getHours(),
      current.getMinutes()
    );
  }

  return new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    selected.getHours(),
    selected.getMinutes()
  );
}

function DateTimeField({
  label,
  value,
  mode,
  locale,
  onChange,
}: {
  label: string;
  value: Date;
  mode: PickerMode;
  locale: string;
  onChange: (value: Date) => void;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const accentColor = getThemeColors(colorScheme === "dark").tint;
  const displayValue = new Intl.DateTimeFormat(locale.replace("_", "-"), {
    ...(mode === "date"
      ? { weekday: "short", day: "numeric", month: "short", year: "numeric" }
      : { hour: "2-digit", minute: "2-digit", hour12: false }),
  }).format(value);

  const picker = (
    <DateTimePicker
      value={value}
      mode={mode}
      display={Platform.OS === "ios" ? "compact" : "default"}
      presentation={Platform.OS === "android" ? "dialog" : undefined}
      locale={Platform.OS === "ios" ? locale : undefined}
      is24Hour
      accentColor={accentColor}
      positiveButton={{ label: t("common.confirm") }}
      negativeButton={{ label: t("common.cancel") }}
      onValueChange={(_, selectedDate) => {
        onChange(mergeWallClockValue(value, selectedDate, mode));
        setDialogVisible(false);
      }}
      onDismiss={() => setDialogVisible(false)}
    />
  );

  return (
    <View style={styles.row}>
      <Text style={[typography.callout, styles.label]}>{label}</Text>
      {Platform.OS === "ios" ? (
        <View style={styles.nativePicker}>{picker}</View>
      ) : (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${displayValue}`}
            android_ripple={{ color: colors.tintMuted }}
            onPress={() => setDialogVisible(true)}
            style={styles.valueButton}
          >
            <Text style={[typography.callout, styles.value]} numberOfLines={1}>
              {displayValue}
            </Text>
          </Pressable>
          {dialogVisible ? picker : null}
        </>
      )}
    </View>
  );
}

export function AppointmentDateTimeFields({
  value,
  onChange,
}: {
  value: Date;
  onChange: (value: Date) => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith("es") ? "es_AR" : "en_US";

  return (
    <View>
      <DateTimeField
        label={t("appointments.date")}
        value={value}
        mode="date"
        locale={locale}
        onChange={onChange}
      />
      <View style={styles.separator} />
      <DateTimeField
        label={t("appointments.time")}
        value={value}
        mode="time"
        locale={locale}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  label: {
    flex: 1,
  },
  nativePicker: {
    alignItems: "flex-end",
  },
  valueButton: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  value: {
    color: colors.tint,
    fontWeight: "600",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: colors.separator,
  },
});
