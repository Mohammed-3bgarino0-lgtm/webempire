import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function read(relativePath: string) {
  return fs.readFile(path.join(root, relativePath), "utf8");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function exists(relativePath: string) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

const [
  home,
  toolsPage,
  header,
  privacy,
  layout,
  adsRuntime,
  reviewedTools,
  reviewedEditorial,
  proxy,
  robots,
  sitemap,
  blogRepository,
  blogPage,
  adsTxt,
] = await Promise.all([
  read("src/app/(public)/[locale]/page.tsx"),
  read("src/app/(public)/[locale]/tools/page.tsx"),
  read("src/components/site-header.tsx"),
  read("src/app/(public)/[locale]/privacy/page.tsx"),
  read("src/app/(public)/[locale]/layout.tsx"),
  read("src/components/adsense-runtime.tsx"),
  read("src/lib/reviewed-tools.ts"),
  read("src/lib/reviewed-tool-editorial.ts"),
  read("proxy.ts"),
  read("src/app/robots.txt/route.ts"),
  read("src/app/sitemap.xml/route.ts"),
  read("src/repositories/blog.ts"),
  read("src/app/(public)/[locale]/blog/page.tsx"),
  read("public/ads.txt"),
]);

const forbiddenHomeClaims = [
  "موثوق من قبل آلاف المستخدمين",
  "Trusted by thousands",
  "10,000+ users",
  "أكثر من 10,000 مستخدم",
  "99.9%",
  "603+",
  "باقات مناسبة للجميع",
  "أدوات وذكاء اصطناعي",
  "Tools and AI",
];
for (const claim of forbiddenHomeClaims) {
  assert(!home.includes(claim), `Unverified homepage claim is still present: ${claim}`);
}

assert(home.includes('role="search"'), "Homepage must expose a real search form, not a decorative search box.");
assert(home.includes('name="q"'), "Homepage search must submit the q query to the tools library.");
assert(home.includes("categoryGroups"), "Homepage must expose direct calculator discovery by category.");
assert(home.includes("isReviewedPublicToolSlug"), "Homepage must only promote manually reviewed calculators.");
assert(toolsPage.includes("isReviewedPublicToolSlug"), "Public tools library must only list manually reviewed calculators.");
assert(!header.includes("/companies"), "Unfinished companies page must not be linked from public navigation.");
assert(
  !(await exists("src/app/(public)/[locale]/companies/page.tsx")),
  "Unfinished companies placeholder should not be part of the public site during AdSense review.",
);

const reviewedSlugMatches = reviewedTools.match(/"[a-z0-9-]+"/g) ?? [];
assert(reviewedSlugMatches.length === 12, `Expected exactly 12 manually reviewed public calculators; found ${reviewedSlugMatches.length}.`);
for (const slugLiteral of reviewedSlugMatches) {
  const slug = slugLiteral.slice(1, -1);
  assert(reviewedEditorial.includes(`"${slug}"`), `Reviewed calculator is missing hand-authored editorial content: ${slug}`);
}

assert(
  adsTxt.trim() === "google.com, pub-4001237202734263, DIRECT, f08c47fec0942fa0",
  "public/ads.txt must contain the authorized Google seller declaration for the Web Empire publisher ID.",
);

assert(layout.includes('name="google-adsense-account"'), "AdSense account meta tag is missing from the public layout.");
assert(layout.includes("ca-pub-4001237202734263"), "Expected AdSense client ID is missing from the public layout.");
assert(layout.includes('process.env.NODE_ENV === "production"'), "Ad runtime must be enabled by the generic production environment, not a host-specific variable.");
assert(layout.includes("<AdSenseRuntime"), "Public layout must use the controlled AdSense runtime component.");
assert(!layout.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"), "Public layout must not load AdSense globally on every route.");
assert(layout.includes('webempire-content-revision'), "Production content revision marker is missing.");
assert(layout.includes('adsense-quality-2026-08-29-v2'), "Unexpected public-content revision marker.");

assert(adsRuntime.includes('section === "auth"'), "AdSense runtime must exclude authentication screens.");
assert(adsRuntime.includes('section === "dashboard"'), "AdSense runtime must exclude dashboard screens.");
assert(adsRuntime.includes("isReviewedPublicToolSlug"), "AdSense runtime must exclude unreviewed calculator pages.");
assert(adsRuntime.includes("if (!slug) return false"), "AdSense runtime must exclude the navigation-heavy tools index.");

assert(proxy.includes('X-Robots-Tag'), "Proxy must emit an X-Robots-Tag for non-indexable routes.");
assert(proxy.includes("isReviewedPublicToolSlug"), "Proxy must noindex unreviewed tool detail pages.");
assert(proxy.includes('section === "auth"'), "Proxy must noindex authentication routes.");
assert(proxy.includes('section === "dashboard"'), "Proxy must noindex dashboard routes.");

assert(privacy.includes("Google"), "Privacy policy must disclose Google advertising/analytics usage.");
assert(privacy.includes("ملفات تعريف الارتباط") || privacy.includes("cookies"), "Privacy policy must disclose cookie usage.");
assert(privacy.includes("تخصيص الإعلانات") || privacy.includes("ad personalization"), "Privacy policy must explain ad-personalization choices.");

assert(robots.includes('"Allow: /"'), "robots.txt must allow public crawling.");
assert(!robots.includes("Disallow: /ads"), "robots.txt must not block ads.txt.");
assert(robots.includes("/sitemap.xml"), "robots.txt must advertise the sitemap.");

for (const route of ["about", "editorial-policy", "privacy", "terms", "contact", "support"]) {
  assert(sitemap.includes(`/${route}`), `Sitemap is missing trust route: ${route}`);
}
assert(!sitemap.includes("/companies"), "Sitemap must not include unfinished placeholder pages.");
assert(sitemap.includes("isEditoriallyIndexableTool"), "Sitemap must retain baseline editorial eligibility checks.");
assert(sitemap.includes("isReviewedPublicToolSlug"), "Sitemap must include only manually reviewed calculators.");

const approvedMatch = blogRepository.match(/editorialApprovedIds\s*=\s*\[([^\]]+)\]/s);
assert(approvedMatch, "Could not find the reviewed blog allowlist.");
const approvedIds = approvedMatch[1]
  .split(",")
  .map((value) => Number(value.trim()))
  .filter(Number.isFinite);
assert(approvedIds.length >= 6, `Expected at least 6 manually reviewed articles; found ${approvedIds.length}.`);
assert(!blogPage.includes("قريبًا"), "Arabic blog index must not use the legacy coming-soon placeholder.");
assert(blogPage.includes("مراجعة") || blogPage.includes("مراجعتها"), "Blog index should expose an editorial review signal.");

for (const route of ["about", "editorial-policy", "privacy", "terms", "contact", "support"]) {
  assert(
    await exists(`src/app/(public)/[locale]/${route}/page.tsx`),
    `Missing public trust page: ${route}`,
  );
}

assert(await exists("src/app/(public)/[locale]/auth/layout.tsx"), "Auth noindex layout is missing.");

console.log(
  `AdSense readiness verification: PASS (${reviewedSlugMatches.length} reviewed calculators, ${approvedIds.length} reviewed articles, controlled ad loading, noindex policy, ads.txt, privacy, trust and crawl signals validated).`,
);
