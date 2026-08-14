import type { PropsWithChildren, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  type TextProps,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";

export function AppScreen({
  children,
  scroll = true,
  contentStyle,
}: PropsWithChildren<{ scroll?: boolean; contentStyle?: StyleProp<ViewStyle> }>) {
  const { colors } = useEmpireTheme();
  const content = <View style={[styles.screenContent, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View
        pointerEvents="none"
        style={[styles.topGlow, { backgroundColor: colors.primarySoft }]}
      />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function AppText({ children, style, ...props }: TextProps & { children?: ReactNode }) {
  const { direction } = useEmpire();
  const { colors } = useEmpireTheme();

  return (
    <Text
      {...props}
      style={[
        styles.text,
        {
          color: colors.text,
          textAlign: direction === "rtl" ? "right" : "left",
          writingDirection: direction,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function MutedText(props: TextProps & { children?: ReactNode }) {
  const { colors } = useEmpireTheme();
  return <AppText {...props} style={[{ color: colors.muted }, props.style]} />;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors, radius, resolvedMode } = useEmpireTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: Math.max(radius, 20),
          shadowColor: colors.shadow,
          shadowOpacity: resolvedMode === "dark" ? 0.24 : 0.08,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress(): void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { colors, radius } = useEmpireTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary,
          borderRadius: Math.min(radius, 17),
          opacity: disabled || loading ? 0.52 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          shadowColor: colors.primary,
        },
      ]}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{label}</Text>}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress(): void }) {
  const { colors, radius } = useEmpireTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.secondaryButton,
        {
          backgroundColor: colors.primarySoft,
          borderColor: colors.primary,
          borderRadius: Math.min(radius, 17),
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <AppText style={[styles.secondaryButtonText, { color: colors.primaryStrong }]}>{label}</AppText>
    </Pressable>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const { colors } = useEmpireTheme();

  return (
    <View style={styles.sectionTitle}>
      {eyebrow ? (
        <View style={[styles.eyebrowPill, { backgroundColor: colors.primarySoft }]}>
          <AppText style={[styles.eyebrow, { color: colors.primaryStrong }]}>{eyebrow}</AppText>
        </View>
      ) : null}
      <AppText style={styles.heading}>{title}</AppText>
      {description ? <MutedText style={styles.description}>{description}</MutedText> : null}
    </View>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  const { colors } = useEmpireTheme();
  return (
    <View style={styles.loading}>
      <View style={[styles.loadingMark, { backgroundColor: colors.primarySoft }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
      <MutedText>{label}</MutedText>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { direction } = useEmpire();
  const { colors } = useEmpireTheme();
  const ar = direction === "rtl";

  return (
    <Card>
      <AppText style={[styles.errorTitle, { color: colors.danger }]}>
        {ar ? "حدث خطأ" : "Something went wrong"}
      </AppText>
      <MutedText>{message}</MutedText>
      {onRetry ? (
        <View style={styles.retry}>
          <PrimaryButton label={ar ? "إعادة المحاولة" : "Try again"} onPress={onRetry} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: -150,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 38,
    gap: 18,
    zIndex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 25,
  },
  card: {
    borderWidth: 1,
    padding: 18,
    gap: 11,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionTitle: {
    gap: 7,
  },
  eyebrowPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  eyebrow: {
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.1,
  },
  heading: {
    fontSize: 29,
    lineHeight: 38,
    fontWeight: "900",
  },
  description: {
    fontSize: 15,
    lineHeight: 25,
  },
  loading: {
    flex: 1,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingMark: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    fontWeight: "900",
    fontSize: 18,
  },
  retry: {
    marginTop: 8,
  },
});
