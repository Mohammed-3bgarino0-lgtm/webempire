import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BrandLogo } from "@/components/brand-logo";
import { LoadingState } from "@/components/ui";
import { AuthProvider } from "@/contexts/auth";
import { EmpireProvider, useEmpire } from "@/contexts/empire";
import { EmpireThemeProvider, useEmpireTheme } from "@/contexts/theme";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <EmpireProvider>
          <EmpireThemeProvider>
            <AppNavigator />
          </EmpireThemeProvider>
        </EmpireProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigator() {
  const { loading, direction } = useEmpire();
  const { resolvedMode, colors } = useEmpireTheme();
  const ar = direction === "rtl";

  useEffect(() => {
    if (!loading) {
      void SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <BrandLogo variant="mark" size={92} />
          <LoadingState label={ar ? "جاري تجهيز إمبراطوريتك..." : "Preparing your empire..."} />
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navigation },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerBackTitle: ar ? "رجوع" : "Back",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="tool/[slug]"
          options={{ title: ar ? "تشغيل الأداة" : "Tool workspace" }}
        />
        <Stack.Screen
          name="pricing"
          options={{ title: ar ? "النقاط والخطط" : "Credits & plans" }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            title: ar ? "حساب إمبراطورية الويب" : "Web Empire account",
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    width: "100%",
    maxWidth: 420,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 30,
    padding: 28,
  },
});
