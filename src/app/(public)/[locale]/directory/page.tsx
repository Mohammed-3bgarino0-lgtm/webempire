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
    title: "دليل أدوات إمبراطورية الويب",
    description:
      "دليل منظم للصفحات القابلة للفهرسة في إمبراطورية الويب، مجمعة حسب التصنيف مع روابط مباشرة لكل أداة.",
    kicker: "دليل الفهرسة",
    intro:
      "استخدم هذا الدليل للوصول المباشر إلى الأدوات الجاهزة للفهرسة. كل رابط أدناه يقود إلى صفحة أداة مستقلة مع الحاسبة وشرح الاستخدام والمعادلة والأسئلة الشائعة.",
    tools: "أداة قابلة للفهرسة",
    categories: "تصنيف",
    categoryPage: "عرض صفحة التصنيف",
    home: "الرئيسية",
    directory: "دليل الأدوات",
  },
  en: {
    title: "Web Empire Tools Directory",
    description:
      "A structured directory of indexable Web Empire pages, grouped by category with direct links to every included tool.",
    kicker: "Indexable directory",
    intro:
      "Use this directory to reach tools that are ready for public indexing. Every link below opens a standalone tool page with the calculator, usage guidance, formula explanation, and FAQs.",
    tools: "indexable tools",
    categories: "categories",
    categoryPage: "View category page",
    home: "Home",
    directory: "Tools directory",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocales = await getActiveLocales();
  const t = locale === "ar" ? copy.ar : copy.en;
  const canonical = `/${locale}/directory`;

  return {
    title: t.title,
    description: t.description,
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
        ...activeLocales.map((item) => [item.locale_code, `/${item.code}/directory`]),
        ["x-default", "/en/directory"],
      ]),
    },
    openGraph: {
      type: "website",
      title: t.title,
      description: t.description,
      url: canonical,
    },
  };
}

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const [tools, categories] = await Promise.all([
    getActiveTools(locale.code),
    getActiveCategories(locale.code),
  ]);

  const indexableTools = tools.filter((tool) => isIndexablePublicToolSlug(tool.slug));
  const groups = categories
    .map((category) => ({
      category,
      tools: indexableTools
        .filter((tool) => tool.category_id === category.id)
        .sort((a, b) => a.title.localeCompare(b.title, locale.locale_code)),
    }))
    .filter((group) => group.tools.length > 0);

  const t = locale.code === "ar" ? copy.ar : copy.en;
  const prefix = `/${locale.code}`;
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: t.home, path: prefix },
    { name: t.directory, path: `${prefix}/directory` },
  ]);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.title,
    description: t.description,
    url: absoluteUrl(`${prefix}/directory`),
    inLanguage: locale.locale_code,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: indexableTools.length,
      itemListElement: indexableTools.map((tool, index) => ({
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
            <h1>{t.title}</h1>
          </div>
          <p>{t.intro}</p>
          <p>
            <strong>{indexableTools.length}</strong> {t.tools} · <strong>{groups.length}</strong> {t.categories}
          </p>
        </section>

        {groups.map(({ category, tools: categoryTools }) => (
          <section className="we-section" key={category.id} aria-labelledby={`directory-${category.slug}`}>
            <div className="we-section-head">
              <span>{categoryTools.length}</span>
              <h2 id={`directory-${category.slug}`}>
                <Link href={`${prefix}/tools/category/${category.slug}`}>{category.name}</Link>
              </h2>
            </div>
            {category.description ? <p>{category.description}</p> : null}
            <p>
              <Link href={`${prefix}/tools/category/${category.slug}`}>{t.categoryPage} ←</Link>
            </p>
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px 24px",
                paddingInlineStart: "1.25rem",
              }}
            >
              {categoryTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`${prefix}/tools/${tool.slug}`}>{tool.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
