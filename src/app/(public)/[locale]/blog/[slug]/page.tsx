import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSenseHydrator } from "@/components/adsense-slot";
import { injectAdsIntoArticleHtml, hasInlineRelatedSection } from "@/lib/blog-ads";
import { getLocaleByCode } from "@/localization/repository";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/repositories/blog";

const editorialReviewDate = "2026-08-10";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "ar") return { robots: { index: false, follow: true } };

  const post = await getBlogPostBySlug(decodeURIComponent(slug));
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: [post.primary_keyword, post.category, post.intent].filter(Boolean),
    alternates: { canonical: `/ar/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publish_date,
      modifiedTime: editorialReviewDate,
      authors: [post.author],
      images: [{ url: post.cover_url, width: 1200, height: 630, alt: post.cover_alt }],
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
    headline: post.title,
    description: post.description,
    datePublished: post.publish_date,
    dateModified: editorialReviewDate,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Web Empire" },
    image: post.cover_url,
    mainEntityOfPage: `https://webempire.site${prefix}/blog/${post.slug}`,
  };

  return (
    <main className="we-page we-blog-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
