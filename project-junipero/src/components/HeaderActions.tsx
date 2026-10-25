import React from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";

/**
 * Native header actions — Apple HIG / Liquid Glass.
 * Use Stack.Toolbar so iOS draws system bar buttons (SF Symbols + glass),
 * instead of custom Pressable "+" text which breaks rail / glass chrome.
 * @see https://docs.expo.dev/router/advanced/stack-toolbar/
 */
export function HeaderAddButton({
  onPress,
  accessibilityLabel,
  androidLabel,
}: {
  onPress: () => void;
  accessibilityLabel: string;
  /** Visible label on Android (SF Symbols are iOS-only). */
  androidLabel: string;
}) {
  return (
    <Stack.Toolbar placement="right">
      {Platform.OS === "ios" ? (
        <Stack.Toolbar.Button
          icon="plus"
          onPress={onPress}
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <Stack.Toolbar.Button onPress={onPress}>
          {androidLabel}
        </Stack.Toolbar.Button>
      )}
    </Stack.Toolbar>
  );
}

/** Confirm / Save — Apple "done" role in the nav bar. */
export function HeaderSaveButton({
  onPress,
  label,
}: {
  onPress: () => void;
  label: string;
}) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button variant="done" onPress={onPress}>
        {label}
      </Stack.Toolbar.Button>
    </Stack.Toolbar>
  );
}
