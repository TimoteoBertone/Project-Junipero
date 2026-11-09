import { DynamicColorIOS, Platform } from "react-native";
import palette from "./palette.json";

type ColorSet = typeof palette.light;
type ColorName = keyof ColorSet;

const isIOS = Platform.OS === "ios";

const color = (name: ColorName) =>
  isIOS
    ? DynamicColorIOS({ light: palette.light[name], dark: palette.dark[name] })
    : palette.light[name];

export const colors = {
  groupedBackground: color("groupedBackground"),
  background: color("groupedBackground"),
  secondaryGrouped: color("secondaryGrouped"),
  tertiaryGrouped: color("tertiaryGrouped"),
  label: color("label"),
  secondaryLabel: color("secondaryLabel"),
  tertiaryLabel: color("tertiaryLabel"),
  separator: color("separator"),
  opaqueSeparator: color("opaqueSeparator"),
  tint: color("tint"),
  tintMuted: color("tintMuted"),
  fill: color("fill"),
  googleLogo: color("googleLogo"),
  onTint: color("onTint"),
  onDanger: color("onDanger"),
  rippleOnAccent: color("rippleOnAccent"),
  overlay: color("overlay"),
  danger: color("danger"),
  success: color("success"),
  dangerMuted: color("dangerMuted"),
  successMuted: color("successMuted"),

  text: color("label"),
  textSecondary: color("secondaryLabel"),
  primary: color("tint"),
  primaryMuted: color("tintMuted"),
  border: color("separator"),
  surface: color("secondaryGrouped"),
  surfaceSolid: color("secondaryGrouped"),
  surfaceAlt: color("tertiaryGrouped"),
  chip: color("fill"),
};

export function getThemeColors(isDark: boolean): ColorSet {
  return isDark ? palette.dark : palette.light;
}
