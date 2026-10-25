import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button, Card, Empty, Screen, Subtitle } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { formatArt, formatClientLocal, displayArtDate } from "../../lib/time";
import { recurrenceLabel } from "../../lib/recurrence";
import { colors } from "../../theme/colors";

export function AppointmentsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { appointments, clients } = useAppStore();

  const sorted = useMemo(
    () =>
      [...appointments].sort((a, b) =>
        a.startsAtUtc.localeCompare(b.startsAtUtc)
      ),
    [appointments]
  );

  return (
    <Screen scroll>
      <Subtitle>{t("appointments.seriesNote")}</Subtitle>

      <Button
        label={t("appointments.add")}
        onPress={() => router.push("/(app)/appointments/form")}
      />

      {sorted.length === 0 ? (
        <Empty>{t("appointments.empty")}</Empty>
      ) : (
        sorted.map((item) => {
          const client = clients.find((c) => c.id === item.clientId);
          const name = client
            ? `${client.firstName} ${client.lastName}`
            : "—";
          return (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/(app)/appointments/form",
                  params: { appointmentId: item.id },
                })
              }
            >
              <Card>
                <Text
                  style={{ fontWeight: "700", fontSize: 16, color: colors.label }}
                >
                  {name}
                </Text>
                <Text style={{ color: colors.secondaryLabel, marginTop: 4 }}>
                  {displayArtDate(item.startsAtUtc)} · ART {formatArt(item.startsAtUtc)} ·
                  origin {formatClientLocal(item.startsAtUtc, item.clientIanaTz)}
                </Text>
                <Text style={{ color: colors.tint, marginTop: 6 }}>
                  {t(`status.${item.status}`)} ·{" "}
                  {t(`recurrence.${item.recurrenceMode}`, {
                    defaultValue: recurrenceLabel(
                      item.recurrenceMode,
                      item.recurrenceIntervalDays
                    ),
                  })}
                </Text>
              </Card>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}
