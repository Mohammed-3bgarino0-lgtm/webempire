import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "تواصل معنا",
    intro:
      "يسعدنا استقبال استفساراتك المتعلقة بالحسابات والدعم الفني والشراكات والملاحظات العامة حول منصة إمبراطورية الويب.",
    updatedAt: "آخر تحديث: 28 أغسطس 2026",
    primaryLabel: "إرسال بريد إلكتروني",
    secondaryLabel: "الدعم والمساعدة",
    sections: [
      {
        title: "البريد الإلكتروني الرسمي",
        paragraphs: [
          "يمكنك التواصل معنا عبر البريد: mohammed-alsakran@hotmail.com. يرجى استخدام البريد المرتبط بحسابك عند الاستفسار عن الحساب أو مشكلة تقنية.",
        ],
      },
      {
        title: "الدعم الفني",
        items: [
          "مشاكل تسجيل الدخول أو استعادة الحساب.",
          "تعطل أداة أو ظهور رسالة خطأ أثناء التشغيل.",
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
          "نوع الطلب: دعم، شراكة، اقتراح، أو ملاحظة.",
          "شرح واضح للمشكلة والخطوات التي سبقتها.",
          "لقطة شاشة لرسالة الخطأ دون إظهار كلمات المرور أو أي بيانات حساسة.",
        ],
      },
      {
        title: "زمن الاستجابة",
        paragraphs: [
          "نسعى للرد على الرسائل خلال يومي عمل. قد تستغرق التحقيقات الأمنية أو الأعطال المعقدة وقتًا إضافيًا بسبب الحاجة إلى مراجعة سجلات النظام.",
        ],
      },
      {
        title: "الأمان والخصوصية",
        paragraphs: [
          "لن نطلب منك إرسال كلمة المرور أو رموز التحقق. لا ترسل بيانات حساسة عبر البريد الإلكتروني. عند الإبلاغ عن مشكلة أمنية اكتب في عنوان الرسالة: بلاغ أمني.",
        ],
      },
      {
        title: "بيانات النشاط",
        paragraphs: [
          "إمبراطورية الويب منصة برمجية رقمية تعمل من المملكة العربية السعودية وتقدم أدوات رقمية مجانية للمستخدمين.",
        ],
      },
    ],
  },
  en: {
    title: "Contact Us",
    intro:
      "Contact Web Empire for account help, technical support, partnerships, and general inquiries.",
    updatedAt: "Last updated: August 28, 2026",
    primaryLabel: "Send email",
    secondaryLabel: "Support",
    sections: [
      {
        title: "Official email",
        paragraphs: [
          "Email us at mohammed-alsakran@hotmail.com. For account requests, use the email address linked to your Web Empire account.",
        ],
      },
      {
        title: "What to include",
        items: [
          "Your account email and request category.",
          "A clear description of the issue.",
          "A screenshot that does not expose passwords or sensitive information.",
        ],
      },
      {
        title: "Response time",
        paragraphs: [
          "We aim to respond within two business days. Security investigations or complex technical issues may take longer.",
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
