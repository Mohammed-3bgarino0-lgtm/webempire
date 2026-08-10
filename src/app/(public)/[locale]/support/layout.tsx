import type { Metadata } from "next";

import { getActiveLocales } from "@/localization/repository";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const activeLocales = await getActiveLocales();
  const isArabic = locale === "ar";

  return localizedPageMetadata({
    locale,
    path: "/support",
    activeLocales,
    title: isArabic ? "الدعم والمساعدة" : "Support & Help",
    description: isArabic
      ? "إرشادات ودعم لاستخدام حسابات وأدوات ونقاط واشتراكات ومدفوعات إمبراطورية الويب، مع طريقة رفع طلب دعم واضح لتسريع الحل."
      : "Get help with Web Empire accounts, tools, credits, subscriptions, and payments, plus guidance for submitting a clear support request.",
  });
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
