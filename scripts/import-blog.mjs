import fs from "node:fs/promises";
import path from "node:path";

const [packageRoot] = process.argv.slice(2);
if (!packageRoot) throw new Error("Usage: node scripts/import-blog.mjs <blog-package-root>");

const articlesDir = path.resolve(packageRoot, "articles");
const contentRoot = path.resolve("src/content/blog");
const postsRoot = path.join(contentRoot, "posts");
const imagesRoot = path.resolve("public/blog-images");
await fs.mkdir(postsRoot, { recursive: true });
await fs.mkdir(imagesRoot, { recursive: true });

const folders = (await fs.readdir(articlesDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^article-\d{4}$/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const indexPath = path.join(contentRoot, "index.json");
const existingIndex = JSON.parse(await fs.readFile(indexPath, "utf8").catch(() => "[]"));
const indexById = new Map(existingIndex.map((post) => [post.id, post]));
for (const [position, folder] of folders.entries()) {
  const articleDir = path.join(articlesDir, folder);
  const metadata = JSON.parse(await fs.readFile(path.join(articleDir, "metadata.json"), "utf8"));
  const imageDir = path.join(imagesRoot, folder);
  await fs.mkdir(imageDir, { recursive: true });
  await fs.copyFile(path.join(articleDir, metadata.cover), path.join(imageDir, metadata.cover));
  const coverUrl = `/blog-images/${folder}/${metadata.cover}`;

  const document = await fs.readFile(path.join(articleDir, "article.html"), "utf8");
  const articleMatch = document.match(/<article\b[\s\S]*?<\/article>/i);
  if (!articleMatch) throw new Error(`Article markup missing: ${folder}`);
  const escapedCover = metadata.cover.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const bodyHtml = articleMatch[0].replace(
    new RegExp(`src=["']${escapedCover}["']`, "g"),
    `src="${coverUrl}"`,
  );

  const summary = {
    id: metadata.id,
    slug: metadata.slug,
    title: metadata.title,
    description: metadata.description,
    category: metadata.category,
    category_code: metadata.category_code,
    author: metadata.author,
    publish_date: metadata.publish_date,
    cover_url: coverUrl,
    cover_alt: metadata.cover_alt,
    word_count: metadata.word_count,
  };
  indexById.set(summary.id, summary);

  const post = {
    ...summary,
    primary_keyword: metadata.primary_keyword,
    intent: metadata.intent,
    related_slugs: metadata.related_slugs,
    body_html: bodyHtml,
  };
  await fs.writeFile(path.join(postsRoot, `${folder}.json`), JSON.stringify(post), "utf8");
  if ((position + 1) % 100 === 0) console.log(`Prepared ${position + 1}/${folders.length}`);
}

const index = [...indexById.values()].sort((a, b) => a.id - b.id);
await fs.writeFile(indexPath, JSON.stringify(index), "utf8");
console.log(`Blog package prepared: ${index.length} total articles.`);
