import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Chip,
  Empty,
  Field,
  Screen,
  Subtitle,
} from "../../components/ui";
import { useAppStore } from "../../store/AppStore";
import { colors } from "../../theme/colors";

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
    <Screen scroll>
      <Subtitle>{t("clients.stats")}</Subtitle>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
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
      </View>

      <Field
        label={t("clients.search")}
        value={query}
        onChangeText={setQuery}
        placeholder={t("clients.search")}
      />

      <Button
        label={t("clients.add")}
        onPress={() => router.push("/(app)/clients/form")}
      />

      {filtered.length === 0 ? (
        <Empty>{t("clients.empty")}</Empty>
      ) : (
        filtered.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>
              router.push({
                pathname: "/(app)/clients/form",
                params: { clientId: item.id },
              })
            }
          >
            <Card>
              <Text style={{ fontWeight: "700", fontSize: 16, color: colors.label }}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={{ color: colors.secondaryLabel, marginTop: 4 }}>
                {item.city}, {item.region} · {item.countryCode}
              </Text>
              <Text style={{ color: colors.tint, marginTop: 4, fontSize: 12 }}>
                {item.ianaTz}
              </Text>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
