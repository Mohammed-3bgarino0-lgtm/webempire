import { getAppearanceSettings } from "@/appearance/repository";
import { corsJson, corsOptions } from "@/lib/api-cors";
import { getActiveLocales, getLocaleByCode, getSiteIdentity, getUiMessages } from "@/localization/repository";
import { resolveRequestLocale } from "@/localization/resolve";
import { getActiveCategories, getActiveTools } from "@/repositories/catalog";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestedLocale = url.searchParams.get("locale");
    const localeCode =
      requestedLocale && requestedLocale !== "auto"
        ? requestedLocale
        : await resolveRequestLocale();

    const locale = await getLocaleByCode(localeCode);
    if (!locale) {
      return corsJson({ error: "LOCALE_NOT_SUPPORTED" }, { status: 400 });
    }

    const [appearance, locales, identity, messages, categories, tools] =
      await Promise.all([
        getAppearanceSettings(),
        getActiveLocales(),
        getSiteIdentity(locale),
        getUiMessages(locale),
        getActiveCategories(locale.code),
        getActiveTools(locale.code),
      ]);

    return corsJson({
      locale,
      appearance,
      locales: locales.map((item) => ({
        code: item.code,
        localeCode: item.locale_code,
        name: item.name,
        nativeName: item.native_name,
        direction: item.direction,
      })),
      identity,
      messages,
      categories,
      tools: tools.map((tool) => ({
        id: tool.id,
        slug: tool.slug,
        title: tool.title,
        description: tool.localizedDescription,
        engineType: tool.engine_type,
        pricingMode: tool.pricing_mode,
        fixedPoints: tool.fixed_points,
        minimumPoints: tool.minimum_points,
        requiresAuth: tool.requires_auth,
        isFeatured: tool.is_featured,
        categoryId: tool.category_id,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "MOBILE_BOOTSTRAP_FAILED";
    return corsJson({ error: message }, { status: 500 });
  }
}
