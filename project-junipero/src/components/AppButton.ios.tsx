import React from "react";
import { StyleSheet } from "react-native";
import { Host, Button as SwiftButton } from "@expo/ui/swift-ui";
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  disabled as disabledModifier,
  frame,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { colors } from "../theme/colors";

type Variant = "primary" | "secondary" | "danger" | "ghost";

/**
 * Native SwiftUI buttons — Apple HIG / Liquid Glass.
 * glassProminent = primary create/confirm; glass = secondary; plain = tertiary.
 * @see https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
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
  const style =
    variant === "primary"
      ? ("glassProminent" as const)
      : variant === "secondary"
        ? ("glass" as const)
        : variant === "danger"
          ? ("glassProminent" as const)
          : ("plain" as const);

  const modifiers = [
    buttonStyle(style),
    controlSize("large" as const),
    buttonBorderShape("roundedRectangle" as const),
    frame({ maxWidth: Infinity }),
  ];

  if (disabled) {
    modifiers.push(disabledModifier(true));
  }
  if (variant === "danger") {
    modifiers.push(tint(colors.danger));
  }

  return (
    <Host
      matchContents
      style={[styles.host, variant === "ghost" && styles.hostGhost]}
      seedColor={variant === "danger" ? undefined : colors.tint}
    >
      <SwiftButton
        label={label}
        onPress={onPress}
        role={variant === "danger" ? "destructive" : "default"}
        modifiers={modifiers}
      />
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    width: "100%",
    marginTop: 12,
    minHeight: 50,
  },
  hostGhost: {
    marginTop: 4,
    minHeight: 44,
  },
});
