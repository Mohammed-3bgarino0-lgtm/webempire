import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";

import "@/app/globals.css";
import "@/app/editorial.css";
import "@/app/empire-brand.css";
import "@/app/empire-command.css";
import "@/app/web-empire-light.css";
import "@/app/apple-inspired.css";
import { appearanceCssVariables, getAppearanceSettings } from "@/appearance/repository";
import { AdSenseRuntime } from "@/components/adsense-runtime";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publicEnv } from "@/lib/env";
import { SEO_BRAND_NAME, SEO_LOGO_PATH } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getActiveLocales,
  getLocaleByCode,
  getSiteIdentity,
  getUiMessages,
} from "@/localization/repository";

const CONTENT_REVISION = "adsense-quality-2026-08-29-v2";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) return {};
  const [identity, activeLocales] = await Promise.all([
    getSiteIdentity(locale),
    getActiveLocales(),
  ]);

  return {
    metadataBase: new URL(publicEnv.siteUrl),
    applicationName: SEO_BRAND_NAME,
    title: {
      default: identity.homeSeoTitle,
      template: `%s | ${identity.siteName}`,
    },
    description: identity.homeSeoDescription,
    authors: [{ name: SEO_BRAND_NAME }],
    creator: SEO_BRAND_NAME,
    publisher: SEO_BRAND_NAME,
    verification: {
      google: "fbz_m2uEfEsNpf-7hB-5WAYTGpIahFEah49G4zXHcYo",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: SEO_LOGO_PATH, type: "image/png" }],
      apple: [{ url: SEO_LOGO_PATH, type: "image/png" }],
    },
    alternates: {
      canonical: `/${locale.code}`,
      languages: Object.fromEntries([
        ...activeLocales.map((item) => [item.locale_code, `/${item.code}`]),
        ["x-default", "/"],
      ]),
    },
    openGraph: {
      title: identity.homeSeoTitle,
      description: identity.homeSeoDescription,
      url: `/${locale.code}`,
      siteName: identity.siteName,
      locale: locale.locale_code,
      type: "website",
      images: [
        {
          url: SEO_LOGO_PATH,
          width: 768,
          height: 682,
          alt: identity.siteName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: identity.homeSeoTitle,
      description: identity.homeSeoDescription,
      images: [SEO_LOGO_PATH],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const supabase = await createSupabaseServerClient();

  const [
    { data: { user } },
    locales,
    identity,
    messages,
    appearance,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getActiveLocales(),
    getSiteIdentity(locale),
    getUiMessages(locale),
    getAppearanceSettings(),
  ]);

  const style = appearanceCssVariables(appearance) as CSSProperties;
  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
    "ca-pub-4001237202734263";
  const adsRuntimeEnabled = process.env.NODE_ENV === "production";

  return (
    <html
      lang={locale.locale_code}
      dir={locale.direction}
      className={`${inter.variable} ${tajawal.variable} ${
        locale.direction === "rtl" ? tajawal.className : inter.className
      }`}
    >
      <head>
        <meta name="google-adsense-account" content={adsenseClient} />
        <meta name="webempire-content-revision" content={CONTENT_REVISION} />
      </head>
      <body>
        <AdSenseRuntime clientId={adsenseClient} enabled={adsRuntimeEnabled} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2H0DD95M9W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-2H0DD95M9W');`}
        </Script>
        <div
          className="public-shell"
          style={style}
          data-theme-preset={appearance.presetKey}
          data-card-style={appearance.cardStyle}
          data-hero-style={appearance.heroStyle}
          data-density={appearance.uiDensity}
          data-font-preset={appearance.fontPreset}
          data-color-mode={appearance.defaultColorMode}
          data-ads-runtime={adsRuntimeEnabled ? "controlled" : "preview"}
        >
          <SiteHeader
            locale={locale}
            locales={locales}
            identity={identity}
            messages={messages}
            headerStyle={appearance.headerStyle}
            defaultColorMode={appearance.defaultColorMode}
            isAuthenticated={Boolean(user)}
          />
          {children}
          <SiteFooter locale={locale} identity={identity} />
        </div>
      </body>
    </html>
  );
}
