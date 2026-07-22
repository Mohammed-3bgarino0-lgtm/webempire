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

async function readIndex(): Promise<BlogPostSummary[]> {
  const source = await fs.readFile(path.join(contentRoot, "index.json"), "utf8");
  return JSON.parse(source) as BlogPostSummary[];
}

function isReleased(post: BlogPostSummary) {
  return post.publish_date <= new Date().toISOString().slice(0, 10);
}

export async function getBlogPosts(page = 1, pageSize = 12) {
  const released = (await readIndex())
    .filter(isReleased)
    .sort((a, b) => b.publish_date.localeCompare(a.publish_date) || b.id - a.id);
  const from = Math.max(0, page - 1) * pageSize;
  return { posts: released.slice(from, from + pageSize), count: released.length };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const index = await readIndex();
  const summary = index.find((post) => post.slug === slug && isReleased(post));
  if (!summary) return null;
  const source = await fs.readFile(
    path.join(contentRoot, "posts", `article-${String(summary.id).padStart(4, "0")}.json`),
    "utf8",
  );
  return JSON.parse(source) as BlogPost;
}

export async function getRelatedBlogPosts(slugs: string[]) {
  if (!slugs.length) return [];
  const wanted = new Set(slugs);
  return (await readIndex()).filter((post) => wanted.has(post.slug) && isReleased(post));
}
