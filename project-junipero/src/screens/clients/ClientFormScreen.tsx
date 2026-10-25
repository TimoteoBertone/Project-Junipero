import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { HeaderSaveButton } from "../../components/HeaderActions";
import {
  Button,
  FormRow,
  ListRow,
  Screen,
  Section,
} from "../../components/ui";
import { searchPlaces } from "../../lib/places";
import { useAppStore } from "../../store/AppStore";

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

  const save = useCallback(async () => {
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
  }, [
    firstName,
    lastName,
    phone,
    email,
    notes,
    countryCode,
    region,
    city,
    streetAddress,
    ianaTz,
    placeId,
    existing,
    upsertClient,
    router,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: existing ? t("clients.edit") : t("clients.add"),
    });
  }, [existing, navigation, t]);

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
    <>
      <HeaderSaveButton label={t("clients.save")} onPress={save} />
      <Screen scroll headerAware>
      <Section title={t("settings.profile")}>
        <FormRow
          label={t("clients.firstName")}
          value={firstName}
          onChangeText={setFirstName}
        />
        <FormRow
          label={t("clients.lastName")}
          value={lastName}
          onChangeText={setLastName}
        />
        <FormRow
          label={t("clients.phone")}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <FormRow
          label={t("clients.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <FormRow
          label={t("clients.notes")}
          value={notes}
          onChangeText={setNotes}
          multiline
          last
        />
      </Section>

      <Section title={t("clients.location")} footer={t("clients.placeHint")}>
        <FormRow
          label={t("clients.location")}
          value={locationQuery}
          onChangeText={setLocationQuery}
          placeholder={t("clients.placeHint")}
          last={suggestions.length === 0 && !ianaTz && !streetAddress}
        />
        {suggestions.map((item, index) => (
          <ListRow
            key={item.placeId}
            title={item.label}
            subtitle={item.ianaTz}
            last={
              index === suggestions.length - 1 && !ianaTz && !streetAddress
            }
            onPress={() => {
              setLocationQuery(item.label);
              setCountryCode(item.countryCode);
              setRegion(item.region);
              setCity(item.city);
              setIanaTz(item.ianaTz);
              setPlaceId(item.placeId);
            }}
          />
        ))}
        {!!ianaTz && (
          <ListRow
            title={`${city}, ${region}`}
            subtitle={`${t("clients.country")}: ${countryCode}`}
            detail={ianaTz.split("/").pop()}
            last={!streetAddress}
            showChevron={false}
          />
        )}
        <FormRow
          label="Street"
          value={streetAddress}
          onChangeText={setStreetAddress}
          last
        />
      </Section>

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
    </>
  );
}
