import React, { useContext } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { HeaderHeightContext } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const isIOS = Platform.OS === "ios";

function useOptionalHeaderHeight(): number {
  return useContext(HeaderHeightContext) ?? 0;
}

/**
 * Content layer only. Navigation chrome (Liquid Glass UITabBar /
 * UINavigationBar) is system-drawn.
 *
 * On tab roots, NativeTabs adjusts ScrollView insets automatically.
 * On pushed stack screens (forms), pass `headerAware` so content clears the
 * Liquid Glass nav bar instead of sitting underneath it.
 * @see https://docs.expo.dev/router/advanced/native-tabs/#safe-area-handling
 */
export function Screen({
  children,
  style,
  scroll = false,
  grouped = true,
  headerAware = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  grouped?: boolean;
  /** Clear the native UINavigationBar on pushed screens (e.g. add/edit forms). */
  headerAware?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const headerHeight = useOptionalHeaderHeight();
  const backgroundColor = grouped ? colors.groupedBackground : colors.background;
  const topPad = headerAware
    ? Math.max(headerHeight, insets.top) + 8
    : isIOS
      ? 0
      : 12;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad,
            paddingBottom: isIOS ? 16 : Math.max(insets.bottom, 12) + 16,
          },
          style,
        ]}
        // headerAware screens pad manually; automatic would double-inset or miss
        // the stack header when nested under NativeTabs.
        contentInsetAdjustmentBehavior={headerAware ? "never" : "automatic"}
        automaticallyAdjustsScrollIndicatorInsets={!headerAware}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        styles.content,
        {
          backgroundColor,
          paddingTop: topPad,
          paddingBottom: isIOS ? 16 : Math.max(insets.bottom, 12) + 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

/** Inset grouped card — Apple secondarySystemGroupedBackground. */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  keyboardType,
  autoComplete,
  textContentType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoComplete?: "email" | "password" | "off";
  textContentType?: "emailAddress" | "password" | "none";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputShell}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.tertiaryLabel}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          textContentType={textContentType}
          style={[styles.input, multiline && styles.inputMultiline]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode={isIOS ? "while-editing" : undefined}
        />
      </View>
    </View>
  );
}

/**
 * Buttons — Apple HIG:
 * - primary → borderedProminent (filled tint)
 * - secondary → bordered (outline / gray fill)
 * - danger → filled destructive
 * - ghost → plain
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.buttonBase,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "danger" && styles.buttonDanger,
        variant === "ghost" && styles.buttonGhost,
        (pressed || disabled) && { opacity: 0.55 },
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant === "primary" && styles.buttonLabelOnTint,
          variant === "secondary" && styles.buttonLabelTint,
          variant === "danger" && styles.buttonLabelOnTint,
          variant === "ghost" && styles.buttonLabelTint,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <Text style={styles.empty}>{children}</Text>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    // Horizontal inset for grouped content only — screen background stays
    // edge-to-edge so Liquid Glass can refract full-bleed under the tab bar.
    paddingHorizontal: 16,
  },
  title: {
    fontSize: isIOS ? 34 : 28,
    fontWeight: "700",
    letterSpacing: isIOS ? 0.37 : 0,
    color: colors.label,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.secondaryLabel,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: isIOS ? 12 : 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {},
      default: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      },
    }),
  },
  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryLabel,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputShell: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: isIOS ? 12 : 10,
    borderWidth: isIOS ? 0 : StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: isIOS ? 14 : 12,
    color: colors.label,
    fontSize: isIOS ? 17 : 16,
  },
  inputMultiline: { minHeight: 88, textAlignVertical: "top" },

  buttonBase: {
    minHeight: isIOS ? 50 : 48,
    borderRadius: isIOS ? 14 : 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: colors.tint,
  },
  buttonSecondary: {
    backgroundColor: isIOS ? "rgba(120,120,128,0.16)" : colors.chip,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonGhost: {
    backgroundColor: "transparent",
    minHeight: 44,
  },
  buttonLabel: {
    fontSize: isIOS ? 17 : 16,
    fontWeight: "600",
  },
  buttonLabelOnTint: { color: "#FFFFFF" },
  buttonLabelTint: { color: colors.tint },

  chip: {
    backgroundColor: colors.chip,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.tintMuted,
  },
  chipText: {
    color: colors.label,
    fontWeight: "600",
    fontSize: 13,
  },
  chipTextSelected: {
    color: colors.tint,
  },
  empty: {
    color: colors.secondaryLabel,
    textAlign: "center",
    marginTop: 32,
    fontSize: 15,
  },
});
