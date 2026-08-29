import Link from "next/link";
import { notFound } from "next/navigation";

import { webEmpireLightAssets as assets } from "@/brand/web-empire-light-assets";
import { translate } from "@/localization/messages";
import { getActiveLocales, getLocaleByCode, getUiMessages } from "@/localization/repository";
import { isReviewedPublicToolSlug } from "@/lib/reviewed-tools";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { isEditoriallyIndexableTool } from "@/lib/tool-editorial-content";
import { getActiveCategories, getActiveTools } from "@/repositories/catalog";

import styles from "./home-quality.module.css";

const copy = {
  ar: {
    h1a: "حاسبات وأدوات رقمية.",
    h1b: "في منصة واحدة.",
    body: "استخدم حاسبات مراجعة يدويًا للحساب والتحويل. كل صفحة عامة تشرح ما تحسبه الأداة، والمعادلة المستخدمة، ومثالًا محلولًا، وطريقة للتحقق من النتيجة.",
    start: "استكشف الحاسبات",
    explore: "كل الحاسبات",
    search: "ابحث عن حاسبة...",
    searchButton: "بحث",
    stats: ["حاسبة مراجعة يدويًا", "لغات نشطة", "حاسبات مميزة", "تصنيفات ظاهرة"],
    featured: "حاسبات مميزة",
    categories: "تصفح حسب التصنيف",
    groupsTitle: "حاسبات مباشرة حسب التصنيف",
    groupsBody: "روابط مباشرة إلى الحاسبات التي تمت مراجعة صفحاتها ومحتواها يدويًا قبل إدراجها في المكتبة العامة.",
    viewCategory: "عرض التصنيف",
    libraryTitle: "عن مكتبة إمبراطورية الويب",
    libraryBody1: "نركز في المكتبة العامة على عدد محدود من الحاسبات التي راجعنا منطقها وشرحها بدل نشر مئات الصفحات المتشابهة. كل حاسبة عامة تتضمن وصفًا واضحًا، وطريقة الحساب، ومثالًا، ونقاط تحقق وأسئلة شائعة مرتبطة بموضوعها.",
    libraryBody2: "الأدوات الأخرى قد تبقى متاحة داخل المشروع، لكنها لا تدخل الفهرسة العامة حتى تُراجع صفحة كل أداة بصورة مستقلة. بهذه الطريقة تكون الأرقام والروابط الظاهرة هنا انعكاسًا للمحتوى الذي راجعناه فعلًا.",
    cta: "ابدأ بحاسبة تمت مراجعتها",
  },
  en: {
    h1a: "Calculators and digital tools.",
    h1b: "In one platform.",
    body: "Use manually reviewed calculators and converters. Every public calculator page explains what it calculates, the formula used, a worked example, and ways to verify the result.",
    start: "Explore calculators",
    explore: "All calculators",
    search: "Search for a calculator...",
    searchButton: "Search",
    stats: ["manually reviewed calculators", "active languages", "featured calculators", "visible categories"],
    featured: "Featured calculators",
    categories: "Browse by category",
    groupsTitle: "Direct calculators by category",
    groupsBody: "Open calculators whose pages and explanatory content have been reviewed individually before inclusion in the public library.",
    viewCategory: "View category",
    libraryTitle: "About the Web Empire library",
    libraryBody1: "The public library deliberately focuses on a smaller set of calculators whose logic and explanatory pages have been reviewed instead of publishing hundreds of near-identical pages. Each public calculator includes a clear description, calculation method, worked example, checks, and topic-specific questions.",
    libraryBody2: "Other tools may remain available inside the project, but they are kept out of the public index until each page receives its own review. The counts and links shown here therefore reflect content we have actually reviewed.",
    cta: "Start with a reviewed calculator",
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
  const publicTools = tools.filter(
    (tool) => isEditoriallyIndexableTool(tool) && isReviewedPublicToolSlug(tool.slug),
  );
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
            <img src={assets.mark} alt="" className="we-hero-brand-mark" width="768" height="682" />
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
              <span className="we-card-link">{locale.code === "ar" ? "استخدم الحاسبة" : "Use calculator"} ←</span>
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
              <h3><Link href={`${prefix}/tools?category=${category.slug}`}>{category.name}</Link></h3>
              <ul>
                {categoryTools.map((tool) => (
                  <li key={tool.slug}><Link href={`${prefix}/tools/${tool.slug}`}>{tool.title}</Link></li>
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
