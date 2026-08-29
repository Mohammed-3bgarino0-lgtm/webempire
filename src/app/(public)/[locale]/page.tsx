import Link from "next/link";
import { notFound } from "next/navigation";

import { webEmpireLightAssets as assets } from "@/brand/web-empire-light-assets";
import { translate } from "@/localization/messages";
import { getActiveLocales, getLocaleByCode, getUiMessages } from "@/localization/repository";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { isEditoriallyIndexableTool } from "@/lib/tool-editorial-content";
import { getActiveCategories, getActiveTools } from "@/repositories/catalog";

import styles from "./home-quality.module.css";

const copy = {
  ar: {
    h1a: "حاسبات وأدوات رقمية.",
    h1b: "في منصة واحدة.",
    body: "استخدم حاسبات وأدوات تحويل ونصوص وإنتاجية متعددة اللغات. تعرض كل أداة منشورة وصفًا لعملها ومدخلاتها المتاحة.",
    start: "استكشف الأدوات مجانًا",
    explore: "كل الأدوات",
    search: "ابحث عن حاسبة أو أداة...",
    searchButton: "بحث",
    stats: ["أداة عامة متاحة", "لغات نشطة", "أدوات مميزة معروضة", "تصنيفات ظاهرة"],
    featured: "أدوات مميزة",
    categories: "تصفح حسب التصنيف",
    groupsTitle: "أدوات مباشرة حسب التصنيف",
    groupsBody: "روابط مباشرة إلى مجموعة من الحاسبات والأدوات المنشورة حاليًا، مرتبة حسب التصنيف لتصل إلى المهمة المطلوبة بسرعة.",
    viewCategory: "عرض التصنيف",
    libraryTitle: "عن مكتبة إمبراطورية الويب",
    libraryBody1: "تركز المكتبة العامة على الحاسبات والتحويلات والأدوات العملية التي يمكن فتحها من المتصفح مباشرة. صفحات الأدوات المؤهلة للفهرسة تعرض وصف الأداة ومدخلاتها وطريقة الحساب أو المعالجة ومثالًا أو إرشادات تساعد على مراجعة النتيجة.",
    libraryBody2: "نفضّل نشر صفحات واضحة وقابلة للتحقق بدل عرض أرقام تسويقية أو وعود غير موثقة. الأدوات والمحتوى يتغيران مع المراجعة، لذلك تعرض الصفحة الأعداد الحالية من بيانات الموقع نفسها.",
    cta: "استكشف الأدوات المتاحة حاليًا",
  },
  en: {
    h1a: "Calculators and digital tools.",
    h1b: "In one platform.",
    body: "Use multilingual calculators, converters, text utilities, and productivity tools. Each published tool includes a description of its purpose and available inputs.",
    start: "Explore free tools",
    explore: "All tools",
    search: "Search for a calculator or tool...",
    searchButton: "Search",
    stats: ["public tools available", "active languages", "featured tools shown", "visible categories"],
    featured: "Featured tools",
    categories: "Browse by category",
    groupsTitle: "Direct tools by category",
    groupsBody: "Open currently published calculators and tools directly from clear categories so you can get to the task you need quickly.",
    viewCategory: "View category",
    libraryTitle: "About the Web Empire library",
    libraryBody1: "The public library focuses on practical calculators, converters, and browser-based utilities. Tool pages eligible for indexing explain the purpose, inputs, calculation or processing method, and include examples or result-checking guidance.",
    libraryBody2: "We prefer clear, verifiable pages over unsupported marketing numbers or claims. Tool and content coverage changes as reviews continue, so the homepage uses current site data for its counts.",
    cta: "Explore the tools currently available",
  },
} as const;

