import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type Variant = "primary" | "secondary" | "danger" | "ghost";

/**
 * Android / fallback — Material-aligned hierarchy matching Apple roles:
 * primary = filled; secondary = tonal/gray; danger = error filled; ghost = text.
 */
export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        variant === "ghost" && styles.ghost,
        (pressed || disabled) && { opacity: 0.45 },
      ]}
    >
      <Text
        style={[
          typography.headline,
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
    minHeight: 50,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: colors.tint },
  secondary: { backgroundColor: colors.fill },
  danger: { backgroundColor: colors.danger },
  ghost: {
    backgroundColor: "transparent",
    minHeight: 44,
    marginTop: 4,
  },
  labelOnFill: { color: "#FFFFFF" },
  labelOnSecondary: { color: colors.label },
  labelTint: { color: colors.tint },
});
