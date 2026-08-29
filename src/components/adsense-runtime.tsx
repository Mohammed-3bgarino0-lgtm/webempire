"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

import { isReviewedPublicToolSlug } from "@/lib/reviewed-tools";

type AdSenseRuntimeProps = {
  clientId: string;
  enabled: boolean;
};

function shouldLoadAds(pathname: string, hasSearchParams: boolean) {
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "";

  if (section === "auth" || section === "dashboard") return false;

  if (section === "tools") {
    const slug = parts[2];
    if (hasSearchParams) return false;
    if (slug && !isReviewedPublicToolSlug(slug)) return false;
  }

  return true;
}

export function AdSenseRuntime({ clientId, enabled }: AdSenseRuntimeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!enabled || !shouldLoadAds(pathname, searchParams.size > 0)) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
