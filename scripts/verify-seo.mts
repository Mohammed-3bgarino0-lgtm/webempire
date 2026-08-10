import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors: string[] = [];

function read(relativePath: string) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required SEO file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function requireText(relativePath: string, needles: string[]) {
  const source = read(relativePath);
  for (const needle of needles) {
    if (!source.includes(needle)) {
      errors.push(`${relativePath} is missing SEO marker: ${needle}`);
    }
  }
}

requireText("src/lib/seo.ts", [
  "localizedPageMetadata",
  '"@type": "WebSite"',
  '"@type": "Organization"',
  '"@type": "BreadcrumbList"',
]);

requireText("src/app/(public)/[locale]/layout.tsx", [
  "verification:",
  "googleBot:",
  '"max-image-preview": "large"',
  "twitter:",
]);

requireText("src/app/(public)/[locale]/page.tsx", [
  "websiteJsonLd",
  "organizationJsonLd",
]);

requireText("src/app/(public)/[locale]/tools/page.tsx", [
  "hasFilter",
  "CollectionPage",
  "breadcrumbJsonLd",
  "isEditoriallyIndexableTool",
]);

requireText("src/app/(public)/[locale]/tools/[slug]/page.tsx", [
  "isEditoriallyIndexableTool",
  "SoftwareApplication",
  "breadcrumbJsonLd",
  "isAccessibleForFree",
]);

requireText("src/app/(public)/[locale]/blog/page.tsx", [
  "CollectionPage",
  "breadcrumbJsonLd",
  'rel="prev"',
  'rel="next"',
]);

requireText("src/app/(public)/[locale]/blog/[slug]/page.tsx", [
  '"@type": "Article"',
  "summary_large_image",
  "dateModified",
  "articleSection",
  "wordCount",
  "breadcrumbJsonLd",
]);

requireText("src/app/sitemap.xml/route.ts", [
  "isEditoriallyIndexableTool",
  "getActiveTools",
  "getBlogPosts",
]);

const sitemap = read("src/app/sitemap.xml/route.ts");
if (sitemap.includes("isPriorityToolSlug")) {
  errors.push("Sitemap must use the same editorial indexability rule as tool metadata.");
}

for (const route of ["privacy", "terms", "contact", "support"]) {
  requireText(`src/app/(public)/[locale]/${route}/layout.tsx`, [
    "localizedPageMetadata",
    `path: "/${route}"`,
  ]);
}

requireText("src/app/(public)/[locale]/auth/layout.tsx", [
  "index: false",
  "follow: false",
]);

requireText("src/app/(public)/[locale]/pricing/page.tsx", [
  "generateMetadata",
  'canonical = `/${locale}/pricing`',
  "breadcrumbJsonLd",
]);

if (errors.length) {
  console.error("SEO verification failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("SEO verification passed.");
