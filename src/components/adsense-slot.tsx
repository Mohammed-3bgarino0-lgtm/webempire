"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdSenseSlotProps = {
  slot?: string;
  placement: string;
  label?: string;
  placeholderText?: string;
  className?: string;
  live?: boolean;
};

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  "ca-pub-4001237202734263";

export function AdSenseSlot({
  slot,
  placement,
  label = "إعلان",
  placeholderText = "مساحة إعلانية",
  className = "",
  live = false,
}: AdSenseSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!live || !adRef.current) return;
    if (adRef.current.dataset.adsbygoogleStatus) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense retries on navigation or the next page view.
    }
  }, [live]);

  return (
    <aside
      className={`we-ad-slot ${className}`.trim()}
      data-ad-placement={placement}
      aria-label={label}
    >
      <span className="we-ad-label">{label}</span>
      {live ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot?.trim()}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="we-ad-placeholder" aria-hidden="true">
          {placeholderText}
        </div>
      )}
    </aside>
  );
}

export function AdSenseHydrator({
  selector = ".we-blog-article .adsbygoogle",
}: {
  selector?: string;
}) {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".public-shell");
    if (shell?.dataset.adsAccess === "paid") return;
    if (shell?.dataset.adsRuntime !== "live") return;

    const units = Array.from(
      document.querySelectorAll<HTMLModElement>(selector),
    ).filter((unit) => !unit.dataset.adsbygoogleStatus);

    for (let index = 0; index < units.length; index += 1) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        break;
      }
    }
  }, [selector]);

  return null;
}
