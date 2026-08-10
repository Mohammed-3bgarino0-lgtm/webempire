import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSenseSlot } from "@/components/adsense-slot";
import { getLocaleByCode } from "@/localization/repository";
import { absoluteUrl, breadcrumbJsonLd, SEO_LOGO_PATH } from "@/lib/seo";
import { getBlogPosts } from "@/repositories/blog";

const pageSize = 12;

const copy = {
  ar: {
    title: "مدونة إمبراطورية الويب",
    description: "أدلة عملية محررة يدويًا عن الأدوات والحسابات والإنتاجية، مع أمثلة قابلة للتحقق وحدود واضحة لكل موضوع.",
    kicker: "المعرفة التي تتحول إلى عمل",
    intro: "أدلة عملية نراجعها قبل النشر، مع أمثلة قابلة لإعادة الحساب وروابط إلى الأدوات ذات الصلة.",
    reviewTitle: "مكتبة صغيرة ومراجعة بدل آلاف الصفحات المتشابهة",
    reviewBody: "ننشر هنا فقط المقالات التي أعيدت كتابتها ومراجعتها يدويًا. نتحقق من الأمثلة الحسابية، نحذف الادعاءات غير الموثقة، ونوضح حدود كل دليل قبل إضافته إلى الفهرس.",
    editorialPolicy: "كيف نراجع المحتوى",
    about: "عن إمبراطورية الويب",
    articles: "المقالات",
    read: "اقرأ المقال",
    ad: "إعلان",
    adPlaceholder: "مساحة إعلانية",
    emptyTitle: "نعيد بناء المكتبة التحريرية",
    emptyBody: "أوقفنا نشر المقالات الآلية المتشابهة، وتظهر هنا فقط المقالات التي اجتازت المراجعة التحريرية.",
    previous: "السابق",
    next: "التالي",
    home: "الرئيسية",
    blog: "المدونة",
  },
  en: {
    title: "Web Empire Blog",
    description: "Web Empire editorial guides. The English library is being rebuilt with manually reviewed, source-aware content.",
    kicker: "Reviewed practical guidance",
    intro: "We are rebuilding the English editorial library. We publish only reviewed guides instead of automatically generated near-duplicate articles.",
    reviewTitle: "A smaller reviewed library instead of thousands of similar pages",
    reviewBody: "Only manually rewritten and reviewed articles are public here. We check calculation examples, remove unsupported claims, and state the limits of each guide before it is indexed.",
    editorialPolicy: "How we review content",
    about: "About Web Empire",
    articles: "Articles",
    read: "Read article",
    ad: "Ad",
    adPlaceholder: "Advertising space",
    emptyTitle: "The English editorial library is being rebuilt",
    emptyBody: "For now, our reviewed articles are available in Arabic. English articles will appear here only after manual editorial review.",
    previous: "Previous",
    next: "Next",
    home: "Home",
    blog: "Blog",
  },
} as const;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const t = locale === "ar" ? copy.ar : copy.en;
  const page = Math.max(1, Number(query.page) || 1);
  const canonical = page > 1 ? `/${locale}/blog?page=${page}` : `/${locale}/blog`;
  const indexable = locale === "ar";

  return {
    title: page > 1 ? `${t.title} - ${page}` : t.title,
    description: t.description,
    alternates: { canonical },
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title: page > 1 ? `${t.title} - ${page}` : t.title,
      description: t.description,
      url: canonical,
      images: [{ url: SEO_LOGO_PATH, width: 768, height: 682, alt: "Web Empire" }],
    },
    twitter: {
      card: "summary",
      title: page > 1 ? `${t.title} - ${page}` : t.title,
      description: t.description,
      images: [SEO_LOGO_PATH],
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale: localeCode }, query] = await Promise.all([params, searchParams]);
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const isArabic = locale.code === "ar";
  const t = isArabic ? copy.ar : copy.en;
  const page = Math.max(1, Number(query.page) || 1);
  const blogResult = isArabic
    ? await getBlogPosts(page, pageSize)
    : { posts: [], count: 0 };
  const { posts, count } = blogResult;
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const prefix = `/${locale.code}`;
  const blogFeedSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_FEED?.trim();
  const isProduction = process.env.VERCEL_ENV === "production";
  const blogFeedAdsLive = isProduction && /^\d+$/.test(blogFeedSlot ?? "");
  const showBlogFeedPlacement = !isProduction || blogFeedAdsLive;
  const canonicalPath = page > 1 ? `${prefix}/blog?page=${page}` : `${prefix}/blog`;
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: t.home, path: prefix },
    { name: t.blog, path: `${prefix}/blog` },
  ]);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page > 1 ? `${t.title} - ${page}` : t.title,
    description: t.description,
    url: absoluteUrl(canonicalPath),
    inLanguage: locale.locale_code,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: (page - 1) * pageSize + index + 1,
        name: post.title,
        url: absoluteUrl(`${prefix}/blog/${post.slug}`),
      })),
    },
  };

  return (
    <main className="we-page we-blog-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {isArabic ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      ) : null}

      <section className="we-container we-blog-hero">
        <p className="we-simple-kicker">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>

      <aside
        className="we-container"
        style={{
          marginBottom: "clamp(22px, 4vw, 38px)",
          padding: "clamp(18px, 3vw, 26px)",
          border: "1px solid var(--we-v12-line, #e5ebf3)",
          borderRadius: 20,
          background: "var(--we-v12-surface, #fff)",
          boxShadow: "0 14px 38px rgba(15, 23, 42, 0.045)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "clamp(1.08rem, 2vw, 1.35rem)" }}>{t.reviewTitle}</h2>
        <p style={{ margin: "10px 0 14px", lineHeight: 1.85, color: "var(--we-v12-muted, #66758a)" }}>
          {t.reviewBody}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          <Link href={`${prefix}/editorial-policy`} className="empire-section-link">{t.editorialPolicy}</Link>
          <Link href={`${prefix}/about`} className="empire-section-link">{t.about}</Link>
        </div>
      </aside>

      <section className="we-container we-blog-grid" aria-label={t.articles}>
        {posts.map((post, index) => (
          <Fragment key={post.id}>
            <article className="we-blog-card">
              <Link href={`${prefix}/blog/${post.slug}`} className="we-blog-cover">
                <Image src={post.cover_url} alt={post.cover_alt} width={1200} height={630} />
              </Link>
              <div className="we-blog-card-body">
                <p className="we-blog-meta">
                  <span>{post.category}</span>
                  <time dateTime={post.publish_date}>{post.publish_date}</time>
                </p>
                <h2>
                  <Link href={`${prefix}/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.description}</p>
                <Link href={`${prefix}/blog/${post.slug}`} className="empire-section-link">
                  {t.read}
                </Link>
              </div>
            </article>
            {(index + 1) % 6 === 0 && showBlogFeedPlacement ? (
              <AdSenseSlot
                slot={blogFeedSlot}
                live={blogFeedAdsLive}
                placement={`blog-feed-${index + 1}`}
                label={t.ad}
                placeholderText={t.adPlaceholder}
              />
            ) : null}
          </Fragment>
        ))}
      </section>

      {!posts.length ? (
        <section className="we-container we-blog-empty">
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyBody}</p>
          {!isArabic ? (
            <Link href="/ar/blog" className="empire-section-link">اقرأ المقالات العربية المراجعة</Link>
          ) : null}
        </section>
      ) : null}

      {pages > 1 ? (
        <nav className="we-container we-blog-pagination" aria-label={t.articles}>
          {page > 1 ? <Link rel="prev" href={`${prefix}/blog?page=${page - 1}`}>{t.previous}</Link> : <span />}
          <strong>{page} / {pages}</strong>
          {page < pages ? <Link rel="next" href={`${prefix}/blog?page=${page + 1}`}>{t.next}</Link> : <span />}
        </nav>
      ) : null}
    </main>
  );
}
