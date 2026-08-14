import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText, Card, MutedText } from "@/components/ui";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";
import type { ToolSummary } from "@/types/api";

export function ToolCard({ tool }: { tool: ToolSummary }) {
  const { direction } = useEmpire();
  const { colors } = useEmpireTheme();
  const ar = direction === "rtl";
  const isAi = tool.engineType.startsWith("ai_");
  const price =
    tool.pricingMode === "free"
      ? ar
        ? "مجاني"
        : "Free"
      : tool.pricingMode === "fixed"
        ? `${tool.fixedPoints} pts`
        : `${ar ? "من" : "From"} ${tool.minimumPoints} pts`;

  return (
    <Pressable accessibilityRole="button" onPress={() => router.push(`/tool/${tool.slug}`)}>
      {({ pressed }) => (
        <Card style={{ opacity: pressed ? 0.84 : 1 }}>
          <View style={styles.head}>
            <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
              <AppText style={[styles.iconText, { color: colors.primary }]}>
                {isAi ? "AI" : "↗"}
              </AppText>
            </View>
            <View style={[styles.priceBadge, { backgroundColor: colors.surfaceAlt }]}>
              <AppText style={[styles.price, { color: colors.primaryStrong }]}>{price}</AppText>
            </View>
          </View>

          <View style={styles.copy}>
            <AppText style={styles.title}>{tool.title}</AppText>
            <MutedText numberOfLines={3} style={styles.description}>
              {tool.description}
            </MutedText>
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <MutedText style={styles.metaText}>{tool.engineType.replaceAll("_", " ")}</MutedText>
            <AppText style={[styles.openText, { color: colors.primary }]}>
              {ar ? "فتح الأداة ←" : "Open tool →"}
            </AppText>
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontWeight: "900",
    fontSize: 16,
  },
  priceBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  price: {
    fontSize: 12,
    fontWeight: "900",
  },
  copy: {
    gap: 5,
  },
  title: {
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 28,
  },
  description: {
    lineHeight: 24,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  metaText: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  openText: {
    fontSize: 12,
    fontWeight: "900",
  },
});