const glyphs = ["%", "↗", "VAT", "◔", "▣", "☷"];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const [messages, locales, tools, categories] = await Promise.all([
    getUiMessages(locale),
    getActiveLocales(),
    getActiveTools(locale.code),
    getActiveCategories(locale.code),
  ]);

  const t = locale.code === "ar" ? copy.ar : copy.en;
  const prefix = `/${locale.code}`;
  const publicTools = tools.filter(isEditoriallyIndexableTool);
  const featuredCandidates = publicTools.filter((tool) => tool.is_featured);
  const featured = (featuredCandidates.length ? featuredCandidates : publicTools).slice(0, 6);
  const publicCategoryIds = new Set(publicTools.map((tool) => tool.category_id));
  const visibleCategories = categories
    .filter((category) => publicCategoryIds.has(category.id))
    .slice(0, 8);
  const categoryGroups = visibleCategories
    .map((category) => ({
      category,
      tools: publicTools.filter((tool) => tool.category_id === category.id).slice(0, 5),
    }))
    .filter((group) => group.tools.length > 0);
  const websiteSchema = websiteJsonLd(locale.locale_code);
  const organizationSchema = organizationJsonLd();

  return (
    <main className="we-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <section className="we-hero">
        <div className="we-container we-hero-grid">
          <div className="we-hero-visual we-brand-hero-visual" aria-hidden="true">
            <span className="we-brand-orbit we-brand-orbit-a" />
            <span className="we-brand-orbit we-brand-orbit-b" />
            <span className="we-brand-orbit we-brand-orbit-c" />
            <img
              src={assets.mark}
              alt=""
              className="we-hero-brand-mark"
              width="768"
              height="682"
            />
          </div>
          <div className="we-hero-copy">
            <h1>{t.h1a}<br /><span className="we-gradient-text">{t.h1b}</span></h1>
            <p>{t.body}</p>
            <div className="we-hero-actions">
              <Link href={`${prefix}/tools`} className="we-button-primary">✧ {t.start}</Link>
              <Link href={`${prefix}/tools`} className="we-button-ghost">← {t.explore}</Link>
            </div>
          </div>
        </div>

        <form className={styles.search} action={`${prefix}/tools`} method="get" role="search">
          <span aria-hidden="true">⌕</span>
          <input name="q" type="search" placeholder={t.search} aria-label={t.search} />
          <button type="submit">{t.searchButton}</button>
        </form>

        <div className={`${styles.stats} we-container we-stats`}>
          <div><strong>{publicTools.length}</strong><small>{t.stats[0]}</small></div>
          <div><strong>{locales.length}</strong><small>{t.stats[1]}</small></div>
          <div><strong>{featured.length}</strong><small>{t.stats[2]}</small></div>
          <div><strong>{visibleCategories.length}</strong><small>{t.stats[3]}</small></div>
        </div>
      </section>

      <section className="we-container we-section">
        <div className="we-section-head">
          <Link href={`${prefix}/tools`}>← {translate(messages, "nav.tools")}</Link>
          <h2>{t.featured}</h2>
        </div>
        <div className="we-tool-grid">
          {featured.map((tool, index) => (
            <Link href={`${prefix}/tools/${tool.slug}`} className="we-tool-card" key={tool.slug}>
              <div className="we-icon">{glyphs[index % glyphs.length]}</div>
              <h3>{tool.title}</h3>
              <p>{tool.localizedDescription}</p>
              <span className="we-card-link">{locale.code === "ar" ? "استخدم الأداة" : "Use tool"} ←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="we-container we-section" id="categories">
        <div className="we-section-head"><span /><h2>{t.categories}</h2></div>
        <div className="we-category-row">
          {visibleCategories.map((category) => (
            <Link href={`${prefix}/tools?category=${category.slug}`} className="we-category-card" key={category.slug}>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="we-container we-section" aria-labelledby="direct-tools-heading">
        <div className="we-section-head"><span /><h2 id="direct-tools-heading">{t.groupsTitle}</h2></div>
        <p className={styles.sectionIntro}>{t.groupsBody}</p>
        <div className={styles.categoryGrid}>
          {categoryGroups.map(({ category, tools: categoryTools }) => (
            <article className={styles.categoryGroup} key={category.id}>
              <h3>
                <Link href={`${prefix}/tools?category=${category.slug}`}>{category.name}</Link>
              </h3>
              <ul>
                {categoryTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`${prefix}/tools/${tool.slug}`}>{tool.title}</Link>
                  </li>
                ))}
              </ul>
              <Link className={styles.moreLink} href={`${prefix}/tools?category=${category.slug}`}>
                {t.viewCategory} ←
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={`we-container ${styles.libraryIntro}`} aria-labelledby="library-about-heading">
        <h2 id="library-about-heading">{t.libraryTitle}</h2>
        <p>{t.libraryBody1}</p>
        <p>{t.libraryBody2}</p>
      </section>

      <section className="we-container we-cta-strip">
        <Link href={`${prefix}/tools`} className="we-button-primary">✧ {t.start}</Link>
        <Link href={`${prefix}/tools`} className="we-button-ghost">← {t.explore}</Link>
        <h2>{t.cta}</h2>
      </section>
    </main>
  );
}
