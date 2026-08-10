import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSenseHydrator } from "@/components/adsense-slot";
import { injectAdsIntoArticleHtml, hasInlineRelatedSection } from "@/lib/blog-ads";
import { getLocaleByCode } from "@/localization/repository";
import { absoluteUrl, breadcrumbJsonLd, SEO_LOGO_PATH } from "@/lib/seo";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/repositories/blog";

const editorialReviewDate = "2026-08-10";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "ar") {
    return {
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    };
  }

  const post = await getBlogPostBySlug(decodeURIComponent(slug));
  if (!post) return {};

  const canonical = `/ar/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [post.primary_keyword, post.category, post.intent].filter(Boolean),
    authors: [{ name: post.author }],
    alternates: { canonical },
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
    openGraph: {
      type: "article",
      url: canonical,
      locale: "ar_SA",
      title: post.title,
      description: post.description,
      publishedTime: post.publish_date,
      modifiedTime: editorialReviewDate,
      authors: [post.author],
      section: post.category,
      tags: [post.primary_keyword, post.category, post.intent].filter(Boolean),
      images: [{ url: post.cover_url, width: 1200, height: 630, alt: post.cover_alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.cover_url],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeCode, slug } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale || locale.code !== "ar") notFound();

  const post = await getBlogPostBySlug(decodeURIComponent(slug));
  if (!post) notFound();
  const related = await getRelatedBlogPosts(post.related_slugs);
  const prefix = `/${locale.code}`;
  const canonicalPath = `${prefix}/blog/${post.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const adLabel = "إعلان";
  const placeholderText = "مساحة إعلانية";
  const articleHtml = injectAdsIntoArticleHtml(post.body_html, {
    label: adLabel,
    placeholderText,
  });
  const bodyContainsRelated = hasInlineRelatedSection(post.body_html);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    url: canonicalUrl,
    headline: post.title,
    description: post.description,
    datePublished: post.publish_date,
    dateModified: editorialReviewDate,
    inLanguage: locale.locale_code,
    articleSection: post.category,
    keywords: [post.primary_keyword, post.category, post.intent].filter(Boolean),
    wordCount: post.word_count,
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: post.author,
      url: absoluteUrl(`${prefix}/about`),
    },
    publisher: {
      "@id": `${absoluteUrl("/")}#organization`,
      "@type": "Organization",
      name: "Web Empire",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SEO_LOGO_PATH),
        contentUrl: absoluteUrl(SEO_LOGO_PATH),
        width: 768,
        height: 682,
      },
    },
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(post.cover_url),
      contentUrl: absoluteUrl(post.cover_url),
      width: 1200,
      height: 630,
      caption: post.cover_alt,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "الرئيسية", path: prefix },
    { name: "المدونة", path: `${prefix}/blog` },
    { name: post.title, path: canonicalPath },
  ]);

  return (
    <main className="we-page we-blog-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="we-container we-blog-breadcrumbs" aria-label="مسار التنقل">
        <Link href={prefix}>الرئيسية</Link><span>/</span><Link href={`${prefix}/blog`}>المدونة</Link>
      </nav>
      <div className="we-container we-blog-article" dangerouslySetInnerHTML={{ __html: articleHtml }} />
      <AdSenseHydrator />

      <aside
        className="we-container we-blog-related"
        aria-label="معلومات المراجعة التحريرية"
      >
        <h2>مراجعة وتحديث المحتوى</h2>
        <p>
          راجع فريق إمبراطورية الويب هذا الدليل يدويًا في 10 أغسطس 2026، مع فحص الأمثلة الحسابية وإزالة الادعاءات غير القابلة للتحقق. إذا وجدت خطأً أو مثالًا يحتاج إلى تصحيح، أرسل رابط الصفحة عبر صفحة التواصل.
        </p>
        <p>
          <Link href={`${prefix}/editorial-policy`}>السياسة التحريرية</Link>
          {" · "}
          <Link href={`${prefix}/about`}>من نحن</Link>
          {" · "}
          <Link href={`${prefix}/contact`}>الإبلاغ عن خطأ</Link>
        </p>
      </aside>

      {related.length && !bodyContainsRelated ? (
        <aside className="we-container we-blog-related">
          <h2>مقالات مرتبطة</h2>
          <ul>
            {related.map((item) => (
              <li key={item.id}><Link href={`${prefix}/blog/${item.slug}`}>{item.title}</Link></li>
            ))}
          </ul>
        </aside>
      ) : null}
    </main>
  );
}
