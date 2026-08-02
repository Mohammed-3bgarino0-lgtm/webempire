import Link from "next/link";

import { webEmpireLightAssets } from "@/brand/web-empire-light-assets";

import { ColorModeToggle } from "@/components/appearance/color-mode-toggle";
import { LanguageSwitcher } from "@/components/localization/language-switcher";
import type { ColorMode, HeaderStyle } from "@/appearance/types";
import type {
  LocaleRecord,
  SiteIdentity,
  UiMessages,
} from "@/localization/types";
import { translate } from "@/localization/messages";

const labels = {
  ar: {
    pricing: "الأسعار",
    sectors: "التصنيفات",
    blog: "المدونة",
    companies: "الشركات",
    login: "تسجيل الدخول",
    start: "ابدأ الآن",
    dashboard: "لوحة التحكم",
    menu: "فتح قائمة التنقل",
  },
  en: {
    pricing: "Pricing",
    sectors: "Categories",
    blog: "Blog",
    companies: "Companies",
    login: "Login",
    start: "Start now",
    dashboard: "Dashboard",
    menu: "Open navigation menu",
  },
};

export function SiteHeader({
  locale,
  locales,
  messages,
  headerStyle,
  defaultColorMode,
  isAuthenticated,
}: {
  locale: LocaleRecord;
  locales: LocaleRecord[];
  identity: SiteIdentity;
  messages: UiMessages;
  headerStyle: HeaderStyle;
  defaultColorMode: ColorMode;
  isAuthenticated: boolean;
}) {
  const prefix = `/${locale.code}`;
  const t = locale.code === "ar" ? labels.ar : labels.en;
  const brandLogo =
    locale.code === "ar"
      ? webEmpireLightAssets.logoAr
      : webEmpireLightAssets.logoEn;
  const brandLabel =
    locale.code === "ar" ? "إمبراطورية الويب" : "WEB EMPIRE";

  const navigation = [
    { href: prefix, label: translate(messages, "nav.home") },
    { href: `${prefix}/tools`, label: translate(messages, "nav.tools") },
    { href: `${prefix}/tools#categories`, label: t.sectors },
    { href: `${prefix}/pricing`, label: t.pricing },
    { href: `${prefix}/blog`, label: t.blog },
    { href: `${prefix}/companies`, label: t.companies },
  ];

  return (
    <header className={`site-header light-empire-header header-${headerStyle}`}>
      <div className="container light-empire-header-inner">
        <Link
          href={prefix}
          className="light-empire-brand"
          aria-label={brandLabel}
        >
          <img
            src={brandLogo}
            alt={brandLabel}
            width="260"
            height="72"
            className="light-empire-brand-logo"
          />
        </Link>

        <nav
          className="light-empire-nav"
          aria-label={locale.code === "ar" ? "التنقل الرئيسي" : "Main navigation"}
        >
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="light-empire-actions">
          <LanguageSwitcher
            locales={locales}
            currentLocale={locale.code}
            label={translate(messages, "language.label")}
          />

          {isAuthenticated ? (
            <Link
              href={`${prefix}/dashboard`}
              className="light-empire-start"
            >
              ✦ {t.dashboard}
            </Link>
          ) : (
            <>
              <Link
                href={`${prefix}/auth/login`}
                className="light-empire-login"
              >
                {t.login}
              </Link>
              <Link
                href={`${prefix}/auth/register`}
                className="light-empire-start"
              >
                ✧ {t.start}
              </Link>
            </>
          )}

          <div className="light-empire-mode">
            <ColorModeToggle defaultMode={defaultColorMode} />
          </div>
        </div>

        <details className="light-empire-mobile-menu">
          <summary aria-label={t.menu}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </summary>

          <div className="light-empire-mobile-panel">
            <nav
              aria-label={
                locale.code === "ar" ? "تنقل الجوال" : "Mobile navigation"
              }
            >
              {navigation.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="light-empire-mobile-settings">
              <LanguageSwitcher
                locales={locales}
                currentLocale={locale.code}
                label={translate(messages, "language.label")}
              />
              <ColorModeToggle defaultMode={defaultColorMode} />
            </div>

            <div className="light-empire-mobile-auth">
              {isAuthenticated ? (
                <Link
                  href={`${prefix}/dashboard`}
                  className="light-empire-start"
                >
                  ✦ {t.dashboard}
                </Link>
              ) : (
                <>
                  <Link
                    href={`${prefix}/auth/login`}
                    className="light-empire-login"
                  >
                    {t.login}
                  </Link>
                  <Link
                    href={`${prefix}/auth/register`}
                    className="light-empire-start"
                  >
                    ✧ {t.start}
                  </Link>
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
