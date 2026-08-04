import { Tabs } from "expo-router";
import { type ColorValue, StyleSheet, Text, View } from "react-native";

import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";

export default function TabsLayout() {
  const { direction } = useEmpire();
  const { colors, resolvedMode } = useEmpireTheme();
  const ar = direction === "rtl";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: {
          backgroundColor: colors.navigation,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 78,
          paddingTop: 7,
          paddingBottom: 9,
          shadowColor: colors.shadow,
          shadowOpacity: resolvedMode === "dark" ? 0.24 : 0.1,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -8 },
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: ar ? "الرئيسية" : "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph symbol="⌂" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: ar ? "الأدوات" : "Tools",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph symbol="◇" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: ar ? "رصيدي" : "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph symbol="◉" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: ar ? "الإعدادات" : "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph symbol="⚙" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabGlyph({ symbol, color, focused }: { symbol: string; color: ColorValue; focused: boolean }) {
  const { colors } = useEmpireTheme();

  return (
    <View
      style={[
        styles.glyph,
        {
          backgroundColor: focused ? colors.primarySoft : "transparent",
          borderColor: focused ? `${colors.primary}30` : "transparent",
        },
      ]}
    >
      <Text style={[styles.glyphText, { color }]}>{symbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
  },
  glyph: {
    width: 38,
    height: 30,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glyphText: {
    fontSize: 18,
    fontWeight: "900",
  },
});
