import type { Metadata } from "next";

import { getActiveLocales } from "@/localization/repository";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const activeLocales = await getActiveLocales();
  const isArabic = locale === "ar";

  return localizedPageMetadata({
    locale,
    path: "/contact",
    activeLocales,
    title: isArabic ? "تواصل معنا" : "Contact Web Empire",
    description: isArabic
      ? "تواصل مع إمبراطورية الويب بشأن الحسابات والدعم الفني والشراكات والملاحظات أو الإبلاغ عن مشكلة في أداة أو محتوى."
      : "Contact Web Empire about accounts, technical support, partnerships, feedback, or an issue with a tool or article.",
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
