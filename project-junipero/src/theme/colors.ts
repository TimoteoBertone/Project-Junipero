import { DynamicColorIOS, Platform } from "react-native";

/**
 * Semantic colors — Apple HIG system colors (DynamicColorIOS) + Material 3 on Android.
 * Liquid Glass for bars comes from native chrome; never paint custom bar backgrounds.
 */
const isIOS = Platform.OS === "ios";

const ios = {
  groupedBackground: DynamicColorIOS({ light: "#F2F2F7", dark: "#000000" }),
  secondaryGrouped: DynamicColorIOS({ light: "#FFFFFF", dark: "#1C1C1E" }),
  tertiaryGrouped: DynamicColorIOS({ light: "#F2F2F7", dark: "#2C2C2E" }),
  label: DynamicColorIOS({ light: "#000000", dark: "#FFFFFF" }),
  secondaryLabel: DynamicColorIOS({
    light: "rgba(60,60,67,0.6)",
    dark: "rgba(235,235,245,0.6)",
  }),
  tertiaryLabel: DynamicColorIOS({
    light: "rgba(60,60,67,0.3)",
    dark: "rgba(235,235,245,0.3)",
  }),
  separator: DynamicColorIOS({
    light: "rgba(60,60,67,0.29)",
    dark: "rgba(84,84,88,0.65)",
  }),
  tint: DynamicColorIOS({ light: "#007AFF", dark: "#0A84FF" }),
  tintMuted: DynamicColorIOS({
    light: "rgba(0,122,255,0.12)",
    dark: "rgba(10,132,255,0.24)",
  }),
  fill: DynamicColorIOS({
    light: "rgba(120,120,128,0.16)",
    dark: "rgba(120,120,128,0.32)",
  }),
  danger: DynamicColorIOS({ light: "#FF3B30", dark: "#FF453A" }),
  success: DynamicColorIOS({ light: "#34C759", dark: "#30D158" }),
};

const android = {
  groupedBackground: "#F7F9FC",
  secondaryGrouped: "#FFFFFF",
  tertiaryGrouped: "#EEF2F7",
  label: "#1A2332",
  secondaryLabel: "#5B6B7C",
  tertiaryLabel: "#8A97A8",
  separator: "#D7DEE8",
  tint: "#2F6FED",
  tintMuted: "#E8F0FE",
  fill: "#E3EAF3",
  danger: "#C62828",
  success: "#2E7D32",
};

const palette = isIOS ? ios : android;

export const colors = {
  background: palette.groupedBackground,
  groupedBackground: palette.groupedBackground,
  secondaryGrouped: palette.secondaryGrouped,
  tertiaryGrouped: palette.tertiaryGrouped,
  label: palette.label,
  secondaryLabel: palette.secondaryLabel,
  tertiaryLabel: palette.tertiaryLabel,
  separator: palette.separator,
  opaqueSeparator: isIOS ? "#C6C6C8" : "#D7DEE8",
  tint: palette.tint,
  tintMuted: palette.tintMuted,
  fill: palette.fill,
  danger: palette.danger,
  success: palette.success,

  // Legacy aliases
  text: palette.label,
  textSecondary: palette.secondaryLabel,
  primary: palette.tint,
  primaryMuted: palette.tintMuted,
  border: palette.separator,
  surface: palette.secondaryGrouped,
  surfaceSolid: palette.secondaryGrouped,
  surfaceAlt: palette.tertiaryGrouped,
  chip: palette.fill,
};
