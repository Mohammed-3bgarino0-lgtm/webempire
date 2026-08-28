import Link from "next/link";
import { notFound } from "next/navigation";

import { getLocaleByCode } from "@/localization/repository";

const labels = {
  ar: {
    title: "صفحة الشركات قيد الإعداد",
    body: "لم نطلق حتى الآن خدمة مستقلة أو باقات مخصصة للشركات. يمكنك استخدام الأدوات العامة المتاحة حاليًا أو التواصل معنا إذا كان لديك اقتراح أو احتياج محدد.",
    coming: "قيد الإعداد",
    cta: "استكشف الأدوات",
  },
  en: {
    title: "Company page in progress",
    body: "Web Empire does not currently offer a separate company service or paid company plans. You can use the public tools that are available now or contact us with a specific need or suggestion.",
    coming: "In progress",
    cta: "Explore tools",
  },
};

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const t = locale.code === "ar" ? labels.ar : labels.en;
  const prefix = `/${locale.code}`;

  return (
    <main className="we-page we-simple-page">
      <section className="we-container we-simple-card">
        <img src="/brand/web-empire-hero-castle.svg" alt="" width="420" />
        <p className="we-simple-kicker">{t.coming}</p>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <Link href={`${prefix}/tools`} className="we-button-primary">
          {t.cta}
        </Link>
      </section>
    </main>
  );
}
