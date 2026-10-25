import React, { useLayoutEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
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
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function ClientsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push("/(app)/clients/form")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t("clients.add")}
          style={{
            paddingHorizontal: 8,
            minWidth: 44,
            minHeight: 44,
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              typography.headline,
              { color: colors.tint, fontSize: 28, fontWeight: "400" },
            ]}
          >
            +
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, router, t]);

  return (
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
  );
}
