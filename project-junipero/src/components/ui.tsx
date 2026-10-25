import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { AdaptiveGlass, AdaptiveGlassContainer } from "./Glass";

const isIOS = Platform.OS === "ios";

export function Screen({
  children,
  style,
  glassGroup = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  glassGroup?: boolean;
}) {
  const insets = useSafeAreaInsets();
  // Extra bottom space for the floating glass tab bar on iOS
  const bottomPad = insets.bottom + (isIOS ? 72 : 12);
  const content = (
    <View
      style={[
        styles.screenContent,
        { paddingTop: Math.max(insets.top, 12), paddingBottom: bottomPad },
        style,
      ]}
    >
      {glassGroup && isIOS ? (
        <AdaptiveGlassContainer style={{ flex: 1 }} spacing={18}>
          {children}
        </AdaptiveGlassContainer>
      ) : (
        children
      )}
    </View>
  );

  if (isIOS) {
    return (
      <View style={styles.screenRoot}>
        <LinearGradient
          colors={["#DCE8F8", "#E8EEF7", "#F3E9F4", "#D7E6F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Soft orbs so Liquid Glass / blur has something to refract */}
        <View style={[styles.orb, styles.orbOne]} />
        <View style={[styles.orb, styles.orbTwo]} />
        {content}
      </View>
    );
  }

  return <View style={[styles.screenRoot, styles.androidScreen]}>{content}</View>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <AdaptiveGlass
      style={[styles.card, style]}
      contentStyle={styles.cardContent}
      glassEffectStyle="regular"
    >
      {children}
    </AdaptiveGlass>
  );
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
      {isIOS ? (
        <AdaptiveGlass
          style={styles.fieldGlass}
          contentStyle={styles.fieldGlassInner}
          glassEffectStyle="clear"
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            keyboardType={keyboardType}
            autoComplete={autoComplete}
            textContentType={textContentType}
            style={[styles.inputIOS, multiline && styles.inputMultiline]}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </AdaptiveGlass>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          textContentType={textContentType}
          style={[styles.inputAndroid, multiline && styles.inputMultiline]}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
    </View>
  );
}

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
  if (isIOS) {
    if (variant === "ghost") {
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.buttonGhostIOS,
            (pressed || disabled) && { opacity: 0.55 },
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonGhostTextIOS}>{label}</Text>
        </Pressable>
      );
    }

    if (variant === "primary") {
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.buttonPrimaryIOS,
            (pressed || disabled) && { opacity: 0.72 },
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonPrimaryTextIOS}>{label}</Text>
        </Pressable>
      );
    }

    if (variant === "danger") {
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.buttonDangerIOS,
            (pressed || disabled) && { opacity: 0.72 },
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonDangerTextIOS}>{label}</Text>
        </Pressable>
      );
    }

    // secondary → interactive liquid glass button
    return (
      <AdaptiveGlass
        isInteractive
        glassEffectStyle="regular"
        style={[styles.buttonGlassOuter, disabled && { opacity: 0.55 }]}
        contentStyle={styles.buttonGlassInner}
      >
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={styles.buttonPressFill}
          accessibilityRole="button"
        >
          <Text style={styles.buttonGlassText}>{label}</Text>
        </Pressable>
      </AdaptiveGlass>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonAndroid,
        variant === "primary" && styles.buttonPrimaryAndroid,
        variant === "secondary" && styles.buttonSecondaryAndroid,
        variant === "danger" && styles.buttonDangerAndroid,
        variant === "ghost" && styles.buttonGhostAndroid,
        (pressed || disabled) && { opacity: 0.7 },
      ]}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.buttonTextAndroid,
          variant === "secondary" && { color: colors.text },
          variant === "ghost" && { color: colors.primary },
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
  if (isIOS) {
    return (
      <AdaptiveGlass
        isInteractive
        glassEffectStyle={selected ? "regular" : "clear"}
        style={[styles.chipGlass, selected && styles.chipGlassSelected]}
        contentStyle={styles.chipGlassInner}
      >
        <Pressable onPress={onPress} accessibilityRole="button">
          <Text
            style={[styles.chipText, selected && styles.chipTextSelectedIOS]}
          >
            {label}
          </Text>
        </Pressable>
      </AdaptiveGlass>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chipAndroid, selected && styles.chipSelectedAndroid]}
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
  screenRoot: { flex: 1 },
  androidScreen: { backgroundColor: colors.background },
  screenContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orb: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.55,
  },
  orbOne: {
    top: -40,
    right: -60,
    backgroundColor: "rgba(120, 170, 255, 0.55)",
  },
  orbTwo: {
    bottom: 120,
    left: -80,
    backgroundColor: "rgba(210, 160, 255, 0.4)",
  },
  title: {
    fontSize: isIOS ? 34 : 28,
    fontWeight: isIOS ? "700" : "700",
    letterSpacing: isIOS ? 0.37 : 0,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 18,
    lineHeight: 20,
  },
  card: {
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: "600",
    marginLeft: 4,
  },
  fieldGlass: { marginBottom: 0 },
  fieldGlassInner: { paddingHorizontal: 4, paddingVertical: 2 },
  inputIOS: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 17,
  },
  inputAndroid: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },

  // iOS buttons
  buttonPrimaryIOS: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  buttonPrimaryTextIOS: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonDangerIOS: {
    backgroundColor: colors.danger,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  buttonDangerTextIOS: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonGhostIOS: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
    minHeight: 44,
    justifyContent: "center",
  },
  buttonGhostTextIOS: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "600",
  },
  buttonGlassOuter: {
    marginTop: 10,
    borderRadius: 14,
    minHeight: 50,
  },
  buttonGlassInner: {
    padding: 0,
    minHeight: 50,
    justifyContent: "center",
  },
  buttonPressFill: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonGlassText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
  },

  // Android buttons
  buttonAndroid: {
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  buttonPrimaryAndroid: { backgroundColor: colors.primary },
  buttonSecondaryAndroid: { backgroundColor: colors.chip },
  buttonDangerAndroid: { backgroundColor: colors.danger },
  buttonGhostAndroid: { backgroundColor: "transparent" },
  buttonTextAndroid: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  chipGlass: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 999,
  },
  chipGlassSelected: {},
  chipGlassInner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipAndroid: {
    backgroundColor: colors.chip,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelectedAndroid: { backgroundColor: colors.primary },
  chipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  chipTextSelected: { color: "#fff" },
  chipTextSelectedIOS: { color: colors.primary },
  empty: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 32,
    fontSize: 15,
  },
});
