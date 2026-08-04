import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import { AppScreen, AppText, Card, MutedText, PrimaryButton, SectionTitle } from "@/components/ui";
import { useAuth } from "@/contexts/auth";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";
import { createCheckout } from "@/lib/api";

export default function PricingScreen() {
  const { session } = useAuth();
  const { bootstrap, direction, locale } = useEmpire();
  const { colors } = useEmpireTheme();
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ar = direction === "rtl";

  async function subscribe(planId: string) {
    if (!session?.access_token) {
      router.push("/sign-in");
      return;
    }

    setPendingPlan(planId);
    setError(null);
    try {
      const checkout = await createCheckout(planId, locale, session.access_token);
      await WebBrowser.openBrowserAsync(checkout.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "CHECKOUT_FAILED");
    } finally {
      setPendingPlan(null);
    }
  }

  return (
    <AppScreen>
      <View style={styles.headerRow}>
        <BrandLogo variant="mark" size={64} />
        <View style={styles.headerCopy}>
          <SectionTitle
            eyebrow={ar ? "رصيد أكثر" : "MORE CREDITS"}
            title={ar ? "النقاط والخطط" : "Credits & plans"}
            description={
              ar
                ? "اختر الخطة المناسبة، وأكمل الاشتراك عبر صفحة الدفع الآمنة."
                : "Choose the right plan and complete your subscription through secure checkout."
            }
          />
        </View>
      </View>

      <View style={[styles.notice, { backgroundColor: colors.primarySoft, borderColor: `${colors.primary}25` }]}> 
        <AppText style={[styles.noticeIcon, { color: colors.primary }]}>✓</AppText>
        <MutedText style={styles.noticeText}>
          {ar
            ? "الخطة والرصيد يتزامنان تلقائيًا بين الموقع والتطبيق بعد اكتمال الدفع."
            : "Your plan and balance sync automatically across web and mobile after payment."}
        </MutedText>
      </View>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: `${colors.danger}12` }]}> 
          <AppText style={{ color: colors.danger }}>{error}</AppText>
        </View>
      ) : null}

      <View style={styles.list}>
        {(bootstrap?.plans ?? []).map((plan, index) => {
          const paid = plan.priceSar > 0;
          const featured = paid && index === 1;

          return (
            <Card
              key={plan.id}
              style={[
                styles.planCard,
                featured
                  ? {
                      borderColor: colors.primary,
                      borderWidth: 2,
                    }
                  : undefined,
              ]}
            >
              <View style={styles.planTop}>
                <View style={[styles.planIcon, { backgroundColor: colors.primarySoft }]}> 
                  <AppText style={[styles.planSymbol, { color: colors.primary }]}>
                    {paid ? "◆" : "◇"}
                  </AppText>
                </View>
                {featured ? (
                  <View style={[styles.recommended, { backgroundColor: colors.primary }]}> 
                    <AppText style={styles.recommendedText}>{ar ? "الأكثر اختيارًا" : "Most popular"}</AppText>
                  </View>
                ) : null}
              </View>

              <View style={styles.planHead}>
                <View style={styles.planNameWrap}>
                  <AppText style={styles.planName}>{plan.name}</AppText>
                  <MutedText>{plan.description}</MutedText>
                </View>
                <View style={styles.priceWrap}>
                  <AppText style={[styles.price, { color: colors.primary }]}>
                    {plan.priceSar.toLocaleString()}
                  </AppText>
                  <MutedText style={styles.currency}>{ar ? "ر.س" : "SAR"}</MutedText>
                </View>
              </View>

              <View style={[styles.creditsBox, { backgroundColor: colors.surfaceAlt }]}> 
                <AppText style={styles.credits}>{plan.monthlyCredits.toLocaleString()}</AppText>
                <MutedText>{ar ? "نقطة شهريًا" : "monthly credits"}</MutedText>
              </View>

              <View style={styles.features}>
                {plan.dailyAiRuns ? (
                  <FeatureRow label={ar ? `${plan.dailyAiRuns} تشغيلات ذكاء اصطناعي يوميًا` : `${plan.dailyAiRuns} AI runs per day`} />
                ) : null}
                {plan.maxOutputTokens ? (
                  <FeatureRow label={ar ? `حتى ${plan.maxOutputTokens.toLocaleString()} رمز للإخراج` : `Up to ${plan.maxOutputTokens.toLocaleString()} output tokens`} />
                ) : null}
                <FeatureRow label={ar ? "رصيد موحد بين الموقع والتطبيق" : "Shared balance across web and mobile"} />
              </View>

              {paid ? (
                <PrimaryButton
                  label={ar ? "اختيار الخطة" : "Choose plan"}
                  onPress={() => void subscribe(plan.id)}
                  loading={pendingPlan === plan.id}
                />
              ) : (
                <View style={[styles.currentPill, { backgroundColor: colors.surfaceAlt }]}> 
                  <AppText style={[styles.currentText, { color: colors.primaryStrong }]}>
                    {ar ? "متاحة للجميع" : "Available to everyone"}
                  </AppText>
                </View>
              )}
            </Card>
          );
        })}
      </View>
    </AppScreen>
  );
}

function FeatureRow({ label }: { label: string }) {
  const { colors } = useEmpireTheme();

  return (
    <View style={styles.featureRow}>
      <View style={[styles.check, { backgroundColor: colors.primarySoft }]}> 
        <AppText style={[styles.checkText, { color: colors.primary }]}>✓</AppText>
      </View>
      <MutedText style={styles.featureLabel}>{label}</MutedText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  headerCopy: {
    flex: 1,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  noticeIcon: {
    fontSize: 18,
    fontWeight: "900",
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 22,
  },
  errorBox: {
    borderRadius: 14,
    padding: 13,
  },
  list: {
    gap: 14,
  },
  planCard: {
    padding: 20,
    gap: 16,
  },
  planTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  planSymbol: {
    fontSize: 20,
    fontWeight: "900",
  },
  recommended: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  recommendedText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  planHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  },
  planNameWrap: {
    flex: 1,
    gap: 4,
  },
  planName: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "900",
  },
  priceWrap: {
    alignItems: "center",
  },
  price: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
  },
  currency: {
    fontSize: 11,
  },
  creditsBox: {
    borderRadius: 17,
    padding: 15,
  },
  credits: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
  },
  features: {
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontSize: 13,
    fontWeight: "900",
  },
  featureLabel: {
    flex: 1,
    fontSize: 13,
  },
  currentPill: {
    minHeight: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  currentText: {
    fontWeight: "900",
    textAlign: "center",
  },
});
