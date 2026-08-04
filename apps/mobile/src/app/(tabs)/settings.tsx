import * as Linking from "expo-linking";
import { router } from "expo-router";
import { type ReactNode, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import {
  AppScreen,
  AppText,
  Card,
  MutedText,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";
import { currentReleaseNote } from "@/lib/release-notes";
import { checkForUpdates, downloadAndApplyUpdate } from "@/lib/updates";
import type { ColorMode } from "@/types/api";

type UpdateState = {
  status: "idle" | "checking" | "available" | "up-to-date" | "error";
  message?: string;
};

export default function SettingsScreen() {
  const { session, signOut } = useAuth();
  const { bootstrap, direction, locale, setLocale } = useEmpire();
  const { colors, mode, setMode } = useEmpireTheme();
  const [updateState, setUpdateState] = useState<UpdateState>({ status: "idle" });
  const ar = direction === "rtl";

  useEffect(() => {
    void runUpdateCheck();
    // run once per language change so the message is localized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ar]);

  async function runUpdateCheck() {
    setUpdateState({ status: "checking" });
    const result = await checkForUpdates();

    if (result.error) {
      setUpdateState({ status: "error", message: result.error });
      return;
    }

    setUpdateState(
      result.available
        ? {
            status: "available",
            message: ar ? "يوجد تحديث جديد جاهز للتنزيل." : "A new update is ready to download.",
          }
        : {
            status: "up-to-date",
            message: ar ? "أنت تستخدم آخر إصدار." : "You are using the latest version.",
          },
    );
  }

  async function handleUpdate() {
    setUpdateState({ status: "checking" });
    const result = await downloadAndApplyUpdate();

    if (result.success) {
      setUpdateState({
        status: "up-to-date",
        message: ar ? "تم تحديث التطبيق." : "The app has been updated.",
      });
      return;
    }

    setUpdateState({ status: "error", message: result.error });
  }

  return (
    <AppScreen>
      <View style={styles.brandHeader}>
        <BrandLogo width={ar ? 244 : 220} />
        <View style={[styles.versionPill, { backgroundColor: colors.primarySoft }]}> 
          <AppText style={[styles.versionPillText, { color: colors.primaryStrong }]}>1.0.1 · V1.2</AppText>
        </View>
      </View>

      <SectionTitle
        eyebrow={ar ? "التفضيلات" : "PREFERENCES"}
        title={ar ? "الإعدادات" : "Settings"}
        description={
          ar
            ? "تحكم في اللغة والمظهر والحساب وروابط الدعم."
            : "Manage language, appearance, account, and support links."
        }
      />

      <SettingsCard
        symbol="◐"
        title={ar ? "المظهر" : "Appearance"}
        description={ar ? "اختر المظهر المناسب أو اتبع إعداد الجهاز." : "Choose a theme or follow your device setting."}
      >
        <View style={styles.options}>
          {(["light", "dark", "system"] as ColorMode[]).map((item) => (
            <OptionButton
              key={item}
              label={
                item === "light"
                  ? ar
                    ? "فاتح"
                    : "Light"
                  : item === "dark"
                    ? ar
                      ? "داكن"
                      : "Dark"
                    : ar
                      ? "النظام"
                      : "System"
              }
              active={mode === item}
              onPress={() => void setMode(item)}
            />
          ))}
        </View>
      </SettingsCard>

      <SettingsCard
        symbol="文"
        title={ar ? "اللغة" : "Language"}
        description={ar ? "غيّر لغة التطبيق واتجاه الواجهة." : "Change the app language and layout direction."}
      >
        <View style={styles.options}>
          {(bootstrap?.locales ?? []).map((item) => (
            <OptionButton
              key={item.code}
              label={item.nativeName}
              active={locale === item.code}
              onPress={() => void setLocale(item.code)}
            />
          ))}
        </View>
      </SettingsCard>

      <SettingsCard
        symbol="↻"
        title={ar ? "تحديثات التطبيق" : "App updates"}
        description={currentReleaseNote?.title ?? (ar ? "إمبراطورية الويب" : "Web Empire")}
      >
        <View style={[styles.statusBox, { backgroundColor: colors.surfaceAlt }]}> 
          <AppText style={[styles.statusDot, { color: updateState.status === "error" ? colors.danger : colors.primary }]}>●</AppText>
          <MutedText style={styles.statusMessage}>
            {updateState.status === "checking"
              ? ar
                ? "جاري فحص التحديثات..."
                : "Checking for updates..."
              : updateState.message ?? (ar ? "جاهز للفحص" : "Ready to check")}
          </MutedText>
        </View>
        {updateState.status === "available" ? (
          <PrimaryButton label={ar ? "تحديث الآن" : "Update now"} onPress={() => void handleUpdate()} />
        ) : (
          <SecondaryButton label={ar ? "فحص التحديثات" : "Check for updates"} onPress={() => void runUpdateCheck()} />
        )}
      </SettingsCard>

      <SettingsCard
        symbol="↗"
        title={ar ? "الموقع والدعم" : "Website & support"}
        description="webempire.site"
      >
        <View style={styles.actionList}>
          <SecondaryButton
            label={ar ? "فتح الموقع" : "Open website"}
            onPress={() => void Linking.openURL(`https://webempire.site/${locale}`)}
          />
          <SecondaryButton
            label={ar ? "الدعم والمساعدة" : "Support"}
            onPress={() => void Linking.openURL(`https://webempire.site/${locale}/support`)}
          />
          <SecondaryButton
            label={ar ? "سياسة الخصوصية" : "Privacy policy"}
            onPress={() => void Linking.openURL(`https://webempire.site/${locale}/privacy`)}
          />
        </View>
      </SettingsCard>

      <SettingsCard
        symbol="◎"
        title={ar ? "الحساب" : "Account"}
        description={session?.user.email ?? (ar ? "لم تسجل الدخول" : "Not signed in")}
      >
        {session ? (
          <SecondaryButton
            label={ar ? "تسجيل الخروج" : "Sign out"}
            onPress={() => void signOut()}
          />
        ) : (
          <PrimaryButton
            label={ar ? "تسجيل الدخول" : "Sign in"}
            onPress={() => router.push("/sign-in")}
          />
        )}
      </SettingsCard>

      <MutedText style={styles.footerNote}>
        {ar
          ? "إمبراطورية الويب · الإصدار 1.0.1 · الهوية V1.2"
          : "Web Empire · Version 1.0.1 · Identity V1.2"}
      </MutedText>
    </AppScreen>
  );
}

function SettingsCard({
  symbol,
  title,
  description,
  children,
}: {
  symbol: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { colors } = useEmpireTheme();

  return (
    <Card>
      <View style={styles.cardHead}>
        <View style={[styles.cardIcon, { backgroundColor: colors.primarySoft }]}> 
          <AppText style={[styles.cardSymbol, { color: colors.primary }]}>{symbol}</AppText>
        </View>
        <View style={styles.cardCopy}>
          <AppText style={styles.title}>{title}</AppText>
          <MutedText style={styles.cardDescription}>{description}</MutedText>
        </View>
      </View>
      {children}
    </Card>
  );
}

function OptionButton({ label, active, onPress }: { label: string; active: boolean; onPress(): void }) {
  const { colors } = useEmpireTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: active ? colors.primary : colors.surfaceAlt,
          borderColor: active ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <AppText style={{ color: active ? "#FFFFFF" : colors.text, fontWeight: "800", fontSize: 13 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brandHeader: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  versionPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  versionPillText: {
    fontSize: 10,
    fontWeight: "900",
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSymbol: {
    fontSize: 18,
    fontWeight: "900",
  },
  cardCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 21,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  statusBox: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  statusDot: {
    fontSize: 10,
  },
  statusMessage: {
    flex: 1,
    fontSize: 13,
  },
  actionList: {
    gap: 9,
  },
  footerNote: {
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 4,
  },
});
