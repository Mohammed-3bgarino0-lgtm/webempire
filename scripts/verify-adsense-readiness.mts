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

const [home, layout, robots, sitemap, blogRepository, blogPage, adsTxt] = await Promise.all([
  read("src/app/(public)/[locale]/page.tsx"),
  read("src/app/(public)/[locale]/layout.tsx"),
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

assert(
  adsTxt.trim() === "google.com, pub-4001237202734263, DIRECT, f08c47fec0942fa0",
  "public/ads.txt must contain the authorized Google seller declaration for the Web Empire publisher ID.",
);

assert(layout.includes('name="google-adsense-account"'), "AdSense account meta tag is missing from the public layout.");
assert(layout.includes("ca-pub-4001237202734263"), "Expected AdSense client ID is missing from the public layout.");
assert(layout.includes('process.env.NODE_ENV === "production"'), "Ad runtime must be enabled by the generic production environment, not a host-specific variable.");
assert(layout.includes('webempire-content-revision'), "Production content revision marker is missing.");
assert(layout.includes('factual-public-content-2026-08-29-v1'), "Unexpected public-content revision marker.");

assert(robots.includes('"Allow: /"'), "robots.txt must allow public crawling.");
assert(!robots.includes("Disallow: /ads"), "robots.txt must not block ads.txt.");
assert(robots.includes("/sitemap.xml"), "robots.txt must advertise the sitemap.");

for (const route of ["about", "editorial-policy", "privacy", "terms", "contact", "support"]) {
  assert(sitemap.includes(`/${route}`), `Sitemap is missing trust route: ${route}`);
}
assert(sitemap.includes("isEditoriallyIndexableTool"), "Sitemap tool filtering must use the editorial indexability policy.");

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

console.log(`AdSense readiness verification: PASS (${approvedIds.length} reviewed articles, ads.txt present, trust and crawl signals validated).`);
