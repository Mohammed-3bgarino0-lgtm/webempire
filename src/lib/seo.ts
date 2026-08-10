import type { Metadata } from "next";

import { publicEnv } from "@/lib/env";

export const SEO_BRAND_NAME = "Web Empire";
export const SEO_BRAND_ALTERNATE_NAME = "إمبراطورية الويب";
export const SEO_LOGO_PATH = "/brand/v1.2/web-empire-mark-v1.2.png";

export function absoluteUrl(pathname = "/") {
  const base = publicEnv.siteUrl.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function localizedPageMetadata({
  locale,
  title,
  description,
  path,
  activeLocales,
  index = true,
}: {
  locale: string;
  title: string;
  description: string;
  path: string;
  activeLocales: Array<{ code: string; locale_code: string }>;
  index?: boolean;
}): Metadata {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const canonical = `/${locale}${suffix}`;

  return {
    title,
    description,
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...activeLocales.map((item) => [item.locale_code, `/${item.code}${suffix}`]),
        ["x-default", `/en${suffix}`],
      ]),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      images: [{ url: SEO_LOGO_PATH, width: 768, height: 682, alt: SEO_BRAND_NAME }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [SEO_LOGO_PATH],
    },
  };
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
