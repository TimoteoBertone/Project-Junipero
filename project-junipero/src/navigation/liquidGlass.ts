import { Platform } from "react-native";
import { colors } from "../theme/colors";

const isIOS = Platform.OS === "ios";

/**
 * Native UINavigationBar options for iOS 26 Liquid Glass.
 * Apple (Adopting Liquid Glass / WWDC25): do not set custom header
 * backgrounds, blur, or bar appearances — the system draws the glass.
 */
export const liquidGlassStackScreenOptions = {
  headerTintColor: colors.tint,
  headerTitleStyle: { fontWeight: "600" as const },
  headerShadowVisible: false,
  headerLargeTitle: isIOS,
  headerLargeTitleStyle: isIOS ? { fontWeight: "700" as const } : undefined,
  // Never paint headerStyle.backgroundColor / headerBlurEffect on iOS 26+
  contentStyle: { backgroundColor: colors.groupedBackground },
};
