import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSenseSlot } from "@/components/adsense-slot";
import { getLocaleByCode } from "@/localization/repository";
import { getBlogPosts } from "@/repositories/blog";

const pageSize = 12;

const copy = {
  ar: {
    title: "مدونة إمبراطورية الويب",
    description: "أدلة عملية محررة يدويًا عن الأدوات والحسابات والإنتاجية، مع أمثلة قابلة للتحقق وحدود واضحة لكل موضوع.",
    kicker: "المعرفة التي تتحول إلى عمل",
    intro: "أدلة عملية نراجعها قبل النشر، مع أمثلة قابلة لإعادة الحساب وروابط إلى الأدوات ذات الصلة.",
    articles: "المقالات",
    read: "اقرأ المقال",
    ad: "إعلان",
    adPlaceholder: "مساحة إعلانية",
    emptyTitle: "نعيد بناء المكتبة التحريرية",
    emptyBody: "أوقفنا نشر المقالات الآلية المتشابهة، وتظهر هنا فقط المقالات التي اجتازت المراجعة التحريرية.",
    previous: "السابق",
    next: "التالي",
  },
  en: {
    title: "Web Empire Blog",
    description: "Web Empire editorial guides. The English library is being rebuilt with manually reviewed, source-aware content.",
    kicker: "Reviewed practical guidance",
    intro: "We are rebuilding the English editorial library. We publish only reviewed guides instead of automatically generated near-duplicate articles.",
    articles: "Articles",
    read: "Read article",
    ad: "Ad",
    adPlaceholder: "Advertising space",
    emptyTitle: "The English editorial library is being rebuilt",
    emptyBody: "For now, our reviewed articles are available in Arabic. English articles will appear here only after manual editorial review.",
    previous: "Previous",
    next: "Next",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = locale === "ar" ? copy.ar : copy.en;
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/${locale}/blog` },
    robots: locale === "ar" ? { index: true, follow: true } : { index: false, follow: true },
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

  return (
    <main className="we-page we-blog-page">
      <section className="we-container we-blog-hero">
        <p className="we-simple-kicker">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>

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
          {page > 1 ? <Link href={`${prefix}/blog?page=${page - 1}`}>{t.previous}</Link> : <span />}
          <strong>{page} / {pages}</strong>
          {page < pages ? <Link href={`${prefix}/blog?page=${page + 1}`}>{t.next}</Link> : <span />}
        </nav>
      ) : null}
    </main>
  );
}
