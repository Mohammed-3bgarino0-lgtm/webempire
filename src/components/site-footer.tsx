import Link from "next/link";

import { ThirdPartyAdsRuntime } from "@/components/third-party-ads-runtime";
import type { LocaleRecord, SiteIdentity, UiMessages } from "@/localization/types";

const footerLabels = {
  ar: {
    rights: "جميع الحقوق محفوظة.",
    about: "من نحن",
    editorial: "السياسة التحريرية",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    help: "الدعم والمساعدة",
    contact: "تواصل معنا",
    directory: "دليل الأدوات",
  },
  en: {
    rights: "All rights reserved.",
    about: "About",
    editorial: "Editorial policy",
    privacy: "Privacy policy",
    terms: "Terms",
    help: "Support",
    contact: "Contact",
    directory: "Tools directory",
  },
};

export function SiteFooter({
  locale,
  identity,
}: {
  locale?: LocaleRecord;
  identity: SiteIdentity;
  messages?: UiMessages;
}) {
  const localeCode = locale?.code ?? "ar";
  const t = localeCode === "ar" ? footerLabels.ar : footerLabels.en;
  const prefix = `/${localeCode}`;

  return (
    <>
      <ThirdPartyAdsRuntime />
      <footer className="we-footer">
        <div className="we-container we-footer-inner">
          <nav className="we-footer-links" aria-label="Footer">
            <Link href={`${prefix}/directory`}>{t.directory}</Link>
            <Link href={`${prefix}/about`}>{t.about}</Link>
            <Link href={`${prefix}/editorial-policy`}>{t.editorial}</Link>
            <Link href={`${prefix}/terms`}>{t.terms}</Link>
            <Link href={`${prefix}/privacy`}>{t.privacy}</Link>
            <Link href={`${prefix}/contact`}>{t.contact}</Link>
            <Link href={`${prefix}/support`}>{t.help}</Link>
          </nav>

          <div className="we-footer-brand">
            <span>© 2026 {identity.siteName || "Web Empire"}. {t.rights}</span>
            <img src="/brand/v1.2/web-empire-mark-v1.2.png" alt="" width="48" height="48" />
          </div>
        </div>
      </footer>
    </>
  );
}
