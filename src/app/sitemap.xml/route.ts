import { publicEnv } from "@/lib/env";
import { getActiveLocales } from "@/localization/repository";
import { isEditoriallyIndexableTool } from "@/lib/tool-editorial-content";
import { getBlogPosts } from "@/repositories/blog";
import { getActiveTools } from "@/repositories/catalog";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const [locales, { posts: blogPosts }] = await Promise.all([
    getActiveLocales(),
    getBlogPosts(1, 10000),
  ]);

  const entries: Array<{ url: string; lastmod?: string }> = [];

  for (const locale of locales) {
    const prefix = `${publicEnv.siteUrl}/${locale.code}`;
    entries.push({ url: prefix });
    entries.push({ url: `${prefix}/tools` });
    entries.push({ url: `${prefix}/about` });
    entries.push({ url: `${prefix}/editorial-policy` });
    entries.push({ url: `${prefix}/privacy` });
    entries.push({ url: `${prefix}/terms` });
    entries.push({ url: `${prefix}/contact` });
    entries.push({ url: `${prefix}/support` });

    const localizedTools = await getActiveTools(locale.code);
    const indexableTools = localizedTools.filter(isEditoriallyIndexableTool);

    for (const tool of indexableTools) {
      entries.push({ url: `${prefix}/tools/${tool.slug}` });
    }
  }

  entries.push({ url: `${publicEnv.siteUrl}/ar/blog` });
  for (const post of blogPosts) {
    entries.push({
      url: `${publicEnv.siteUrl}/ar/blog/${post.slug}`,
      lastmod: post.publish_date,
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(
      (entry) => `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${
        entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""
      }\n  </url>`,
    )
    .join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
