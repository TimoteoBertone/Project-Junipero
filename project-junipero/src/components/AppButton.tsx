import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
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
      android_ripple={
        Platform.OS === "android"
          ? {
              color:
                variant === "primary" || variant === "danger"
                  ? "rgba(255,255,255,0.2)"
                  : colors.tintMuted,
            }
          : undefined
      }
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        variant === "ghost" && styles.ghost,
        compact && styles.compact,
        ((pressed && Platform.OS === "ios") || disabled) && { opacity: 0.45 },
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
  labelOnFill: { color: "#FFFFFF" },
  labelOnSecondary: { color: colors.label },
  labelTint: { color: colors.tint },
});
