import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLocaleByCode } from "@/localization/repository";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/repositories/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(decodeURIComponent(slug));
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: [post.primary_keyword, post.category, post.intent].filter(Boolean),
    alternates: { canonical: `/${locale}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publish_date,
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
  if (!locale) notFound();

  const post = await getBlogPostBySlug(decodeURIComponent(slug));
  if (!post) notFound();
  const related = await getRelatedBlogPosts(post.related_slugs);
  const prefix = `/${locale.code}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publish_date,
    author: { "@type": "Organization", name: post.author },
    image: post.cover_url,
    mainEntityOfPage: `https://webempire.site${prefix}/blog/${post.slug}`,
  };

  return (
    <main className="we-page we-blog-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <nav className="we-container we-blog-breadcrumbs" aria-label="مسار التنقل">
        <Link href={prefix}>الرئيسية</Link><span>/</span><Link href={`${prefix}/blog`}>المدونة</Link>
      </nav>
      <div className="we-container we-blog-article" dangerouslySetInnerHTML={{ __html: post.body_html }} />
      {related.length ? (
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
