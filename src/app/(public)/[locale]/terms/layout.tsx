import type { Metadata } from "next";

import { getActiveLocales } from "@/localization/repository";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const activeLocales = await getActiveLocales();
  const isArabic = locale === "ar";

  return localizedPageMetadata({
    locale,
    path: "/terms",
    activeLocales,
    title: isArabic ? "الشروط والأحكام" : "Terms and Conditions",
    description: isArabic
      ? "راجع شروط استخدام إمبراطورية الويب والحسابات والأدوات والاشتراكات والنقاط وسياسة الإلغاء والاسترداد والاستخدام المقبول."
      : "Review the terms governing Web Empire accounts, tools, subscriptions, credits, cancellation, refunds, and acceptable use.",
  });
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
