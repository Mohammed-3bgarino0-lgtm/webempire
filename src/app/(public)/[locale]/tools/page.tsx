import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ToolsExplorer,
  type ToolExplorerCategory,
} from "@/components/tools/tools-explorer";
import type { ToolExplorerItem } from "@/components/tools/tool-card";
import { getActiveLocales, getLocaleByCode } from "@/localization/repository";
import { isEditoriallyIndexableTool } from "@/lib/tool-editorial-content";
import { absoluteUrl, breadcrumbJsonLd, SEO_LOGO_PATH } from "@/lib/seo";
import { getActiveCategories, getActiveTools } from "@/repositories/catalog";

const metadataCopy = {
  ar: {
    title: "مكتبة الأدوات والحاسبات",
    description: "استكشف أدوات إمبراطورية الويب للحساب والتحويل والإنتاجية، مع شروحات للمدخلات وطريقة التحقق من النتائج في الأدوات الأساسية.",
    home: "الرئيسية",
    tools: "الأدوات",
  },
  en: {
    title: "Tools & Calculators Library",
    description: "Explore Web Empire calculators, converters, and productivity tools with input guidance and result-checking notes on core tools.",
    home: "Home",
    tools: "Tools",
  },
} as const;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; q?: string }>;
}): Promise<Metadata> {
  const [{ locale }, query, activeLocales] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
    getActiveLocales(),
  ]);
  const t = locale === "ar" ? metadataCopy.ar : metadataCopy.en;
  const hasFilter = Boolean(query.category?.trim() || query.q?.trim());
  const canonical = `/${locale}/tools`;

  return {
    title: t.title,
    description: t.description,
    robots: hasFilter ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...activeLocales.map((item) => [item.locale_code, `/${item.code}/tools`]),
        ["x-default", "/en/tools"],
      ]),
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: canonical,
      images: [{ url: SEO_LOGO_PATH, width: 768, height: 682, alt: "Web Empire" }],
    },
    twitter: {
      card: "summary",
      title: t.title,
      description: t.description,
      images: [SEO_LOGO_PATH],
    },
  };
}

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; q?: string }>;
}) {
  const { locale: localeCode } = await params;
  const query = await searchParams;
  const locale = await getLocaleByCode(localeCode);

  if (!locale) notFound();

  const [tools, categories] = await Promise.all([
    getActiveTools(locale.code),
    getActiveCategories(locale.code),
  ]);

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const explorerCategories: ToolExplorerCategory[] = categories.map(
    (category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      icon: category.icon ?? "",
    }),
  );

  const explorerTools: ToolExplorerItem[] = tools.map((tool, index) => ({
    slug: tool.slug,
    title: tool.title,
    description: tool.localizedDescription,
    categoryId: tool.category_id,
    categoryName:
      categoryMap.get(tool.category_id) ??
      (locale.code === "ar" ? "أدوات عامة" : "General"),
    engineType: tool.engine_type,
    pricingMode: tool.pricing_mode,
    fixedPoints: Number(tool.fixed_points ?? 0),
    minimumPoints: Number(tool.minimum_points ?? 0),
    isFeatured: Boolean(tool.is_featured),
    order: index,
  }));

  const validCategory = categories.some(
    (category) => category.slug === query?.category,
  )
    ? query?.category
    : "";

  const t = locale.code === "ar" ? metadataCopy.ar : metadataCopy.en;
  const prefix = `/${locale.code}`;
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: t.home, path: prefix },
    { name: t.tools, path: `${prefix}/tools` },
  ]);
  const indexableTools = tools.filter(isEditoriallyIndexableTool).slice(0, 30);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.title,
    description: t.description,
    url: absoluteUrl(`${prefix}/tools`),
    inLanguage: locale.locale_code,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: indexableTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: absoluteUrl(`${prefix}/tools/${tool.slug}`),
      })),
    },
  };

  return (
    <main className="we-page we-tools-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <div className="we-container">
        <ToolsExplorer
          categories={explorerCategories}
          initialCategory={validCategory}
          initialQuery={query?.q ?? ""}
          locale={locale.code}
          prefix={prefix}
          tools={explorerTools}
        />
      </div>
    </main>
  );
}
