import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getActiveLocales, getLocaleByCode } from "@/localization/repository";
import { isIndexablePublicToolSlug } from "@/lib/reviewed-tools";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { getActiveCategories, getActiveTools } from "@/repositories/catalog";

export const dynamic = "force-dynamic";

const copy = {
  ar: {
    suffix: "حاسبات وأدوات",
    descriptionPrefix: "استكشف أدوات",
    descriptionSuffix:
      "في إمبراطورية الويب. روابط مباشرة إلى الحاسبات والأدوات الجاهزة للفهرسة مع شرح الاستخدام والمعادلات والأسئلة الشائعة.",
    kicker: "تصنيف الأدوات",
    intro:
      "هذه الصفحة تجمع الأدوات الجاهزة للفهرسة ضمن هذا التصنيف في مكان واحد. اختر الأداة المناسبة للوصول إلى الحاسبة وشرح المدخلات وطريقة الحساب والتحقق من النتيجة.",
    tools: "أداة",
    home: "الرئيسية",
    directory: "دليل الأدوات",
  },
  en: {
    suffix: "Calculators and Tools",
    descriptionPrefix: "Explore Web Empire",
    descriptionSuffix:
      "with direct links to indexable calculators and tools, including usage guidance, formulas, and FAQs.",
    kicker: "Tool category",
    intro:
      "This page groups indexable tools in this category in one place. Choose a tool to open its calculator, input guidance, calculation method, and result checks.",
    tools: "tools",
    home: "Home",
    directory: "Tools directory",
  },
} as const;

async function loadCategory(localeCode: string, categorySlug: string) {
  const locale = await getLocaleByCode(localeCode);
  if (!locale) return null;

  const [categories, tools] = await Promise.all([
    getActiveCategories(locale.code),
    getActiveTools(locale.code),
  ]);

  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return null;

  const indexableTools = tools
    .filter(
      (tool) =>
        tool.category_id === category.id && isIndexablePublicToolSlug(tool.slug),
    )
    .sort((a, b) => a.title.localeCompare(b.title, locale.locale_code));

  if (!indexableTools.length) return null;
  return { locale, category, tools: indexableTools };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const [data, activeLocales] = await Promise.all([
    loadCategory(locale, categorySlug),
    getActiveLocales(),
  ]);

  if (!data) return {};

  const t = data.locale.code === "ar" ? copy.ar : copy.en;
  const canonical = `/${data.locale.code}/tools/category/${categorySlug}`;
  const title = `${data.category.name} — ${t.suffix}`;
  const description = data.category.description?.trim()
    ? data.category.description
    : `${t.descriptionPrefix} ${data.category.name} ${t.descriptionSuffix}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...activeLocales.map((item) => [
          item.locale_code,
          `/${item.code}/tools/category/${categorySlug}`,
        ]),
        ["x-default", `/en/tools/category/${categorySlug}`],
      ]),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
  };
}

export default async function ToolCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale: localeCode, categorySlug } = await params;
  const data = await loadCategory(localeCode, categorySlug);
  if (!data) notFound();

  const { locale, category, tools } = data;
  const t = locale.code === "ar" ? copy.ar : copy.en;
  const prefix = `/${locale.code}`;
  const canonicalPath = `${prefix}/tools/category/${category.slug}`;

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: t.home, path: prefix },
    { name: t.directory, path: `${prefix}/directory` },
    { name: category.name, path: canonicalPath },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `${category.name} ${t.suffix}`,
    url: absoluteUrl(canonicalPath),
    inLanguage: locale.locale_code,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: absoluteUrl(`${prefix}/tools/${tool.slug}`),
      })),
    },
  };

  return (
    <main className="we-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="we-container">
        <section className="we-section">
          <div className="we-section-head">
            <span>{t.kicker}</span>
            <h1>{category.name}</h1>
          </div>
          {category.description ? <p>{category.description}</p> : null}
          <p>{t.intro}</p>
          <p>
            <strong>{tools.length}</strong> {t.tools}
          </p>
          <p>
            <Link href={`${prefix}/directory`}>← {t.directory}</Link>
          </p>
        </section>

        <section className="we-section" aria-label={category.name}>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px 24px",
              paddingInlineStart: "1.25rem",
            }}
          >
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link href={`${prefix}/tools/${tool.slug}`}>
                  <strong>{tool.title}</strong>
                </Link>
                <p>{tool.localizedDescription}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
