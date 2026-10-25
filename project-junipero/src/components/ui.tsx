import React, { Fragment } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const isIOS = Platform.OS === "ios";
const NAV_BAR_CONTENT = 44;
/** iOS 26 inset-grouped sections use a larger continuous corner radius. */
const GROUP_RADIUS = isIOS ? 16 : 16;

/**
 * Content layer only. Navigation chrome is system-drawn (Liquid Glass).
 * Pass `headerAware` on pushed stack screens so content clears the nav bar.
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
  headerAware?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const backgroundColor = grouped ? colors.groupedBackground : colors.background;
  const topPad = headerAware
    ? insets.top + NAV_BAR_CONTENT + 8
    : isIOS
      ? 0
      : 12;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor }]}
        contentContainerStyle={[
          styles.screenPad,
          {
            paddingTop: topPad,
            paddingBottom: isIOS ? 24 : Math.max(insets.bottom, 12) + 24,
          },
          style,
        ]}
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
        styles.screenPad,
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
  return <Text style={typography.largeTitle}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={[typography.subheadline, styles.subtitle]}>{children}</Text>;
}

export function Footnote({ children }: { children: React.ReactNode }) {
  return <Text style={[typography.footnote, styles.footnote]}>{children}</Text>;
}

/** Title-case section header above an inset grouped list (Settings pattern). */
export function SectionHeader({ children }: { children: React.ReactNode }) {
  return <Text style={[typography.sectionHeader, styles.sectionHeader]}>{children}</Text>;
}

/** Inset grouped container — white/secondaryGrouped with continuous corners. */
export function Group({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function Section({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      {title ? <SectionHeader>{title}</SectionHeader> : null}
      <Group>{children}</Group>
      {footer ? <Footnote>{footer}</Footnote> : null}
    </View>
  );
}

/** Row inside a Group — Settings / Contacts style. */
export function ListRow({
  title,
  subtitle,
  detail,
  onPress,
  destructive,
  showChevron,
  last,
  left,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
  last?: boolean;
  left?: React.ReactNode;
}) {
  const content = (
    <>
      <View style={styles.rowInner}>
        {left}
        <View style={styles.rowTextCol}>
          <Text
            style={[
              typography.body,
              destructive && { color: colors.danger },
              { fontWeight: subtitle ? "600" : "400" },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={[typography.footnote, { marginTop: 2 }]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {detail ? (
          <Text style={[typography.body, { color: colors.secondaryLabel }]} numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
        {(showChevron ?? !!onPress) && !destructive ? (
          <Text style={styles.chevron}>›</Text>
        ) : null}
      </View>
      {!last ? <View style={styles.separator} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      {content}
    </Pressable>
  );
}

/** Legacy card wrapper — prefer Group + ListRow / FormRow. */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Labeled text field as a form row (inset grouped). */
export function FormRow({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  keyboardType,
  autoComplete,
  textContentType,
  last,
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
  last?: boolean;
}) {
  return (
    <View>
      <View style={[styles.formRow, multiline && styles.formRowMultiline]}>
        <Text style={[typography.body, styles.formLabel]}>{label}</Text>
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
          style={[
            typography.body,
            styles.formInput,
            multiline && styles.formInputMultiline,
          ]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode={isIOS ? "while-editing" : undefined}
          textAlign="right"
        />
      </View>
      {!last ? <View style={styles.separator} /> : null}
    </View>
  );
}

/** Standalone search-style field (full-width shell). */
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
    <View style={styles.fieldBlock}>
      <Text style={[typography.footnote, styles.fieldLabel]}>{label}</Text>
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
          style={[typography.body, styles.input, multiline && styles.inputMultiline]}
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
 * primary = prominent filled; secondary = gray fill; danger = destructive fill; ghost = plain.
 * Prefer one prominent button per view.
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
        (pressed || disabled) && { opacity: 0.45 },
      ]}
    >
      <Text
        style={[
          typography.headline,
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
      accessibilityState={{ selected: !!selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[typography.footnote, styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

export function Empty({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <View style={styles.emptyWrap} accessibilityRole="text">
      {title ? <Text style={[typography.headline, styles.emptyTitle]}>{title}</Text> : null}
      <Text style={[typography.subheadline, styles.emptyBody]}>{children}</Text>
    </View>
  );
}

export function StatusPill({
  label,
  tone = "tint",
}: {
  label: string;
  tone?: "tint" | "success" | "danger" | "neutral";
}) {
  const bg =
    tone === "success"
      ? "rgba(52,199,89,0.14)"
      : tone === "danger"
        ? "rgba(255,59,48,0.14)"
        : tone === "neutral"
          ? colors.fill
          : colors.tintMuted;
  const fg =
    tone === "success"
      ? colors.success
      : tone === "danger"
        ? colors.danger
        : tone === "neutral"
          ? colors.secondaryLabel
          : colors.tint;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[typography.caption1, { color: fg, fontWeight: "600" }]}>{label}</Text>
    </View>
  );
}

/** Helper: map children of a Group and mark the last ListRow/FormRow. */
export function withLastFlag<T>(items: T[]): { item: T; last: boolean }[] {
  return items.map((item, i) => ({ item, last: i === items.length - 1 }));
}

export function Separated({
  children,
}: {
  children: React.ReactNode[];
}) {
  const list = React.Children.toArray(children).filter(Boolean);
  return (
    <>
      {list.map((child, i) => (
        <Fragment key={i}>
          {child}
          {i < list.length - 1 ? <View style={styles.separator} /> : null}
        </Fragment>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screenPad: {
    paddingHorizontal: 16,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  footnote: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginLeft: 16,
    marginBottom: 8,
  },
  group: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: GROUP_RADIUS,
    overflow: "hidden",
  },
  card: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: GROUP_RADIUS,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    minHeight: isIOS ? 52 : 52,
    justifyContent: "center",
  },
  rowPressed: {
    backgroundColor: colors.fill,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    minHeight: 52,
  },
  rowTextCol: {
    flex: 1,
    minWidth: 0,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 22,
    color: colors.tertiaryLabel,
    fontWeight: "500",
    marginLeft: 4,
  },
  separator: {
    marginLeft: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  formRowMultiline: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  formLabel: {
    flexShrink: 0,
    maxWidth: "42%",
  },
  formInput: {
    flex: 1,
    color: colors.label,
    padding: 0,
    minHeight: 24,
    textAlign: "right",
  },
  formInputMultiline: {
    minHeight: 72,
    textAlignVertical: "top",
    textAlign: "left",
    width: "100%",
  },
  fieldBlock: { marginBottom: 12 },
  fieldLabel: {
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: "600",
  },
  inputShell: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: GROUP_RADIUS,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: isIOS ? 14 : 12,
    color: colors.label,
  },
  inputMultiline: { minHeight: 88, textAlignVertical: "top" },

  buttonBase: {
    minHeight: 50,
    borderRadius: isIOS ? 14 : 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  buttonPrimary: { backgroundColor: colors.tint },
  buttonSecondary: { backgroundColor: colors.fill },
  buttonDanger: { backgroundColor: colors.danger },
  buttonGhost: { backgroundColor: "transparent", minHeight: 44 },
  buttonLabelOnTint: { color: "#FFFFFF" },
  buttonLabelTint: { color: colors.tint },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: colors.fill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipSelected: {
    backgroundColor: colors.tintMuted,
  },
  chipText: {
    color: colors.label,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: colors.tint,
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginBottom: 6,
    textAlign: "center",
  },
  emptyBody: {
    textAlign: "center",
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
});
