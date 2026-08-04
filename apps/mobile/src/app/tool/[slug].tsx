import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

import {
  AppScreen,
  AppText,
  Card,
  ErrorState,
  LoadingState,
  MutedText,
  PrimaryButton,
  SectionTitle,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth";
import { useEmpire } from "@/contexts/empire";
import { useEmpireTheme } from "@/contexts/theme";
import { getTool, runTool } from "@/lib/api";
import type { ToolDetail, ToolInputField, ToolRunResponse } from "@/types/api";

export default function ToolScreen() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = String(params.slug ?? "");
  const { session } = useAuth();
  const { direction, locale } = useEmpire();
  const { colors } = useEmpireTheme();
  const [tool, setTool] = useState<ToolDetail | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<ToolRunResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ar = direction === "rtl";

  useEffect(() => {
    let active = true;

    getTool(slug, locale)
      .then((data) => {
        if (!active) {
          return;
        }
        setTool(data);
        setValues(
          Object.fromEntries(
            data.inputSchema.fields
              .filter((field) => field.defaultValue !== undefined)
              .map((field) => [field.key, field.defaultValue]),
          ),
        );
        setError(null);
      })
      .catch((caught) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : "TOOL_FAILED");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug, locale]);

  const missingRequired = useMemo(
    () =>
      tool?.inputSchema.fields.some((field) => {
        if (!field.required) {
          return false;
        }
        const value = values[field.key];
        return value === undefined || value === null || value === "";
      }) ?? true,
    [tool?.inputSchema.fields, values],
  );

  async function execute() {
    if (!tool) {
      return;
    }

    if (tool.requiresAuth && !session) {
      router.push("/sign-in");
      return;
    }

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      setResult(await runTool(tool.slug, locale, values, session?.access_token));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "TOOL_RUN_FAILED");
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingState label={ar ? "جاري تجهيز الأداة..." : "Preparing tool..."} />
      </View>
    );
  }

  if (error && !tool) {
    return (
      <AppScreen>
        <ErrorState message={error} />
      </AppScreen>
    );
  }

  if (!tool) {
    return (
      <AppScreen>
        <ErrorState message="TOOL_NOT_FOUND" />
      </AppScreen>
    );
  }

  const price =
    tool.pricingMode === "free"
      ? ar
        ? "مجاني"
        : "Free"
      : tool.pricingMode === "fixed"
        ? `${tool.fixedPoints} pts`
        : `${ar ? "من" : "From"} ${tool.minimumPoints} pts`;

  return (
    <AppScreen>
      <View style={styles.heroRow}>
        <View style={[styles.toolIcon, { backgroundColor: colors.primarySoft }]}> 
          <AppText style={[styles.toolIconText, { color: colors.primary }]}> 
            {tool.engineType.startsWith("ai_") ? "AI" : "↗"}
          </AppText>
        </View>
        <View style={styles.heroCopy}>
          <SectionTitle
            eyebrow={tool.engineType.replaceAll("_", " ").toUpperCase()}
            title={tool.title}
            description={tool.description}
          />
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.metaPill, { backgroundColor: colors.primarySoft }]}> 
          <AppText style={[styles.metaValue, { color: colors.primaryStrong }]}>{price}</AppText>
        </View>
        {tool.requiresAuth ? (
          <View style={[styles.metaPill, { backgroundColor: colors.surfaceAlt }]}> 
            <MutedText style={styles.metaValue}>{ar ? "يتطلب حسابًا" : "Account required"}</MutedText>
          </View>
        ) : null}
      </View>

      <Card style={styles.formCard}>
        <View style={styles.cardHeading}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}> 
            <AppText style={styles.stepNumberText}>1</AppText>
          </View>
          <View style={styles.stepCopy}>
            <AppText style={styles.cardTitle}>{ar ? "أدخل البيانات" : "Enter your data"}</AppText>
            <MutedText style={styles.cardDescription}>
              {ar ? "أكمل الحقول المطلوبة ثم شغّل الأداة." : "Complete the required fields, then run the tool."}
            </MutedText>
          </View>
        </View>

        <View style={styles.fields}>
          {tool.inputSchema.fields.map((field) => (
            <DynamicField
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
            />
          ))}
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.danger}12` }]}> 
            <AppText style={{ color: colors.danger }}>{error}</AppText>
          </View>
        ) : null}

        <PrimaryButton
          label={tool.inputSchema.submitLabel}
          onPress={() => void execute()}
          loading={running}
          disabled={missingRequired}
        />
      </Card>

      <Card style={styles.resultCard}>
        <View style={styles.cardHeading}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}> 
            <AppText style={styles.stepNumberText}>2</AppText>
          </View>
          <View style={styles.stepCopy}>
            <AppText style={styles.cardTitle}>{ar ? "النتيجة" : "Result"}</AppText>
            <MutedText style={styles.cardDescription}>
              {ar ? "تظهر النتيجة هنا بعد اكتمال التشغيل." : "Your result appears here after the run completes."}
            </MutedText>
          </View>
        </View>

        {!result ? (
          <View style={[styles.emptyResult, { backgroundColor: colors.surfaceAlt }]}> 
            <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}> 
              <AppText style={[styles.emptySymbol, { color: colors.primary }]}>◇</AppText>
            </View>
            <MutedText style={styles.emptyText}>
              {ar ? "شغّل الأداة وستظهر النتيجة هنا." : "Run the tool and the result will appear here."}
            </MutedText>
          </View>
        ) : (
          <View style={styles.resultContent}>
            {result.text ? (
              <View style={[styles.resultSurface, { backgroundColor: colors.surfaceAlt }]}> 
                <AppText selectable style={styles.resultText}>
                  {result.text}
                </AppText>
              </View>
            ) : null}
            {result.data ? (
              <View style={[styles.resultSurface, { backgroundColor: colors.surfaceAlt }]}> 
                <AppText selectable style={styles.json}>
                  {JSON.stringify(result.data, null, 2)}
                </AppText>
              </View>
            ) : null}
            <View style={[styles.chargeSummary, { backgroundColor: `${colors.success}12` }]}> 
              <AppText style={[styles.chargeText, { color: colors.success }]}> 
                {ar ? "تم خصم" : "Charged"} {result.creditsCharged} pts
                {typeof result.balanceAfter === "number"
                  ? ` • ${ar ? "الرصيد" : "Balance"} ${result.balanceAfter}`
                  : ""}
              </AppText>
            </View>
          </View>
        )}
      </Card>
    </AppScreen>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: ToolInputField;
  value: unknown;
  onChange(value: unknown): void;
}) {
  const { direction } = useEmpire();
  const { colors, radius } = useEmpireTheme();
  const ar = direction === "rtl";
  const inputStyle = [
    styles.input,
    field.type === "textarea" && styles.textarea,
    {
      color: colors.text,
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.border,
      borderRadius: Math.min(radius, 16),
      textAlign: ar ? ("right" as const) : ("left" as const),
    },
  ];

  return (
    <View style={styles.field}>
      <AppText style={styles.label}>
        {field.label}
        {field.required ? " *" : ""}
      </AppText>

      {field.type === "select" ? (
        <View style={styles.options}>
          {(field.options ?? []).map((option) => {
            const active = String(value ?? field.defaultValue ?? "") === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderColor: active ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <AppText style={{ color: active ? "#FFFFFF" : colors.text, fontSize: 13, fontWeight: "800" }}>
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      ) : field.type === "checkbox" ? (
        <Switch
          value={Boolean(value)}
          onValueChange={onChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <TextInput
          value={value === undefined || value === null ? "" : String(value)}
          onChangeText={(text) => onChange(field.type === "number" ? (text === "" ? "" : Number(text)) : text)}
          placeholder={field.placeholder}
          placeholderTextColor={colors.muted}
          multiline={field.type === "textarea"}
          keyboardType={
            field.type === "number"
              ? "decimal-pad"
              : field.type === "email"
                ? "email-address"
                : field.type === "url"
                  ? "url"
                  : "default"
          }
          autoCapitalize={field.type === "email" || field.type === "url" ? "none" : "sentences"}
          maxLength={field.maxLength}
          style={inputStyle}
        />
      )}

      {field.helpText ? <MutedText style={styles.help}>{field.helpText}</MutedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  toolIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  toolIconText: {
    fontSize: 18,
    fontWeight: "900",
  },
  heroCopy: {
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "900",
  },
  formCard: {
    gap: 18,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  stepCopy: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 21,
  },
  fields: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontWeight: "800",
    fontSize: 14,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textarea: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  help: {
    fontSize: 12,
    lineHeight: 20,
  },
  errorBox: {
    borderRadius: 14,
    padding: 12,
  },
  resultCard: {
    minHeight: 240,
  },
  emptyResult: {
    minHeight: 150,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 20,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySymbol: {
    fontSize: 22,
    fontWeight: "900",
  },
  emptyText: {
    textAlign: "center",
  },
  resultContent: {
    gap: 14,
  },
  resultSurface: {
    borderRadius: 17,
    padding: 15,
  },
  resultText: {
    fontSize: 17,
    lineHeight: 29,
  },
  json: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 21,
  },
  chargeSummary: {
    borderRadius: 14,
    padding: 12,
  },
  chargeText: {
    fontWeight: "900",
    fontSize: 13,
  },
});
