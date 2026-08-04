import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import { AppScreen, AppText, Card, MutedText, PrimaryButton } from "@/components/ui";
import { useAuth } from "@/contexts/auth";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";

export default function SignInScreen() {
  const { signIn, signUp } = useAuth();
  const { direction } = useEmpire();
  const { colors, radius } = useEmpireTheme();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ar = direction === "rtl";

  async function submit() {
    setPending(true);
    setError(null);

    try {
      if (mode === "sign-in") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      router.back();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "AUTH_FAILED");
    } finally {
      setPending(false);
    }
  }

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.border,
      borderRadius: Math.min(radius, 16),
      textAlign: ar ? ("right" as const) : ("left" as const),
    },
  ];

  return (
    <AppScreen contentStyle={styles.container}>
      <Card style={styles.authCard}>
        <BrandLogo width={ar ? 258 : 230} />

        <View style={[styles.modeSwitch, { backgroundColor: colors.surfaceAlt }]}> 
          <ModeButton
            label={ar ? "تسجيل الدخول" : "Sign in"}
            active={mode === "sign-in"}
            onPress={() => setMode("sign-in")}
          />
          <ModeButton
            label={ar ? "إنشاء حساب" : "Create account"}
            active={mode === "sign-up"}
            onPress={() => setMode("sign-up")}
          />
        </View>

        <View style={styles.copy}>
          <AppText style={styles.title}>
            {mode === "sign-in"
              ? ar
                ? "مرحبًا بعودتك"
                : "Welcome back"
              : ar
                ? "ابدأ داخل إمبراطوريتك"
                : "Start your empire"}
          </AppText>
          <MutedText style={styles.description}>
            {ar
              ? "استخدم نفس حساب الموقع للوصول إلى أدواتك ورصيدك وخطتك من الجوال."
              : "Use the same web account to access your tools, balance, and plan on mobile."}
          </MutedText>
        </View>

        <View style={styles.fields}>
          <View style={styles.fieldGroup}>
            <AppText style={styles.label}>{ar ? "البريد الإلكتروني" : "Email"}</AppText>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder={ar ? "name@example.com" : "name@example.com"}
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              style={inputStyle}
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText style={styles.label}>{ar ? "كلمة المرور" : "Password"}</AppText>
            <TextInput
              autoCapitalize="none"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              secureTextEntry
              placeholder={ar ? "8 أحرف أو أكثر" : "8 characters or more"}
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              style={inputStyle}
            />
          </View>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.danger}12` }]}> 
            <AppText style={{ color: colors.danger }}>{error}</AppText>
          </View>
        ) : null}

        <PrimaryButton
          label={
            mode === "sign-in"
              ? ar
                ? "دخول آمن"
                : "Secure sign in"
              : ar
                ? "إنشاء الحساب"
                : "Create account"
          }
          onPress={() => void submit()}
          loading={pending}
          disabled={!email.trim() || password.length < 8}
        />

        <MutedText style={styles.legalNote}>
          {ar
            ? "بالمتابعة أنت توافق على الشروط وسياسة الخصوصية المنشورة في webempire.site."
            : "By continuing, you agree to the terms and privacy policy published on webempire.site."}
        </MutedText>
      </Card>
    </AppScreen>
  );
}

function ModeButton({ label, active, onPress }: { label: string; active: boolean; onPress(): void }) {
  const { colors } = useEmpireTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.modeButton,
        {
          backgroundColor: active ? colors.surface : "transparent",
          borderColor: active ? colors.border : "transparent",
        },
      ]}
    >
      <AppText style={[styles.modeLabel, { color: active ? colors.primary : colors.muted }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingVertical: 24,
  },
  authCard: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    padding: 22,
    gap: 18,
  },
  modeSwitch: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  copy: {
    gap: 6,
  },
  title: {
    fontSize: 29,
    lineHeight: 38,
    fontWeight: "900",
  },
  description: {
    lineHeight: 25,
  },
  fields: {
    gap: 14,
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorBox: {
    borderRadius: 14,
    padding: 12,
  },
  legalNote: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
  },
});
