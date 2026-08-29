import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ToolsExplorer,
  type ToolExplorerCategory,
} from "@/components/tools/tools-explorer";
import type { ToolExplorerItem } from "@/components/tools/tool-card";
import { getActiveLocales, getLocaleByCode } from "@/localization/repository";
import { isReviewedPublicToolSlug } from "@/lib/reviewed-tools";
import { absoluteUrl, breadcrumbJsonLd, SEO_LOGO_PATH } from "@/lib/seo";
import { isEditoriallyIndexableTool } from "@/lib/tool-editorial-content";
import { getActiveCategories, getActiveTools } from "@/repositories/catalog";

const metadataCopy = {
  ar: {
    title: "مكتبة الحاسبات المراجعة",
    description: "استكشف حاسبات إمبراطورية الويب التي تمت مراجعة صفحاتها يدويًا، مع شرح للمعادلة والمدخلات وأمثلة وطريقة للتحقق من النتائج.",
    home: "الرئيسية",
    tools: "الحاسبات",
  },
  en: {
    title: "Reviewed Calculators Library",
    description: "Explore Web Empire calculators whose pages have been reviewed individually, with formulas, input guidance, worked examples, and result checks.",
    home: "Home",
    tools: "Calculators",
  },
} as const;

type ToolSearchParams = { category?: string; q?: string };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<ToolSearchParams>;
}): Promise<Metadata> {
  const [{ locale }, query, activeLocales] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({} as ToolSearchParams),
    getActiveLocales(),
  ]);
  const t = locale === "ar" ? metadataCopy.ar : metadataCopy.en;
  const hasFilter = Boolean(query.category?.trim() || query.q?.trim());
  const canonical = `/${locale}/tools`;

  return {
    title: t.title,
    description: t.description,
    robots: {
      index: !hasFilter,
      follow: true,
      googleBot: {
        index: !hasFilter,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
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
  searchParams?: Promise<ToolSearchParams>;
}) {
  const { locale: localeCode } = await params;
  const query = await searchParams;
  const locale = await getLocaleByCode(localeCode);

  if (!locale) notFound();

  const [tools, categories] = await Promise.all([
    getActiveTools(locale.code),
    getActiveCategories(locale.code),
  ]);

  // Public discovery is intentionally limited to calculators that have been
  // reviewed individually. Other active tools can remain operational without
  // being promoted to search engines until their pages receive the same review.
  const publicTools = tools.filter(
    (tool) => isEditoriallyIndexableTool(tool) && isReviewedPublicToolSlug(tool.slug),
  );
  const publicCategoryIds = new Set(publicTools.map((tool) => tool.category_id));
  const publicCategories = categories.filter((category) => publicCategoryIds.has(category.id));

  const categoryMap = new Map(
    publicCategories.map((category) => [category.id, category.name]),
  );

  const explorerCategories: ToolExplorerCategory[] = publicCategories.map(
    (category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      icon: category.icon ?? "",
    }),
  );

  const explorerTools: ToolExplorerItem[] = publicTools.map((tool, index) => ({
    slug: tool.slug,
    title: tool.title,
    description: tool.localizedDescription,
    categoryId: tool.category_id,
    categoryName:
      categoryMap.get(tool.category_id) ??
      (locale.code === "ar" ? "حاسبات عامة" : "General calculators"),
    engineType: tool.engine_type,
    pricingMode: tool.pricing_mode,
    fixedPoints: Number(tool.fixed_points ?? 0),
    minimumPoints: Number(tool.minimum_points ?? 0),
    isFeatured: Boolean(tool.is_featured),
    order: index,
  }));

  const validCategory = publicCategories.some(
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
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.title,
    description: t.description,
    url: absoluteUrl(`${prefix}/tools`),
    inLanguage: locale.locale_code,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: publicTools.map((tool, index) => ({
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
