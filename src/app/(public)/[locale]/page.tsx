import Link from "next/link";
import { notFound } from "next/navigation";

import { webEmpireLightAssets as assets } from "@/brand/web-empire-light-assets";
import { translate } from "@/localization/messages";
import { getActiveLocales, getLocaleByCode, getSiteIdentity, getUiMessages } from "@/localization/repository";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getActiveCategories, getActivePlans, getActiveTools } from "@/repositories/catalog";

const copy = {
  ar: {
    h1a: "حاسبات وأدوات رقمية.",
    h1b: "في منصة واحدة.",
    body: "استخدم حاسبات وأدوات تحويل وإنتاجية متعددة اللغات مع شروحات للمدخلات وطريقة مراجعة النتائج في الأدوات الأساسية.",
    start: "ابدأ الآن مجانًا",
    explore: "استكشف الأدوات",
    search: "ابحث عن أداة أو حل...",
    stats: ["أمثلة وشروحات قابلة للتحقق", "لغات نشطة", "تكلفة الخطة المجانية", "أداة مميزة", "أداة ونموذج جاهز", "مراجعة تحريرية مستمرة"],
    featured: "أدوات مميزة",
    categories: "تصفح حسب التصنيف",
    dashboard: "لمحة من لوحة التحكم",
    pricing: "باقات مناسبة للجميع",
    cta: "جاهز لتجربة أدوات إمبراطورية الويب؟",
  },
  en: {
    h1a: "Calculators and digital tools.",
    h1b: "In one platform.",
    body: "Use multilingual calculators, converters, and productivity tools with input guidance and result-checking notes on core tools.",
    start: "Start free",
    explore: "Explore tools",
    search: "Search for a tool or solution...",
    stats: ["Checkable examples and guidance", "active languages", "Free plan cost", "featured tools", "ready tools and templates", "Ongoing editorial review"],
    featured: "Featured tools",
    categories: "Browse by category",
    dashboard: "Dashboard preview",
    pricing: "Plans for everyone",
    cta: "Ready to try Web Empire tools?",
  },
};

const glyphs = ["%", "↗", "VAT", "◔", "▣", "☷"];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const [identity, messages, locales, tools, categories, plans] = await Promise.all([
    getSiteIdentity(locale),
    getUiMessages(locale),
    getActiveLocales(),
    getActiveTools(locale.code),
    getActiveCategories(locale.code),
    getActivePlans(locale.code),
  ]);

  void identity;

  const t = locale.code === "ar" ? copy.ar : copy.en;
  const prefix = `/${locale.code}`;
  const featured = (tools.filter((tool) => tool.is_featured).length ? tools.filter((tool) => tool.is_featured) : tools).slice(0, 6);
  const visibleCategories = categories.slice(0, 8);
  const visiblePlans = plans.slice(0, 3);
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
              <Link href={`${prefix}/auth/register`} className="we-button-primary">✧ {t.start}</Link>
              <Link href={`${prefix}/tools`} className="we-button-ghost">← {t.explore}</Link>
            </div>
          </div>
        </div>

        <div className="we-search">
          <span>⌕</span>
          <strong>{t.search}</strong>
          <span>☷</span>
        </div>

        <div className="we-container we-stats">
          <div><strong>✓</strong><small>{t.stats[0]}</small></div>
          <div><strong>{locales.length}</strong><small>{t.stats[1]}</small></div>
          <div><strong>0</strong><small>{t.stats[2]}</small></div>
          <div><strong>+{featured.length}</strong><small>{t.stats[3]}</small></div>
          <div><strong>{tools.length}+</strong><small>{t.stats[4]}</small></div>
          <div><strong>↻</strong><small>{t.stats[5]}</small></div>
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

      <section className="we-container we-section we-bottom-grid">
        <div className="we-dashboard-card">
          <h2>{t.dashboard}</h2>
          <img src={assets.dashboardPreview} alt="" />
        </div>
        <div className="we-pricing-panel">
          <h2>{t.pricing}</h2>
          <div className="we-pricing-mini">
            {visiblePlans.map((plan) => (
              <Link href={`${prefix}/pricing`} key={plan.slug}>
                <span>{plan.name}</span>
                <strong>{Number(plan.price_sar)} SAR</strong>
                <small>{Number(plan.monthly_credits).toLocaleString(locale.locale_code)} {translate(messages, "common.points")}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="we-container we-cta-strip">
        <Link href={`${prefix}/auth/register`} className="we-button-primary">✧ {t.start}</Link>
        <Link href={`${prefix}/tools`} className="we-button-ghost">← {t.explore}</Link>
        <h2>{t.cta}</h2>
      </section>
    </main>
  );
}
