import React, { useLayoutEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Field,
  Screen,
  Subtitle,
} from "../../components/ui";
import { searchPlaces } from "../../lib/places";
import { useAppStore } from "../../store/AppStore";
import { colors } from "../../theme/colors";

export function ClientFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ clientId?: string }>();
  const clientId = typeof params.clientId === "string" ? params.clientId : undefined;
  const { clients, upsertClient, deleteClient } = useAppStore();
  const existing = clients.find((c) => c.id === clientId);

  const [firstName, setFirstName] = useState(existing?.firstName ?? "");
  const [lastName, setLastName] = useState(existing?.lastName ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [locationQuery, setLocationQuery] = useState(
    existing ? `${existing.city}, ${existing.region}` : ""
  );
  const [countryCode, setCountryCode] = useState(existing?.countryCode ?? "");
  const [region, setRegion] = useState(existing?.region ?? "");
  const [city, setCity] = useState(existing?.city ?? "");
  const [streetAddress, setStreetAddress] = useState(
    existing?.streetAddress ?? ""
  );
  const [ianaTz, setIanaTz] = useState(existing?.ianaTz ?? "");
  const [placeId, setPlaceId] = useState(existing?.placeId ?? "");

  const suggestions = useMemo(
    () => searchPlaces(locationQuery),
    [locationQuery]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: existing ? t("clients.edit") : t("clients.add"),
    });
  }, [existing, navigation, t]);

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Missing name", "First and last name are required.");
      return;
    }
    if (!countryCode || !region || !city || !ianaTz) {
      Alert.alert("Location required", "Select a place to assign country + IANA TZ.");
      return;
    }
    await upsertClient({
      ...(existing?.id ? { id: existing.id } : {}),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      countryCode,
      region,
      city,
      streetAddress: streetAddress.trim() || undefined,
      ianaTz,
      placeId: placeId || undefined,
    });
    router.back();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert(t("clients.delete"), `${existing.firstName} ${existing.lastName}?`, [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("clients.delete"),
        style: "destructive",
        onPress: async () => {
          await deleteClient(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scroll headerAware>
      <Subtitle>{t("clients.placeHint")}</Subtitle>

      <Field label={t("clients.firstName")} value={firstName} onChangeText={setFirstName} />
      <Field label={t("clients.lastName")} value={lastName} onChangeText={setLastName} />
      <Field
        label={t("clients.phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Field
        label={t("clients.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Field
        label={t("clients.notes")}
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Field
        label={t("clients.location")}
        value={locationQuery}
        onChangeText={setLocationQuery}
        placeholder={t("clients.placeHint")}
      />

      {suggestions.length > 0 && (
        <Card>
          {suggestions.map((item) => (
            <Pressable
              key={item.placeId}
              onPress={() => {
                setLocationQuery(item.label);
                setCountryCode(item.countryCode);
                setRegion(item.region);
                setCity(item.city);
                setIanaTz(item.ianaTz);
                setPlaceId(item.placeId);
              }}
              style={{ paddingVertical: 10 }}
            >
              <Text style={{ color: colors.label, fontWeight: "600" }}>
                {item.label}
              </Text>
              <Text style={{ color: colors.tint, fontSize: 12 }}>
                {item.ianaTz}
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      {!!ianaTz && (
        <Card>
          <Text style={{ color: colors.secondaryLabel }}>
            {t("clients.country")}: {countryCode}
          </Text>
          <Text style={{ color: colors.secondaryLabel, marginTop: 4 }}>
            {city}, {region}
          </Text>
          <Text style={{ color: colors.tint, marginTop: 4, fontWeight: "700" }}>
            {t("clients.tz")}: {ianaTz}
          </Text>
        </Card>
      )}

      <Field
        label="Street (optional)"
        value={streetAddress}
        onChangeText={setStreetAddress}
      />

      <Button label={t("clients.save")} onPress={save} />
      {existing && (
        <Button
          label={t("clients.delete")}
          variant="danger"
          onPress={onDelete}
        />
      )}
      <Button
        label={t("common.cancel")}
        variant="ghost"
        onPress={() => router.back()}
      />
    </Screen>
  );
}
