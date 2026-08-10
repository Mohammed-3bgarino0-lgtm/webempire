import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

export type BlogPostSummary = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  category_code: string;
  author: string;
  publish_date: string;
  cover_url: string;
  cover_alt: string;
  word_count: number;
};

export type BlogPost = BlogPostSummary & {
  primary_keyword: string;
  intent: string;
  body_html: string;
  related_slugs: string[];
};

const contentRoot = path.join(process.cwd(), "src", "content", "blog");

// Only posts that have received a manual editorial rewrite are public.
// The legacy generated library remains in the repository for archival purposes,
// but it is not listed or routable until a post is explicitly approved here.
const editorialApprovedIds = [3, 6, 9, 17, 36, 40] as const;
let editorialPromise: Promise<BlogPost[]> | null = null;

function isReleased(post: BlogPostSummary) {
  return post.publish_date <= new Date().toISOString().slice(0, 10);
}

async function readEditorialPosts(): Promise<BlogPost[]> {
  editorialPromise ??= Promise.all(
    editorialApprovedIds.map(async (id) => {
      const source = await fs.readFile(
        path.join(contentRoot, "posts", `article-${String(id).padStart(4, "0")}.json`),
        "utf8",
      );
      return JSON.parse(source) as BlogPost;
    }),
  );
  return editorialPromise;
}

function toSummary(post: BlogPost): BlogPostSummary {
  const {
    primary_keyword: _primaryKeyword,
    intent: _intent,
    body_html: _bodyHtml,
    related_slugs: _relatedSlugs,
    ...summary
  } = post;
  return summary;
}

export async function getBlogPosts(page = 1, pageSize = 12) {
  const released = (await readEditorialPosts())
    .filter(isReleased)
    .sort((a, b) => b.publish_date.localeCompare(a.publish_date) || b.id - a.id);
  const from = Math.max(0, page - 1) * pageSize;
  return {
    posts: released.slice(from, from + pageSize).map(toSummary),
    count: released.length,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = (await readEditorialPosts()).find(
    (item) => item.slug === slug && isReleased(item),
  );
  return post ?? null;
}

export async function getRelatedBlogPosts(slugs: string[]) {
  if (!slugs.length) return [];
  const wanted = new Set(slugs);
  return (await readEditorialPosts())
    .filter((post) => wanted.has(post.slug) && isReleased(post))
    .map(toSummary);
}
