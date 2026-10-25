import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";

/** Platform-aware palette: Liquid Glass / Cupertino on iOS, Material on Android. */
export const colors = {
  background: isIOS ? "#E8EEF7" : "#F7F9FC",
  backgroundAlt: isIOS ? "#D9E4F5" : "#EEF2F7",
  surface: isIOS ? "rgba(255,255,255,0.55)" : "#FFFFFF",
  surfaceSolid: isIOS ? "#F2F2F7" : "#FFFFFF",
  surfaceAlt: isIOS ? "rgba(255,255,255,0.72)" : "#EEF2F7",
  text: isIOS ? "#1C1C1E" : "#1A2332",
  textSecondary: isIOS ? "#636366" : "#5B6B7C",
  primary: isIOS ? "#007AFF" : "#2F6FED",
  primaryMuted: isIOS ? "rgba(0,122,255,0.14)" : "#E8F0FE",
  danger: isIOS ? "#FF3B30" : "#C62828",
  success: isIOS ? "#34C759" : "#2E7D32",
  border: isIOS ? "rgba(60,60,67,0.18)" : "#D7DEE8",
  chip: isIOS ? "rgba(120,120,128,0.16)" : "#E3EAF3",
  glassTint: isIOS ? "rgba(255,255,255,0.35)" : undefined,
  tabBar: isIOS ? "transparent" : "#FFFFFF",
  separator: isIOS ? "rgba(60,60,67,0.29)" : "#D7DEE8",
};
