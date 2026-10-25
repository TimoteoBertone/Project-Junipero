import React, { useMemo } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { HeaderAddButton } from "../../components/HeaderActions";
import {
  Empty,
  Footnote,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { formatArt, formatClientLocal, displayArtDate } from "../../lib/time";

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
    <>
      <HeaderAddButton
        accessibilityLabel={t("appointments.add")}
        androidLabel={t("appointments.add")}
        onPress={() => router.push("/(app)/appointments/form")}
      />

      <Screen scroll>
        <Footnote>{t("appointments.seriesNote")}</Footnote>

        <Section title={t("appointments.title")}>
          {sorted.length === 0 ? (
            <Empty title={t("appointments.empty")}>
              {t("appointments.seriesNote")}
            </Empty>
          ) : (
            sorted.map((item, index) => {
              const client = clients.find((c) => c.id === item.clientId);
              const name = client
                ? `${client.firstName} ${client.lastName}`
                : "—";
              return (
                <ListRow
                  key={item.id}
                  title={name}
                  subtitle={`${displayArtDate(item.startsAtUtc)} · ART ${formatArt(item.startsAtUtc)} · ${formatClientLocal(item.startsAtUtc, item.clientIanaTz)}`}
                  detail={t(`status.${item.status}`)}
                  last={index === sorted.length - 1}
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
