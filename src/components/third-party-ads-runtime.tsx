"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

import { isReviewedPublicToolSlug } from "@/lib/reviewed-tools";

function shouldLoadThirdPartyAds(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "";

  if (section === "auth" || section === "dashboard") return false;

  if (section === "tools") {
    const slug = parts[2];
    if (!slug) return false;
    if (!isReviewedPublicToolSlug(slug)) return false;
  }

  return true;
}

export function ThirdPartyAdsRuntime() {
  const pathname = usePathname();
  const enabled = process.env.NODE_ENV === "production";

  if (!enabled || !shouldLoadThirdPartyAds(pathname)) return null;

  return (
    <>
      <Script
        id="monetag-inpage-push"
        data-zone="11715644"
        src="https://nap5k.com/tag.min.js"
        strategy="afterInteractive"
      />
      <Script
        id="monetag-vignette"
        data-zone="11715665"
        src="https://n6wxm.com/vignette.min.js"
        strategy="afterInteractive"
      />
      <div className="we-third-party-native-ad" aria-label="Advertisement">
        <div id="container-12841e397947da511cebdc3c0eaeca46" />
        <Script
          id="native-ad-12841e397947da511cebdc3c0eaeca46"
          async
          data-cfasync="false"
          src="https://pl31164667.profitableratecpmnetwork.com/12841e397947da511cebdc3c0eaeca46/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </>
  );
}
