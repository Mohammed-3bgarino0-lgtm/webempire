import type { Metadata } from "next";

import { getActiveLocales } from "@/localization/repository";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const activeLocales = await getActiveLocales();
  const isArabic = locale === "ar";

  return localizedPageMetadata({
    locale,
    path: "/privacy",
    activeLocales,
    title: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    description: isArabic
      ? "تعرف على البيانات التي تجمعها إمبراطورية الويب وكيف نستخدمها ونحميها وخيارات الخصوصية المتاحة عند استخدام الحساب والأدوات."
      : "Learn what data Web Empire collects, how it is used and protected, and the privacy choices available when using accounts and tools.",
  });
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
