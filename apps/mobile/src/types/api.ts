export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type Direction = "rtl" | "ltr";
export type ColorMode = "light" | "dark" | "system";

export interface AppearanceSettings {
  presetKey: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  inkColor: string;
  darkBackgroundColor: string;
  darkSurfaceColor: string;
  darkInkColor: string;
  borderRadius: number;
  defaultColorMode: ColorMode;
  fontPreset: string;
}

export interface LocaleSummary {
  code: string;
  localeCode: string;
  name: string;
  nativeName: string;
  direction: Direction;
}

export interface ToolSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  engineType: string;
  pricingMode: "free" | "fixed" | "dynamic";
  fixedPoints: number;
  minimumPoints: number;
  requiresAuth: boolean;
  isFeatured: boolean;
  categoryId: string;
}

export interface PlanSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceSar: number;
  monthlyCredits: number;
  dailyAiRuns: number | null;
  maxOutputTokens: number | null;
}

export interface BootstrapResponse {
  locale: {
    id: string;
    code: string;
    locale_code: string;
    name: string;
    native_name: string;
    direction: Direction;
  };
  appearance: AppearanceSettings;
  locales: LocaleSummary[];
  identity: {
    siteName: string;
    siteNameEn: string;
    tagline: string;
    homeSeoTitle: string;
    homeSeoDescription: string;
  };
  messages: Record<string, string>;
  categories: CategorySummary[];
  tools: ToolSummary[];
  plans: PlanSummary[];
}

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  style_key: string;
}

export interface ToolFieldOption {
  label: string;
  value: string;
}

export interface ToolInputField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "date" | "email" | "url" | "checkbox";
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  defaultValue?: string | number | boolean;
  options?: ToolFieldOption[];
}

export interface ToolDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  engineType: string;
  inputSchema: { submitLabel: string; fields: ToolInputField[] };
  pricingMode: "free" | "fixed" | "dynamic";
  fixedPoints: number;
  minimumPoints: number;
  requiresAuth: boolean;
  categoryId: string;
}

export interface ToolRunResponse {
  runId: string;
  title: string;
  text?: string;
  data?: JsonValue;
  creditsCharged: number;
  balanceAfter?: number;
}
