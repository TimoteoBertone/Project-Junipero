import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { parseISO } from "date-fns";
import {
  Chip,
  ChipRow,
  Empty,
  Footnote,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { useAdaptiveLayout } from "../../layout/adaptive";
import { useAppStore } from "../../store/AppStore";
import {
  artDayBoundsUtc,
  formatArt,
  formatClientLocal,
  displayArtDate,
} from "../../lib/time";
import { typography } from "../../theme/typography";

export function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { appointments, clients } = useAppStore();
  const { isRegularWidth } = useAdaptiveLayout();

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

  const calendarSection = (
    <Section title={t("home.calendar")}>
      {markedDays.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={typography.subheadline}>—</Text>
        </View>
      ) : (
        <View style={{ padding: 16 }}>
          <ChipRow>
            {markedDays.map((d) => (
              <Chip key={d} label={d} selected />
            ))}
          </ChipRow>
        </View>
      )}
    </Section>
  );

  const todaySection = (
    <Section title={t("home.title")}>
      {todays.length === 0 ? (
        <Empty title={t("home.empty")}>{t("home.artHint")}</Empty>
      ) : (
        todays.map((item, index) => {
          const client = clients.find((c) => c.id === item.clientId);
          const name = client
            ? `${client.firstName} ${client.lastName}`
            : "—";
          return (
            <ListRow
              key={item.id}
              title={name}
              subtitle={t("home.localVsOrigin", {
                art: formatArt(item.startsAtUtc),
                origin: formatClientLocal(item.startsAtUtc, item.clientIanaTz),
              })}
              detail={`${t(`status.${item.status}`)} · ${item.durationMin}m`}
              last={index === todays.length - 1}
              onPress={() =>
                router.push({
                  pathname: "/(app)/appointments/form",
                  params: { appointmentId: item.id },
                })
              }
            />
          );
        })
      )}
    </Section>
  );

  return (
    <Screen scroll>
      <Footnote>{t("home.artHint")}</Footnote>
      {/* Regular width (Duo inner / Split View): widen in place — same features. */}
      {isRegularWidth ? (
        <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>{calendarSection}</View>
          <View style={{ flex: 1.4 }}>{todaySection}</View>
        </View>
      ) : (
        <>
          {calendarSection}
          {todaySection}
        </>
      )}
    </Screen>
  );
}
