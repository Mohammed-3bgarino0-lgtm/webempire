"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

import { isAdReviewedPublicToolSlug } from "@/lib/reviewed-tools";

type AdSenseRuntimeProps = {
  clientId: string;
  enabled: boolean;
};

function shouldLoadAds(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "";

  if (section === "auth" || section === "dashboard") return false;

  if (section === "tools") {
    const slug = parts[2];
    if (!slug) return false;
    if (!isAdReviewedPublicToolSlug(slug)) return false;
  }

  return true;
}

export function AdSenseRuntime({ clientId, enabled }: AdSenseRuntimeProps) {
  const pathname = usePathname();

  if (!enabled || !shouldLoadAds(pathname)) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
