import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "تواصل معنا",
    intro:
      "يسعدنا استقبال استفساراتك المتعلقة بالحسابات والاشتراكات والدعم الفني والشراكات والملاحظات العامة حول منصة إمبراطورية الويب.",
    updatedAt: "آخر تحديث: 4 أغسطس 2026",
    primaryLabel: "إرسال بريد إلكتروني",
    secondaryLabel: "الدعم والمساعدة",
    sections: [
      {
        title: "البريد الإلكتروني الرسمي",
        paragraphs: [
          "يمكنك التواصل معنا عبر البريد: mohammed-alsakran@hotmail.com. يرجى استخدام البريد المرتبط بحسابك عند الاستفسار عن الاشتراكات أو النقاط أو المدفوعات.",
        ],
      },
      {
        title: "الدعم الفني",
        items: [
          "مشاكل تسجيل الدخول أو استعادة الحساب.",
          "تعطل أداة أو ظهور رسالة خطأ أثناء التشغيل.",
          "عدم تحديث الرصيد أو النقاط بعد الدفع.",
          "مشاكل الوصول إلى مزايا الخطة المدفوعة.",
        ],
      },
      {
        title: "الفوترة والاشتراكات",
        items: [
          "الاستفسار عن عملية دفع أو فاتورة.",
          "طلب إلغاء اشتراك أو مراجعة تجديد.",
          "طلب استرداد وفق سياسة الاسترداد والإلغاء.",
          "الإبلاغ عن خصم مكرر أو معاملة غير معروفة.",
        ],
      },
      {
        title: "الشراكات واحتياجات الشركات",
        paragraphs: [
          "للشراكات أو الحلول المخصصة أو الاستخدام المؤسسي، أرسل وصفًا مختصرًا للجهة والاحتياج المتوقع وعدد المستخدمين والأدوات المطلوبة، وسنراجع الطلب ونتواصل معك.",
        ],
      },
      {
        title: "ماذا تكتب في الرسالة؟",
        items: [
          "الاسم والبريد المرتبط بالحساب.",
          "نوع الطلب: دعم، فوترة، استرداد، شراكة، أو اقتراح.",
          "شرح واضح للمشكلة والخطوات التي سبقتها.",
          "رقم المعاملة أو الاشتراك عند وجود مشكلة دفع.",
          "لقطة شاشة لرسالة الخطأ دون إظهار كلمات المرور أو بيانات البطاقة.",
        ],
      },
      {
        title: "زمن الاستجابة",
        paragraphs: [
          "نسعى للرد على الرسائل خلال يومي عمل. قد تستغرق الطلبات المتعلقة بالدفع أو التحقيقات الأمنية وقتًا إضافيًا بسبب الحاجة إلى مراجعة مزود الدفع أو سجلات النظام.",
        ],
      },
      {
        title: "الأمان والخصوصية",
        paragraphs: [
          "لن نطلب منك إرسال كلمة المرور أو رقم البطاقة الكامل أو رمز الحماية. لا ترسل بيانات مالية حساسة عبر البريد الإلكتروني. عند الإبلاغ عن مشكلة أمنية اكتب في عنوان الرسالة: بلاغ أمني.",
        ],
      },
      {
        title: "بيانات النشاط",
        paragraphs: [
          "إمبراطورية الويب منصة برمجية رقمية تعمل من المملكة العربية السعودية وتقدم أدوات إنتاجية وذكاء اصطناعي وخطط اشتراك شهرية للمستخدمين والأعمال.",
        ],
      },
    ],
  },
  en: {
    title: "Contact Us",
    intro:
      "Contact Web Empire for account, billing, technical support, partnerships, and general inquiries.",
    updatedAt: "Last updated: August 4, 2026",
    primaryLabel: "Send email",
    secondaryLabel: "Support",
    sections: [
      {
        title: "Official email",
        paragraphs: [
          "Email us at mohammed-alsakran@hotmail.com. For account or billing requests, use the email address linked to your Web Empire account.",
        ],
      },
      {
        title: "What to include",
        items: [
          "Your account email and request category.",
          "A clear description of the issue.",
          "The transaction or subscription reference when relevant.",
          "A screenshot that does not expose passwords or complete card details.",
        ],
      },
      {
        title: "Response time",
        paragraphs: [
          "We aim to respond within two business days. Billing and security investigations may take longer.",
        ],
      },
    ],
  },
} as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeCode } = await params;
  const locale = await getLocaleByCode(localeCode);
  if (!locale) notFound();

  const t = locale.code === "ar" ? copy.ar : copy.en;
  const prefix = `/${locale.code}`;

  return (
    <PublicContentPage
      title={t.title}
      intro={t.intro}
      updatedAt={t.updatedAt}
      sections={[...t.sections]}
      primaryHref="mailto:mohammed-alsakran@hotmail.com"
      primaryLabel={t.primaryLabel}
      secondaryHref={`${prefix}/support`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
