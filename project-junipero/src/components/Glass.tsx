import React from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  GlassContainer,
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { colors } from "../theme/colors";

export function canUseLiquidGlass(): boolean {
  if (Platform.OS !== "ios") return false;
  try {
    return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
}

/**
 * iOS: native Liquid Glass when available, otherwise system-material BlurView.
 * Android: solid Material surface (no fake glass).
 */
export function AdaptiveGlass({
  children,
  style,
  contentStyle,
  isInteractive = false,
  glassEffectStyle = "regular",
  intensity = 70,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  isInteractive?: boolean;
  glassEffectStyle?: "clear" | "regular" | "none";
  intensity?: number;
}) {
  if (Platform.OS !== "ios") {
    return (
      <View style={[styles.androidSurface, style, contentStyle]}>{children}</View>
    );
  }

  if (canUseLiquidGlass()) {
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        isInteractive={isInteractive}
        tintColor={colors.glassTint}
        style={[styles.glassBase, style]}
      >
        <View style={[styles.glassInner, contentStyle]}>{children}</View>
      </GlassView>
    );
  }

  return (
    <BlurView
      tint="systemMaterial"
      intensity={intensity}
      style={[styles.glassBase, styles.blurFallback, style]}
    >
      <View style={[styles.glassInner, contentStyle]}>{children}</View>
    </BlurView>
  );
}

/**
 * Groups multiple glass elements so they can morph/merge on iOS 26+.
 */
export function AdaptiveGlassContainer({
  children,
  style,
  spacing = 16,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  spacing?: number;
}) {
  if (Platform.OS === "ios" && canUseLiquidGlass()) {
    return (
      <GlassContainer spacing={spacing} style={style}>
        {children}
      </GlassContainer>
    );
  }
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  glassBase: {
    borderRadius: 20,
    overflow: Platform.OS === "ios" ? "visible" : "hidden",
  },
  glassInner: {
    padding: 14,
  },
  blurFallback: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  androidSurface: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
