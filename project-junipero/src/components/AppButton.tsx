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
  highlighted = false,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  compact?: boolean;
  highlighted?: boolean;
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
                  ? colors.rippleOnAccent
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
        highlighted && !disabled && styles.highlighted,
        disabled && variant !== "ghost" && styles.disabledSurface,
        pressed && Platform.OS === "ios" && styles.dimmed,
      ]}
    >
      <Text
        style={[
          typography.headline,
          compact && typography.callout,
          variant === "primary" && styles.labelOnFill,
          variant === "secondary" && styles.labelOnSecondary,
          variant === "danger" && styles.labelOnDanger,
          variant === "ghost" && styles.labelTint,
          disabled && styles.disabledLabel,
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
  highlighted: {
    shadowColor: colors.tint,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  disabledSurface: { backgroundColor: colors.fill },
  ghost: {
    backgroundColor: "transparent",
    minHeight: 44,
    marginTop: 4,
  },
  labelOnFill: { color: colors.onTint },
  labelOnDanger: { color: colors.onDanger },
  labelOnSecondary: { color: colors.label },
  labelTint: { color: colors.tint },
  disabledLabel: { color: colors.secondaryLabel },
  dimmed: { opacity: 0.45 },
});
