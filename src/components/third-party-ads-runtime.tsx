"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function shouldLoadThirdPartyAds(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "";

  if (section === "auth" || section === "dashboard") return false;

  if (section === "tools") {
    const slug = parts[2];
    if (!slug) return false;
  }

  return true;
}

type BannerConfig = {
  key: string;
  width: number;
  height: number;
};

const banner468: BannerConfig = {
  key: "8cf8a2307e6c9d2c527db79f43970835",
  width: 468,
  height: 60,
};

const banner300: BannerConfig = {
  key: "950b053437aeacf863ee348efd08d324",
  width: 300,
  height: 250,
};

const banner160x300: BannerConfig = {
  key: "e9f2f21722e1b895c63a909cbf0f184e",
  width: 160,
  height: 300,
};

const banner160x600: BannerConfig = {
  key: "940f3f678262d391b75a0471a2b8024d",
  width: 160,
  height: 600,
};

const banner320: BannerConfig = {
  key: "2a8128248d5545321687da0592b95149",
  width: 320,
  height: 50,
};

const banner728: BannerConfig = {
  key: "78308bf49b27fa115a29acd38186c2aa",
  width: 728,
  height: 90,
};

function adSrcDoc(config: BannerConfig) {
  const options = JSON.stringify({
    key: config.key,
    format: "iframe",
    height: config.height,
    width: config.width,
    params: {},
  });

  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;display:flex;align-items:center;justify-content:center;overflow:hidden;background:transparent"><script>window.atOptions=${options};<\/script><script src="https://www.highrevenueformat.com/${config.key}/invoke.js"><\/script></body></html>`;
}

function IsolatedBanner({ config, title }: { config: BannerConfig; title: string }) {
  return (
    <iframe
      title={title}
      srcDoc={adSrcDoc(config)}
      width={config.width}
      height={config.height}
      loading="lazy"
      scrolling="no"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      style={{
        width: config.width,
        height: config.height,
        maxWidth: "100%",
        border: 0,
        display: "block",
        background: "transparent",
      }}
    />
  );
}

function ResponsiveBanner() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (width === null) return null;

  if (width < 520) {
    return <IsolatedBanner config={banner320} title="Advertisement 320 by 50" />;
  }

  if (width < 820) {
    return <IsolatedBanner config={banner468} title="Advertisement 468 by 60" />;
  }

  return <IsolatedBanner config={banner728} title="Advertisement 728 by 90" />;
}

function SupplementalBanners() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (width === null) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 16,
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      <IsolatedBanner config={banner300} title="Advertisement 300 by 250" />
      {width >= 1280 && width < 1600 ? (
        <IsolatedBanner config={banner160x300} title="Advertisement 160 by 300" />
      ) : null}
      {width >= 1600 ? (
        <IsolatedBanner config={banner160x600} title="Advertisement 160 by 600" />
      ) : null}
    </div>
  );
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

      <section
        aria-label="Advertisements"
        style={{
          width: "100%",
          display: "grid",
          gap: 16,
          justifyItems: "center",
          padding: "24px 16px",
          overflow: "hidden",
        }}
      >
        <ResponsiveBanner />
        <SupplementalBanners />
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
      </section>
    </>
  );
}
