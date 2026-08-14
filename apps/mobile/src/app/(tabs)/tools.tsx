import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { BrandLogo } from "@/components/brand-logo";
import { ToolCard } from "@/components/tool-card";
import { AppScreen, AppText, ErrorState, MutedText, SectionTitle } from "@/components/ui";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";

export default function ToolsScreen() {
  const { bootstrap, direction, error, refresh } = useEmpire();
  const { colors, radius } = useEmpireTheme();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const ar = direction === "rtl";

  const tools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (bootstrap?.tools ?? []).filter((tool) => {
      if (categoryId && tool.categoryId !== categoryId) {
        return false;
      }
      return !normalized || `${tool.title} ${tool.description}`.toLowerCase().includes(normalized);
    });
  }, [bootstrap?.tools, categoryId, query]);

  if (error || !bootstrap) {
    return (
      <AppScreen>
        <ErrorState message={error ?? "BOOTSTRAP_MISSING"} onRetry={() => void refresh()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.headerRow}>
        <BrandLogo variant="mark" size={58} />
        <View style={styles.headerCopy}>
          <SectionTitle
            eyebrow={ar ? "مكتبة إمبراطورية الويب" : "TOOL LIBRARY"}
            title={ar ? "كل الأدوات" : "All tools"}
            description={
              ar
                ? "ابحث واختر وشغّل أدواتك مباشرة من الجوال."
                : "Search, choose, and run your tools directly from mobile."
            }
          />
        </View>
      </View>

      <View
        style={[
          styles.searchShell,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: Math.min(radius, 18),
          },
        ]}
      >
        <AppText style={[styles.searchIcon, { color: colors.primary }]}>⌕</AppText>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={ar ? "ابحث باسم الأداة أو وظيفتها..." : "Search by tool name or purpose..."}
          placeholderTextColor={colors.muted}
          style={[
            styles.search,
            {
              color: colors.text,
              textAlign: ar ? "right" : "left",
            },
          ]}
        />
      </View>

      <View style={styles.chips}>
        <CategoryChip label={ar ? "الكل" : "All"} active={!categoryId} onPress={() => setCategoryId(null)} />
        {bootstrap.categories.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.name}
            active={categoryId === category.id}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
      </View>

      <View style={styles.resultRow}>
        <MutedText>
          {tools.length.toLocaleString()} {ar ? "أداة" : "tools"}
        </MutedText>
        {query || categoryId ? (
          <Pressable
            onPress={() => {
              setQuery("");
              setCategoryId(null);
            }}
          >
            <AppText style={[styles.clearText, { color: colors.primary }]}>
              {ar ? "مسح التصفية" : "Clear filters"}
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </View>
    </AppScreen>
  );
}

function CategoryChip({ label, active, onPress }: { label: string; active: boolean; onPress(): void }) {
  const { colors } = useEmpireTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.primary : colors.surface,
          borderColor: active ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <AppText style={{ color: active ? "#FFFFFF" : colors.text, fontSize: 13, fontWeight: "800" }}>
        {label}
      </AppText>
    </Pressable>
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
  searchShell: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 15,
    gap: 10,
  },
  searchIcon: {
    fontSize: 22,
    fontWeight: "900",
  },
  search: {
    flex: 1,
    minHeight: 54,
    fontSize: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  clearText: {
    fontSize: 13,
    fontWeight: "900",
  },
  list: {
    gap: 14,
  },
});
