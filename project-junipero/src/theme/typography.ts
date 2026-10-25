import { Platform, TextStyle } from "react-native";
import { colors } from "./colors";

const isIOS = Platform.OS === "ios";

/** Apple SF text styles (approximate metrics). */
export const typography = {
  largeTitle: {
    fontSize: isIOS ? 34 : 28,
    fontWeight: "700",
    letterSpacing: isIOS ? 0.37 : 0,
    color: colors.label,
  } satisfies TextStyle,
  title1: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: isIOS ? 0.36 : 0,
    color: colors.label,
  } satisfies TextStyle,
  title2: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: isIOS ? 0.35 : 0,
    color: colors.label,
  } satisfies TextStyle,
  title3: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: isIOS ? 0.38 : 0,
    color: colors.label,
  } satisfies TextStyle,
  headline: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: isIOS ? -0.41 : 0,
    color: colors.label,
  } satisfies TextStyle,
  body: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: isIOS ? -0.41 : 0,
    color: colors.label,
  } satisfies TextStyle,
  callout: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: isIOS ? -0.32 : 0,
    color: colors.label,
  } satisfies TextStyle,
  subheadline: {
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: isIOS ? -0.24 : 0,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  footnote: {
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: isIOS ? -0.08 : 0,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  caption1: {
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  /** Section headers — title-style capitalization (iOS 26 HIG). */
  sectionHeader: {
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: isIOS ? -0.08 : 0,
    color: colors.secondaryLabel,
    textTransform: isIOS ? "none" : "none",
  } satisfies TextStyle,
} as const;
