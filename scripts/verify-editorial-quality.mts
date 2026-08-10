import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const repositoryPath = path.join(root, "src", "repositories", "blog.ts");
const postsRoot = path.join(root, "src", "content", "blog", "posts");

const forbiddenFragments = [
  "وفق معيار داخلي",
  "تحسنت قابلية استخدام النتيجة بنحو",
  "اجعل معيار المراجعة مرتبطًا",
  "لدى فريق صغير",
  "يركز هذا الإصدار على",
  "للوصول إلى هدف عملي هو",
];

function stripHtml(source: string) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countOccurrences(source: string, token: string) {
  return source.split(token).length - 1;
}

const repositorySource = await fs.readFile(repositoryPath, "utf8");
const approvedMatch = repositorySource.match(
  /const editorialApprovedIds = \[([^\]]+)\] as const;/,
);

if (!approvedMatch) {
  throw new Error("Could not locate editorialApprovedIds in src/repositories/blog.ts");
}

const approvedIds = approvedMatch[1]
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(Number.isFinite);

if (!approvedIds.length) throw new Error("No editorially approved blog posts found.");

const failures: string[] = [];
const approvedSlugs = new Set<string>();
const records: Array<{ id: number; slug: string; body_html: string; title: string }> = [];

for (const id of approvedIds) {
  const filename = `article-${String(id).padStart(4, "0")}.json`;
  const source = await fs.readFile(path.join(postsRoot, filename), "utf8");
  const post = JSON.parse(source) as {
    id: number;
    slug: string;
    title: string;
    description: string;
    body_html: string;
    word_count: number;
    related_slugs?: string[];
  };

  records.push(post);
  approvedSlugs.add(post.slug);

  if (post.id !== id) failures.push(`${filename}: id does not match allowlist id ${id}.`);
  if (post.title.trim().length < 18) failures.push(`${filename}: title is too short.`);
  if (post.description.trim().length < 90) failures.push(`${filename}: description is too thin.`);

  const plain = stripHtml(post.body_html);
  if (plain.length < 3200) failures.push(`${filename}: article body is too short (${plain.length} chars).`);
  if (countOccurrences(post.body_html, "<section") < 6) failures.push(`${filename}: needs at least 6 substantive sections.`);
  if (countOccurrences(post.body_html, "<h2>") < 6) failures.push(`${filename}: needs at least 6 H2 headings.`);
  if (countOccurrences(post.body_html, "<details>") < 2) failures.push(`${filename}: needs at least 2 useful FAQ items.`);
  if (!plain.includes("مثال")) failures.push(`${filename}: needs a checkable example.`);
  if (!post.body_html.includes("<aside")) failures.push(`${filename}: needs an explicit limitation/disclaimer.`);

  for (const fragment of forbiddenFragments) {
    if (plain.includes(fragment)) failures.push(`${filename}: contains legacy generated phrase: ${fragment}`);
  }
}

for (const post of records) {
  const source = await fs.readFile(
    path.join(postsRoot, `article-${String(post.id).padStart(4, "0")}.json`),
    "utf8",
  );
  const parsed = JSON.parse(source) as { related_slugs?: string[] };
  for (const slug of parsed.related_slugs ?? []) {
    if (!approvedSlugs.has(slug)) {
      failures.push(`article-${String(post.id).padStart(4, "0")}.json: related slug is not editorially approved: ${slug}`);
    }
  }
}

if (failures.length) {
  console.error("Editorial quality verification failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Editorial quality verification passed for ${approvedIds.length} approved posts.`);
