import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDirectory = path.join(root, "src", "content", "blog", "posts");
const indexPath = path.join(root, "src", "content", "blog", "index.json");

const summaryKeys = [
  "id",
  "slug",
  "title",
  "description",
  "category",
  "category_code",
  "author",
  "publish_date",
  "cover_url",
  "cover_alt",
  "word_count",
];

const fileNames = (await fs.readdir(postsDirectory))
  .filter((name) => /^article-\d+\.json$/u.test(name))
  .sort();

if (!fileNames.length) {
  throw new Error("No blog article JSON files were found.");
}

const summaries = [];
const ids = new Set();
const slugs = new Set();
const missingCovers = [];

for (const fileName of fileNames) {
  const filePath = path.join(postsDirectory, fileName);
  const article = JSON.parse(await fs.readFile(filePath, "utf8"));

  for (const key of summaryKeys) {
    if (article[key] === undefined || article[key] === null || article[key] === "") {
      throw new Error(`${fileName}: missing required field ${key}`);
    }
  }

  if (ids.has(article.id)) {
    throw new Error(`Duplicate article id: ${article.id}`);
  }
  if (slugs.has(article.slug)) {
    throw new Error(`Duplicate article slug: ${article.slug}`);
  }

  ids.add(article.id);
  slugs.add(article.slug);

  const summary = Object.fromEntries(
    summaryKeys.map((key) => [key, article[key]]),
  );
  summaries.push(summary);

  const coverPath = path.join(root, "public", article.cover_url.replace(/^\/+/u, ""));
  try {
    await fs.access(coverPath);
  } catch {
    missingCovers.push(article.cover_url);
  }
}

summaries.sort((left, right) => left.id - right.id);

if (missingCovers.length) {
  throw new Error(
    `Missing ${missingCovers.length} cover images. First missing cover: ${missingCovers[0]}`,
  );
}

await fs.writeFile(indexPath, JSON.stringify(summaries), "utf8");

const today = new Date().toISOString().slice(0, 10);
const released = summaries.filter((post) => post.publish_date <= today).length;

console.log(`Blog index rebuilt: ${summaries.length} articles.`);
console.log(`Released through ${today}: ${released} articles.`);
