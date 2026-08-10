import { publicEnv } from "@/lib/env";

export const SEO_BRAND_NAME = "Web Empire";
export const SEO_BRAND_ALTERNATE_NAME = "إمبراطورية الويب";
export const SEO_LOGO_PATH = "/brand/v1.2/web-empire-mark-v1.2.png";

export function absoluteUrl(pathname = "/") {
  const base = publicEnv.siteUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    url: absoluteUrl("/"),
    name: SEO_BRAND_NAME,
    alternateName: SEO_BRAND_ALTERNATE_NAME,
    inLanguage: locale,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SEO_BRAND_NAME,
    alternateName: SEO_BRAND_ALTERNATE_NAME,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SEO_LOGO_PATH),
      contentUrl: absoluteUrl(SEO_LOGO_PATH),
      width: 768,
      height: 682,
    },
  };
}
