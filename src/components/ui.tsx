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
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAdaptiveLayout } from "../layout/adaptive";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
export { AppButton as Button } from "./AppButton";
export function ButtonRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.buttonRow}>{children}</View>;
}

const isIOS = Platform.OS === "ios";
const NAV_BAR_CONTENT = 44;
/** iOS 26 inset-grouped sections use a larger continuous corner radius. */
const GROUP_RADIUS = isIOS ? 18 : 16;

/**
 * Content layer only. Navigation chrome is system-drawn (Liquid Glass / Duo rail).
 *
 * iPhone Duo (Expo + Apple prepare):
 * - Pad left/right via SafeAreaView so content clears the vertical rail
 *   (asymmetric — never assume left === right).
 * - Background ScrollView stays edge-to-edge for Liquid Glass refraction.
 * - Regular-width canvases use a readable max content width (not a different app).
 * - Pass `headerAware` on pushed stack screens so content clears the nav bar.
 *
 * @see https://expo.dev/blog/supporting-iphone-duo
 * @see https://developer.apple.com/iphone-duo/prepare/
 */
export function Screen({
  children,
  style,
  scroll = false,
  grouped = true,
  headerAware = false,
  keyboardAware = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  grouped?: boolean;
  headerAware?: boolean;
  keyboardAware?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { contentMaxWidth } = useAdaptiveLayout();
  const backgroundColor = grouped ? colors.groupedBackground : colors.background;
  const topPad = headerAware
    ? insets.top + NAV_BAR_CONTENT + 8
    : isIOS
      ? 0
      : 12;
  // Bottom: NativeTabs already folds tab-bar height into insets while horizontal;
  // do not add a fixed tab-bar spacer (Duo: bar may be vertical).
  const bottomPad = isIOS
    ? 24
    : Math.max(insets.bottom, 12) + 24;

  const body = (
    <SafeAreaView
      edges={["left", "right"]}
      style={[
        styles.screenPad,
        contentMaxWidth
          ? { width: "100%", maxWidth: contentMaxWidth, alignSelf: "center" }
          : null,
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor }]}
        contentContainerStyle={{
          paddingTop: topPad,
          paddingBottom: bottomPad,
          flexGrow: 1,
          backgroundColor,
        }}
        contentInsetAdjustmentBehavior={headerAware ? "never" : "automatic"}
        automaticallyAdjustsScrollIndicatorInsets={!headerAware}
        automaticallyAdjustKeyboardInsets={keyboardAware && isIOS}
        keyboardDismissMode={isIOS ? "interactive" : "on-drag"}
        keyboardShouldPersistTaps="handled"
      >
        {body}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor,
          paddingTop: topPad,
          paddingBottom: isIOS ? 16 : Math.max(insets.bottom, 12) + 16,
        },
      ]}
    >
      {body}
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
      android_ripple={Platform.OS === "android" ? { color: colors.fill } : undefined}
      style={({ pressed }) => [
        styles.row,
        pressed && Platform.OS === "ios" && styles.rowPressed,
      ]}
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
  trailing,
  onSubmitEditing,
  returnKeyType,
  editable = true,
  textAlign = "right",
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoComplete?: "email" | "password" | "new-password" | "off";
  textContentType?: "emailAddress" | "password" | "newPassword" | "none";
  last?: boolean;
  trailing?: React.ReactNode;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "next" | "go" | "send";
  editable?: boolean;
  textAlign?: "left" | "right";
}) {
  const { fontScale } = useWindowDimensions();
  const stacked = multiline || fontScale >= 1.3;

  return (
    <View>
      <View style={[styles.formRow, stacked && styles.formRowStacked]}>
        <Text
          style={[
            typography.body,
            styles.formLabel,
            stacked && styles.formLabelStacked,
          ]}
        >
          {label}
        </Text>
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
          accessibilityLabel={label}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          editable={editable}
          style={[
            typography.body,
            styles.formInput,
            stacked && styles.formInputStacked,
          ]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode={isIOS ? "while-editing" : undefined}
          textAlign={stacked ? "left" : textAlign}
        />
        {trailing ? <View style={styles.formTrailing}>{trailing}</View> : null}
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
  trailing,
  onSubmitEditing,
  returnKeyType,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoComplete?: "email" | "password" | "new-password" | "off";
  textContentType?: "emailAddress" | "password" | "newPassword" | "none";
  trailing?: React.ReactNode;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "next" | "go" | "send";
  editable?: boolean;
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
          accessibilityLabel={label}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          editable={editable}
          style={[typography.body, styles.input, multiline && styles.inputMultiline]}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode={isIOS ? "while-editing" : undefined}
        />
        {trailing ? <View style={styles.fieldTrailing}>{trailing}</View> : null}
      </View>
    </View>
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
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected: !!selected } : undefined}
      android_ripple={
        onPress && Platform.OS === "android"
          ? { color: colors.tintMuted }
          : undefined
      }
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
      ? colors.successMuted
      : tone === "danger"
        ? colors.dangerMuted
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
    paddingHorizontal: 20,
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
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginTop: 12,
  },
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 10,
  },
  group: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: GROUP_RADIUS,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  card: {
    backgroundColor: colors.secondaryGrouped,
    borderRadius: GROUP_RADIUS,
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  row: {
    minHeight: isIOS ? 52 : 56,
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
    minHeight: isIOS ? 52 : 56,
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
    minHeight: isIOS ? 52 : 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  formTrailing: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  formRowStacked: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  formLabel: {
    flexShrink: 0,
    maxWidth: "42%",
  },
  formLabelStacked: {
    maxWidth: "100%",
  },
  formInput: {
    flex: 1,
    color: colors.label,
    padding: 0,
    minHeight: 24,
    textAlign: "right",
  },
  formInputStacked: {
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryGrouped,
    borderRadius: isIOS ? 14 : 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  fieldTrailing: {
    minWidth: 48,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: isIOS ? 14 : 12,
    color: colors.label,
  },
  inputMultiline: { minHeight: 88, textAlignVertical: "top" },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: colors.fill,
    paddingHorizontal: 14,
    minHeight: isIOS ? 44 : 48,
    paddingVertical: 10,
    borderRadius: 999,
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: colors.tintMuted,
    borderColor: colors.tint,
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
