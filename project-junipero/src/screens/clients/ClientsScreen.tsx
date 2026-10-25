import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { HeaderAddButton } from "../../components/HeaderActions";
import {
  Chip,
  ChipRow,
  Empty,
  Field,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";

export function ClientsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { clients, geoStats } = useAppStore();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (country && c.countryCode !== country) return false;
      if (!q) return true;
      return (
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    });
  }, [clients, country, query]);

  return (
    <>
      <HeaderAddButton
        accessibilityLabel={t("clients.add")}
        androidLabel={t("clients.add")}
        onPress={() => router.push("/(app)/clients/form")}
      />

      <Screen scroll>
        <Section title={t("clients.stats")}>
          <View style={{ padding: 16 }}>
            <ChipRow>
              <Chip
                label={t("clients.allCountries")}
                selected={!country}
                onPress={() => setCountry(null)}
              />
              {geoStats.map((s) => (
                <Chip
                  key={s.countryCode}
                  label={`${s.countryCode} (${s.count})`}
                  selected={country === s.countryCode}
                  onPress={() =>
                    setCountry(country === s.countryCode ? null : s.countryCode)
                  }
                />
              ))}
            </ChipRow>
          </View>
        </Section>

        <Field
          label={t("clients.search")}
          value={query}
          onChangeText={setQuery}
          placeholder={t("clients.search")}
        />

        <Section title={t("clients.title")}>
          {filtered.length === 0 ? (
            <Empty title={t("clients.empty")}>{t("clients.placeHint")}</Empty>
          ) : (
            filtered.map((item, index) => (
              <ListRow
                key={item.id}
                title={`${item.firstName} ${item.lastName}`}
                subtitle={`${item.city}, ${item.region} · ${item.countryCode}`}
                detail={item.ianaTz.split("/").pop()}
                last={index === filtered.length - 1}
                onPress={() =>
                  router.push({
                    pathname: "/(app)/clients/form",
                    params: { clientId: item.id },
                  })
                }
              />
            ))
          )}
        </Section>
      </Screen>
    </>
  );
}
