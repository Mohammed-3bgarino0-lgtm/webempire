import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import { ToolCard } from "@/components/tool-card";
import {
  AppScreen,
  AppText,
  Card,
  ErrorState,
  MutedText,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
} from "@/components/ui";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";

export default function HomeScreen() {
  const { bootstrap, direction, error, refresh } = useEmpire();
  const { colors, radius, resolvedMode } = useEmpireTheme();
  const ar = direction === "rtl";

  if (error || !bootstrap) {
    return (
      <AppScreen>
        <ErrorState message={error ?? "BOOTSTRAP_MISSING"} onRetry={() => void refresh()} />
      </AppScreen>
    );
  }

  const featured = bootstrap.tools.filter((tool) => tool.isFeatured).slice(0, 4);

  return (
    <AppScreen>
      <View
        style={[
          styles.hero,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: Math.max(radius, 26),
            shadowColor: colors.shadow,
            shadowOpacity: resolvedMode === "dark" ? 0.24 : 0.09,
          },
        ]}
      >
        <View pointerEvents="none" style={[styles.heroGlow, { backgroundColor: colors.primarySoft }]} />

        <View style={styles.logoRow}>
          <BrandLogo width={ar ? 248 : 220} />
          <View style={[styles.versionBadge, { backgroundColor: colors.primarySoft }]}>
            <AppText style={[styles.versionText, { color: colors.primaryStrong }]}>V1.2</AppText>
          </View>
        </View>

        <View style={styles.heroCopy}>
          <AppText style={styles.heroTitle}>
            {ar ? "كل أدواتك الرقمية في تطبيق واحد" : "Your digital tools in one app"}
          </AppText>
          <MutedText style={styles.heroText}>{bootstrap.identity.tagline}</MutedText>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={ar ? "استكشف الأدوات" : "Explore tools"}
            onPress={() => router.push("/(tabs)/tools")}
          />
          <SecondaryButton
            label={ar ? "النقاط والخطط" : "Credits & plans"}
            onPress={() => router.push("/pricing")}
          />
        </View>
      </View>

      <View style={styles.stats}>
        <MetricCard
          symbol="◇"
          value={bootstrap.tools.length.toLocaleString()}
          label={ar ? "أداة متاحة" : "Available tools"}
        />
        <MetricCard
          symbol="▦"
          value={bootstrap.categories.length.toLocaleString()}
          label={ar ? "تصنيف منظم" : "Categories"}
        />
      </View>

      <SectionTitle
        eyebrow={ar ? "مختارة لك" : "FEATURED"}
        title={ar ? "أدوات مميزة" : "Featured tools"}
        description={
          ar
            ? "حساب واحد ورصيد موحد بين الموقع وتطبيق إمبراطورية الويب."
            : "One account and one balance across Web Empire on web and mobile."
        }
      />

      <View style={styles.list}>
        {featured.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </View>
    </AppScreen>
  );
}

function MetricCard({ symbol, value, label }: { symbol: string; value: string; label: string }) {
  const { colors } = useEmpireTheme();

  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: colors.primarySoft }]}>
        <AppText style={[styles.statSymbol, { color: colors.primary }]}>{symbol}</AppText>
      </View>
      <AppText style={styles.statValue}>{value}</AppText>
      <MutedText style={styles.statLabel}>{label}</MutedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    padding: 22,
    gap: 20,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 4,
  },
  heroGlow: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    top: -120,
    left: -80,
  },
  logoRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    zIndex: 1,
  },
  versionBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  heroCopy: {
    gap: 8,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 44,
    fontWeight: "900",
  },
  heroText: {
    fontSize: 17,
    lineHeight: 28,
  },
  actions: {
    gap: 10,
    zIndex: 1,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minHeight: 148,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statSymbol: {
    fontSize: 20,
    fontWeight: "900",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
  },
  statLabel: {
    fontSize: 13,
  },
  list: {
    gap: 14,
  },
});
