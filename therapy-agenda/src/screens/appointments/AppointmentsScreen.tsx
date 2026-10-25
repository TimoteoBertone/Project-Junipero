import React, { useMemo } from "react";
import { FlatList, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Button, Card, Empty, Screen, Subtitle, Title } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { formatArt, formatClientLocal, displayArtDate } from "../../lib/time";
import { recurrenceLabel } from "../../lib/recurrence";
import { colors } from "../../theme/colors";
import { AppointmentsStackParamList } from "../../navigation/types";

export function AppointmentsScreen() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppointmentsStackParamList>>();
  const { appointments, clients } = useAppStore();

  const sorted = useMemo(
    () =>
      [...appointments].sort((a, b) =>
        a.startsAtUtc.localeCompare(b.startsAtUtc)
      ),
    [appointments]
  );

  return (
    <Screen>
      <Title>{t("appointments.title")}</Title>
      <Subtitle>{t("appointments.seriesNote")}</Subtitle>

      <Button
        label={t("appointments.add")}
        onPress={() => navigation.navigate("AppointmentForm", {})}
      />

      <FlatList
        style={{ marginTop: 8 }}
        data={sorted}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty>{t("appointments.empty")}</Empty>}
        renderItem={({ item }: { item: (typeof sorted)[number] }) => {
          const client = clients.find((c) => c.id === item.clientId);
          const name = client
            ? `${client.firstName} ${client.lastName}`
            : "—";
          return (
            <Pressable
              onPress={() =>
                navigation.navigate("AppointmentForm", {
                  appointmentId: item.id,
                })
              }
            >
              <Card>
                <Text
                  style={{ fontWeight: "700", fontSize: 16, color: colors.text }}
                >
                  {name}
                </Text>
                <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                  {displayArtDate(item.startsAtUtc)} · ART {formatArt(item.startsAtUtc)} ·
                  origin {formatClientLocal(item.startsAtUtc, item.clientIanaTz)}
                </Text>
                <Text style={{ color: colors.primary, marginTop: 6 }}>
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
        }}
      />
    </Screen>
  );
}
