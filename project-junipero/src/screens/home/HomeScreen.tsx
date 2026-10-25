import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { parseISO } from "date-fns";
import { Card, Empty, Screen, Subtitle, Title } from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import {
  artDayBoundsUtc,
  formatArt,
  formatClientLocal,
  displayArtDate,
} from "../../lib/time";
import { colors } from "../../theme/colors";

export function HomeScreen() {
  const { t } = useTranslation();
  const { appointments, clients } = useAppStore();

  const { todays, markedDays } = useMemo(() => {
    const { startUtc, endUtc } = artDayBoundsUtc(new Date());
    const todaysList = appointments
      .filter((a) => {
        const start = parseISO(a.startsAtUtc);
        return (
          a.status !== "cancelled" &&
          start >= startUtc &&
          start <= endUtc
        );
      })
      .sort((a, b) => a.startsAtUtc.localeCompare(b.startsAtUtc));

    const marks = new Set(
      appointments
        .filter((a) => a.status !== "cancelled")
        .map((a) => displayArtDate(a.startsAtUtc))
    );

    return { todays: todaysList, markedDays: [...marks].slice(0, 14) };
  }, [appointments]);

  return (
    <Screen>
      <Title>{t("home.title")}</Title>
      <Subtitle>{t("home.artHint")}</Subtitle>

      <Card>
        <Text style={{ fontWeight: "700", color: colors.label, marginBottom: 8 }}>
          {t("home.calendar")}
        </Text>
        {markedDays.length === 0 ? (
          <Text style={{ color: colors.secondaryLabel }}>—</Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {markedDays.map((d) => (
              <View
                key={d}
                style={{
                  backgroundColor: colors.tintMuted,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.tint, fontWeight: "600" }}>{d}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <FlatList
        data={todays}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty>{t("home.empty")}</Empty>}
        renderItem={({ item }: { item: (typeof todays)[number] }) => {
          const client = clients.find((c) => c.id === item.clientId);
          const name = client
            ? `${client.firstName} ${client.lastName}`
            : "—";
          return (
            <Card>
              <Text style={{ fontSize: 17, fontWeight: "700", color: colors.label }}>
                {name}
              </Text>
              <Text style={{ color: colors.secondaryLabel, marginTop: 4 }}>
                {t("home.localVsOrigin", {
                  art: formatArt(item.startsAtUtc),
                  origin: formatClientLocal(item.startsAtUtc, item.clientIanaTz),
                })}
              </Text>
              <Text style={{ color: colors.tint, marginTop: 6, fontWeight: "600" }}>
                {t(`status.${item.status}`)} · {item.durationMin} min
              </Text>
            </Card>
          );
        }}
      />
    </Screen>
  );
}
