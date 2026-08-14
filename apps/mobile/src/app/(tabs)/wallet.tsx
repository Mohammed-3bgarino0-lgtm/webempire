import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import {
  AppText,
  Card,
  ErrorState,
  LoadingState,
  MutedText,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";
import { getAccount } from "@/lib/api";
import type { AccountResponse } from "@/types/api";

export default function WalletScreen() {
  const { session } = useAuth();
  const { direction } = useEmpire();
  const { colors } = useEmpireTheme();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ar = direction === "rtl";
  const accessToken = session?.access_token;

  const load = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setAccount(await getAccount(accessToken));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ACCOUNT_FAILED");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.guest}>
          <Card style={styles.guestCard}>
            <BrandLogo variant="mark" size={84} />
            <SectionTitle
              eyebrow={ar ? "محفظة موحدة" : "ONE WALLET"}
              title={ar ? "رصيدك وخطتك في مكان واحد" : "Your balance and plan in one place"}
              description={
                ar
                  ? "سجل الدخول لمشاهدة الرصيد والخطة وسجل تشغيلات الموقع والتطبيق."
                  : "Sign in to see the same balance, plan, and run history across web and mobile."
              }
            />
            <PrimaryButton
              label={ar ? "تسجيل الدخول" : "Sign in"}
              onPress={() => router.push("/sign-in")}
            />
          </Card>
        </ScrollView>
      </View>
    );
  }

  if (loading && !account) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingState label={ar ? "جاري تحديث رصيدك..." : "Updating your balance..."} />
      </View>
    );
  }

  if (error && !account) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 18 }}>
        <ErrorState message={error} onRetry={() => void load()} />
      </View>
    );
  }

  const planRelation = account?.subscription?.plans;
  const plan = Array.isArray(planRelation) ? planRelation[0] : planRelation;
  const balance = Number(account?.wallet.balance ?? 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <BrandLogo variant="mark" size={58} />
        <View style={styles.headerCopy}>
          <SectionTitle
            eyebrow={ar ? "حسابك" : "YOUR ACCOUNT"}
            title={ar ? "رصيدي وخطتي" : "Wallet & plan"}
            description={account?.user.email ?? ""}
          />
        </View>
      </View>

      <Card style={[styles.balanceCard, { backgroundColor: colors.primary }]}> 
        <View style={styles.balanceTop}>
          <AppText style={styles.balanceLabel}>{ar ? "الرصيد المتاح" : "Available balance"}</AppText>
          <View style={styles.livePill}>
            <AppText style={styles.liveText}>{ar ? "متزامن" : "Synced"}</AppText>
          </View>
        </View>
        <AppText style={styles.balanceValue}>{balance.toLocaleString()}</AppText>
        <AppText style={styles.balanceUnit}>{ar ? "نقطة" : "credits"}</AppText>
        <AppText style={styles.balanceHint}>
          {ar ? "نفس الرصيد في الموقع والتطبيق" : "The same balance on web and mobile"}
        </AppText>
      </Card>

      <View style={styles.metrics}>
        <Card style={styles.metric}>
          <View style={[styles.metricIcon, { backgroundColor: colors.primarySoft }]}> 
            <AppText style={[styles.metricSymbol, { color: colors.primary }]}>◆</AppText>
          </View>
          <MutedText>{ar ? "الخطة الحالية" : "Current plan"}</MutedText>
          <AppText style={styles.metricValue}>
            {plan ? (ar ? plan.name_ar : plan.name_en) : ar ? "مجاني" : "Free"}
          </AppText>
        </Card>
        <Card style={styles.metric}>
          <View style={[styles.metricIcon, { backgroundColor: colors.primarySoft }]}> 
            <AppText style={[styles.metricSymbol, { color: colors.primary }]}>↻</AppText>
          </View>
          <MutedText>{ar ? "آخر تحديث" : "Last refresh"}</MutedText>
          <AppText style={styles.metricSmallValue}>{ar ? "الآن" : "Now"}</AppText>
        </Card>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label={ar ? "عرض الخطط" : "View plans"} onPress={() => router.push("/pricing")} />
        <SecondaryButton label={ar ? "تحديث الرصيد" : "Refresh balance"} onPress={() => void load()} />
      </View>

      <SectionTitle
        eyebrow={ar ? "النشاط" : "ACTIVITY"}
        title={ar ? "آخر التشغيلات" : "Recent runs"}
        description={ar ? "آخر الأدوات التي شغّلتها من حسابك." : "Your latest tool runs across your account."}
      />

      <View style={styles.runs}>
        {(account?.runs ?? []).length ? (
          (account?.runs ?? []).map((run) => {
            const relation = run.tools;
            const tool = Array.isArray(relation) ? relation[0] : relation;

            return (
              <Card key={run.id}>
                <View style={styles.runHead}>
                  <View style={[styles.runIcon, { backgroundColor: colors.primarySoft }]}> 
                    <AppText style={[styles.runSymbol, { color: colors.primary }]}>↗</AppText>
                  </View>
                  <View style={styles.runCopy}>
                    <AppText style={styles.runTitle}>
                      {tool ? (ar ? tool.title_ar : tool.title_en) : ar ? "أداة" : "Tool"}
                    </AppText>
                    <MutedText style={styles.date}>{new Date(run.created_at).toLocaleString()}</MutedText>
                  </View>
                  <AppText style={[styles.charge, { color: colors.primary }]}>-{run.credits_charged}</AppText>
                </View>
                <View style={[styles.statusRow, { borderTopColor: colors.border }]}> 
                  <MutedText style={styles.statusLabel}>{ar ? "الحالة" : "Status"}</MutedText>
                  <AppText style={[styles.statusValue, { color: run.status === "completed" ? colors.success : colors.muted }]}> 
                    {run.status}
                  </AppText>
                </View>
              </Card>
            );
          })
        ) : (
          <Card>
            <MutedText style={styles.emptyText}>
              {ar ? "لا توجد تشغيلات بعد. افتح مكتبة الأدوات وابدأ أول تجربة." : "No runs yet. Open the tools library to get started."}
            </MutedText>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  guest: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 18,
  },
  guestCard: {
    maxWidth: 520,
    alignSelf: "center",
  },
  content: {
    padding: 18,
    gap: 18,
    paddingBottom: 44,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  headerCopy: {
    flex: 1,
  },
  balanceCard: {
    borderWidth: 0,
    padding: 22,
    minHeight: 210,
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  balanceLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  livePill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  balanceValue: {
    color: "#FFFFFF",
    fontSize: 54,
    lineHeight: 62,
    fontWeight: "900",
  },
  balanceUnit: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  balanceHint: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
  },
  metrics: {
    flexDirection: "row",
    gap: 12,
  },
  metric: {
    flex: 1,
    minHeight: 160,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  metricSymbol: {
    fontSize: 18,
    fontWeight: "900",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  metricSmallValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  actions: {
    gap: 10,
  },
  runs: {
    gap: 12,
  },
  runHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  runIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  runSymbol: {
    fontSize: 18,
    fontWeight: "900",
  },
  runCopy: {
    flex: 1,
    gap: 2,
  },
  runTitle: {
    fontWeight: "900",
    fontSize: 16,
  },
  charge: {
    fontSize: 15,
    fontWeight: "900",
  },
  date: {
    fontSize: 11,
  },
  statusRow: {
    borderTopWidth: 1,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 25,
  },
});
