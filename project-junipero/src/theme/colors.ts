import { DynamicColorIOS, Platform } from "react-native";

/** Warm, quiet colors for a care-focused app; navigation chrome remains native. */
const isIOS = Platform.OS === "ios";

const ios = {
  groupedBackground: DynamicColorIOS({ light: "#F5F5F0", dark: "#171A18" }),
  secondaryGrouped: DynamicColorIOS({ light: "#FFFFFF", dark: "#232825" }),
  tertiaryGrouped: DynamicColorIOS({ light: "#EBEEE8", dark: "#2D332F" }),
  label: DynamicColorIOS({ light: "#202923", dark: "#F2F5F1" }),
  secondaryLabel: DynamicColorIOS({
    light: "#66736B",
    dark: "#AEB8B1",
  }),
  tertiaryLabel: DynamicColorIOS({
    light: "#87928A",
    dark: "#818D85",
  }),
  separator: DynamicColorIOS({
    light: "#E3E7E1",
    dark: "#39413C",
  }),
  tint: DynamicColorIOS({ light: "#356B5E", dark: "#8FC8B4" }),
  tintMuted: DynamicColorIOS({
    light: "#E2EEE8",
    dark: "#30483E",
  }),
  fill: DynamicColorIOS({
    light: "#EEF0EB",
    dark: "#343B36",
  }),
  danger: DynamicColorIOS({ light: "#B5473B", dark: "#FF8D7E" }),
  success: DynamicColorIOS({ light: "#39775A", dark: "#8FC8A4" }),
  dangerMuted: DynamicColorIOS({ light: "#F8E8E4", dark: "#4A302D" }),
  successMuted: DynamicColorIOS({ light: "#E5F0E8", dark: "#2C4435" }),
};

const android = {
  groupedBackground: "#F5F5F0",
  secondaryGrouped: "#FFFFFF",
  tertiaryGrouped: "#EBEEE8",
  label: "#202923",
  secondaryLabel: "#66736B",
  tertiaryLabel: "#87928A",
  separator: "#E3E7E1",
  tint: "#356B5E",
  tintMuted: "#E2EEE8",
  fill: "#EEF0EB",
  danger: "#B5473B",
  success: "#39775A",
  dangerMuted: "#F8E8E4",
  successMuted: "#E5F0E8",
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
  opaqueSeparator: isIOS ? "#D5DAD4" : "#D5DAD4",
  tint: palette.tint,
  tintMuted: palette.tintMuted,
  fill: palette.fill,
  danger: palette.danger,
  success: palette.success,
  dangerMuted: palette.dangerMuted,
  successMuted: palette.successMuted,

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
