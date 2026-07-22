import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLocaleByCode } from "@/localization/repository";
import { getBlogPosts } from "@/repositories/blog";

export const metadata: Metadata = {
  title: "مدونة إمبراطورية الويب",
  description: "أدلة عملية ومقالات عربية عن الأدوات والمال والأعمال والتقنية والإنتاجية.",
};

const pageSize = 12;

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

  const page = Math.max(1, Number(query.page) || 1);
  const { posts, count } = await getBlogPosts(page, pageSize);
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const prefix = `/${locale.code}`;

  return (
    <main className="we-page we-blog-page">
      <section className="we-container we-blog-hero">
        <p className="we-simple-kicker">المعرفة التي تتحول إلى عمل</p>
        <h1>مدونة إمبراطورية الويب</h1>
        <p>أدلة عملية مرتبة تساعدك على اختيار الأدوات، تحسين النتائج، واتخاذ قرارات أوضح.</p>
      </section>

      <section className="we-container we-blog-grid" aria-label="المقالات">
        {posts.map((post) => (
          <article className="we-blog-card" key={post.id}>
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
                اقرأ المقال
              </Link>
            </div>
          </article>
        ))}
      </section>

      {!posts.length ? (
        <section className="we-container we-blog-empty">
          <h2>المقالات المجدولة ستظهر قريبًا</h2>
          <p>تم تجهيز مكتبة المقالات، وستُنشر بالترتيب وفق الجدول التحريري.</p>
        </section>
      ) : null}

      {pages > 1 ? (
        <nav className="we-container we-blog-pagination" aria-label="صفحات المدونة">
          {page > 1 ? <Link href={`${prefix}/blog?page=${page - 1}`}>السابق</Link> : <span />}
          <strong>{page} / {pages}</strong>
          {page < pages ? <Link href={`${prefix}/blog?page=${page + 1}`}>التالي</Link> : <span />}
        </nav>
      ) : null}
    </main>
  );
}
