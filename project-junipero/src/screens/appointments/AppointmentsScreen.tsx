import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { HeaderAddButton } from "../../components/HeaderActions";
import {
  Empty,
  Chip,
  ChipRow,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { formatArt, formatClientLocal, displayArtDate } from "../../lib/time";

export function AppointmentsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { appointments, clients } = useAppStore();
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");

  const sorted = useMemo(
    () =>
      [...appointments].sort((a, b) =>
        a.startsAtUtc.localeCompare(b.startsAtUtc)
      ),
    [appointments]
  );
  const now = Date.now();
  const upcoming = sorted.filter(
    (item) =>
      Date.parse(item.startsAtUtc) >= now && item.status !== "cancelled"
  );
  const past = sorted
    .filter((item) => Date.parse(item.startsAtUtc) < now)
    .reverse();
  const visible =
    filter === "upcoming"
      ? upcoming
      : filter === "past"
        ? past
        : [
            ...sorted.filter((item) => Date.parse(item.startsAtUtc) >= now),
            ...past,
          ];

  return (
    <>
      <HeaderAddButton
        accessibilityLabel={t("appointments.add")}
        androidLabel={t("appointments.add")}
        onPress={() => router.push("/(app)/appointments/form")}
      />

      <Screen scroll>
        {appointments.length > 0 ? (
          <Section title={t("appointments.filtersTitle")}>
            <View style={{ padding: 16 }}>
              <ChipRow>
                <Chip
                  label={t("appointments.filters.upcoming", {
                    count: upcoming.length,
                  })}
                  selected={filter === "upcoming"}
                  onPress={() => setFilter("upcoming")}
                />
                <Chip
                  label={t("appointments.filters.past", { count: past.length })}
                  selected={filter === "past"}
                  onPress={() => setFilter("past")}
                />
                <Chip
                  label={t("appointments.filters.all", {
                    count: appointments.length,
                  })}
                  selected={filter === "all"}
                  onPress={() => setFilter("all")}
                />
              </ChipRow>
            </View>
          </Section>
        ) : null}

        <Section>
          {visible.length === 0 ? (
            <Empty
              title={
                appointments.length === 0
                  ? t("appointments.empty")
                  : t(
                      filter === "upcoming"
                        ? "appointments.noUpcoming"
                        : "appointments.noPast"
                    )
              }
            >
              {appointments.length === 0
                ? t("appointments.emptyHint")
                : t("appointments.noFilterResults")}
            </Empty>
          ) : (
            visible.map((item, index) => {
              const client = clients.find((c) => c.id === item.clientId);
              const name = client
                ? `${client.firstName} ${client.lastName}`
                : "—";
              return (
                <ListRow
                  key={item.id}
                  title={name}
                  subtitle={`${displayArtDate(
                    item.startsAtUtc,
                    i18n.resolvedLanguage?.startsWith("es") ? "es-AR" : "en-US",
                    true
                  )} · ART ${formatArt(item.startsAtUtc)} · ${formatClientLocal(item.startsAtUtc, item.clientIanaTz)}`}
                  detail={t(`status.${item.status}`)}
                  last={index === visible.length - 1}
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
      </Screen>
    </>
  );
}
