import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type Variant = "primary" | "secondary" | "danger" | "ghost";

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled,
  compact = false,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        variant === "ghost" && styles.ghost,
        compact && styles.compact,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <Text
        style={[
          typography.headline,
          compact && typography.callout,
          variant === "primary" && styles.labelOnFill,
          variant === "secondary" && styles.labelOnSecondary,
          variant === "danger" && styles.labelOnFill,
          variant === "ghost" && styles.labelTint,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    alignSelf: "stretch",
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 20,
  },
  compact: {
    width: undefined,
    flex: 1,
    minHeight: 48,
    marginTop: 0,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  primary: { backgroundColor: colors.tint },
  secondary: { backgroundColor: colors.fill },
  danger: { backgroundColor: colors.danger },
  ghost: {
    backgroundColor: "transparent",
    minHeight: 44,
    marginTop: 4,
  },
  dimmed: { opacity: 0.45 },
  labelOnFill: { color: "#FFFFFF" },
  labelOnSecondary: { color: colors.label },
  labelTint: { color: colors.tint },
});
