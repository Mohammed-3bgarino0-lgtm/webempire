import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { EMPIRE_COLORS } from "@/brand/empire";
import { useEmpire } from "@/contexts/empire";
import { appStorage } from "@/lib/app-storage";
import type { ColorMode } from "@/types/api";

const MODE_KEY = "web-empire-mobile-color-mode";

export interface EmpireColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  accent: string;
  navigation: string;
  border: string;
  shadow: string;
  danger: string;
  success: string;
}

interface ThemeContextValue {
  mode: ColorMode;
  resolvedMode: "light" | "dark";
  colors: EmpireColors;
  radius: number;
  setMode(mode: ColorMode): Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function EmpireThemeProvider({ children }: { children: React.ReactNode }) {
  const systemMode = useColorScheme();
  const { bootstrap } = useEmpire();
  const [mode, setModeState] = useState<ColorMode>("system");

  useEffect(() => {
    appStorage.getItem(MODE_KEY).then((value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setModeState(value);
        return;
      }

      if (bootstrap?.appearance.defaultColorMode) {
        setModeState(bootstrap.appearance.defaultColorMode);
      }
    });
  }, [bootstrap?.appearance.defaultColorMode]);

  const value = useMemo<ThemeContextValue>(() => {
    const resolvedMode = mode === "system" ? (systemMode === "dark" ? "dark" : "light") : mode;
    const dark = resolvedMode === "dark";
    const configuredRadius = bootstrap?.appearance.borderRadius ?? 22;

    return {
      mode,
      resolvedMode,
      radius: Math.min(Math.max(configuredRadius, 16), 30),
      colors: {
        background: dark ? EMPIRE_COLORS.darkBackground : EMPIRE_COLORS.cloud,
        surface: dark ? EMPIRE_COLORS.darkSurface : EMPIRE_COLORS.white,
        surfaceAlt: dark ? EMPIRE_COLORS.darkSurfaceAlt : EMPIRE_COLORS.lightSurfaceAlt,
        text: dark ? EMPIRE_COLORS.darkInk : EMPIRE_COLORS.lightInk,
        muted: dark ? EMPIRE_COLORS.mutedDark : EMPIRE_COLORS.mutedLight,
        primary: EMPIRE_COLORS.brandBlue,
        primaryStrong: dark ? EMPIRE_COLORS.signalCyan : EMPIRE_COLORS.brandBlueDark,
        primarySoft: dark ? "rgba(50,184,255,0.14)" : "rgba(8,118,249,0.10)",
        accent: EMPIRE_COLORS.signalCyan,
        navigation: dark ? EMPIRE_COLORS.navy : EMPIRE_COLORS.white,
        border: dark ? EMPIRE_COLORS.borderDark : EMPIRE_COLORS.borderLight,
        shadow: dark ? "#000000" : EMPIRE_COLORS.navy,
        danger: EMPIRE_COLORS.danger,
        success: EMPIRE_COLORS.success,
      },
      async setMode(nextMode) {
        setModeState(nextMode);
        await appStorage.setItem(MODE_KEY, nextMode);
      },
    };
  }, [bootstrap?.appearance.borderRadius, mode, systemMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useEmpireTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useEmpireTheme must be used inside EmpireThemeProvider");
  }
  return value;
}
