import { Platform } from "react-native";

/** Platform-aware palette: Material-leaning on Android, Cupertino-leaning on iOS. */
export const colors = {
  background: Platform.select({ ios: "#F2F2F7", default: "#F7F9FC" })!,
  surface: Platform.select({ ios: "rgba(255,255,255,0.92)", default: "#FFFFFF" })!,
  surfaceAlt: Platform.select({ ios: "#FFFFFF", default: "#EEF2F7" })!,
  text: Platform.select({ ios: "#1C1C1E", default: "#1A2332" })!,
  textSecondary: Platform.select({ ios: "#8E8E93", default: "#5B6B7C" })!,
  primary: Platform.select({ ios: "#007AFF", default: "#2F6FED" })!,
  primaryMuted: Platform.select({ ios: "#E5F1FF", default: "#E8F0FE" })!,
  danger: Platform.select({ ios: "#FF3B30", default: "#C62828" })!,
  success: Platform.select({ ios: "#34C759", default: "#2E7D32" })!,
  border: Platform.select({ ios: "#C6C6C8", default: "#D7DEE8" })!,
  chip: Platform.select({ ios: "#E5E5EA", default: "#E3EAF3" })!,
};
