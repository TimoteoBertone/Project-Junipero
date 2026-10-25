import { Platform } from "react-native";

/**
 * Semantic colors aligned with Apple HIG (iOS) and Material 3 (Android).
 * Liquid Glass for bars/controls comes from native system components —
 * do not paint custom backgrounds onto UITabBar / UINavigationBar.
 */
const isIOS = Platform.OS === "ios";

export const colors = {
  // Content layer (Apple: systemBackground / secondarySystemGroupedBackground)
  background: isIOS ? "#F2F2F7" : "#F7F9FC",
  groupedBackground: isIOS ? "#F2F2F7" : "#F7F9FC",
  secondaryGrouped: isIOS ? "#FFFFFF" : "#FFFFFF",
  tertiaryGrouped: isIOS ? "#F2F2F7" : "#EEF2F7",

  label: isIOS ? "#000000" : "#1A2332",
  secondaryLabel: isIOS ? "rgba(60,60,67,0.6)" : "#5B6B7C",
  tertiaryLabel: isIOS ? "rgba(60,60,67,0.3)" : "#8A97A8",

  separator: isIOS ? "rgba(60,60,67,0.29)" : "#D7DEE8",
  opaqueSeparator: isIOS ? "#C6C6C8" : "#D7DEE8",

  // System accent (Apple blue / Material primary)
  tint: isIOS ? "#007AFF" : "#2F6FED",
  tintMuted: isIOS ? "rgba(0,122,255,0.12)" : "#E8F0FE",
  danger: isIOS ? "#FF3B30" : "#C62828",
  success: isIOS ? "#34C759" : "#2E7D32",

  // Legacy aliases used across screens
  text: isIOS ? "#000000" : "#1A2332",
  textSecondary: isIOS ? "rgba(60,60,67,0.6)" : "#5B6B7C",
  primary: isIOS ? "#007AFF" : "#2F6FED",
  primaryMuted: isIOS ? "rgba(0,122,255,0.12)" : "#E8F0FE",
  border: isIOS ? "rgba(60,60,67,0.29)" : "#D7DEE8",
  surface: isIOS ? "#FFFFFF" : "#FFFFFF",
  surfaceSolid: isIOS ? "#FFFFFF" : "#FFFFFF",
  surfaceAlt: isIOS ? "#F2F2F7" : "#EEF2F7",
  chip: isIOS ? "rgba(120,120,128,0.12)" : "#E3EAF3",
};
