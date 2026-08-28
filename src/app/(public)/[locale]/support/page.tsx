import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "الدعم والمساعدة",
    intro:
      "تجد هنا إرشادات سريعة للحسابات والأدوات المجانية، إضافة إلى طريقة رفع طلب دعم واضح لتسريع الحل.",
    updatedAt: "آخر تحديث: 28 أغسطس 2026",
    primaryLabel: "تواصل مع الدعم",
    secondaryLabel: "الشروط والأحكام",
    sections: [
      {
        title: "مشاكل تسجيل الدخول",
        items: [
          "تأكد من استخدام البريد نفسه الذي أنشأت به الحساب.",
          "استخدم خيار نسيت كلمة المرور لاستلام رابط إعادة التعيين.",
          "افحص مجلد الرسائل غير المرغوبة إذا لم تصل الرسالة.",
          "إذا استمرت المشكلة، أرسل البريد المرتبط بالحساب ووقت آخر محاولة دخول.",
        ],
      },
      {
        title: "الأدوات وعمليات التشغيل",
        items: [
          "تحقق من اكتمال الحقول المطلوبة قبل تشغيل الأداة.",
          "تجنب رفع ملفات محمية بكلمة مرور أو بتنسيقات غير مدعومة.",
          "عند ظهور خطأ، لا تكرر التشغيل مرات كثيرة قبل التأكد من حالة الطلب.",
          "أرسل اسم الأداة ووقت التشغيل ورسالة الخطأ عند طلب الدعم.",
        ],
      },
      {
        title: "الخدمة المجانية",
        items: [
          "الأدوات المتاحة للمستخدمين حاليًا مجانية.",
          "إذا تعذر تشغيل أداة، أرسل اسم الأداة ووقت المحاولة ورسالة الخطأ.",
          "يمكن مراجعة سجل التشغيلات من لوحة الحساب عند تسجيل الدخول.",
        ],
      },
      {
        title: "قبل إرسال طلب الدعم",
        items: [
          "سجل الخروج ثم الدخول مرة أخرى.",
          "حدّث الصفحة تحديثًا كاملًا أو جرّب متصفحًا حديثًا.",
          "تحقق من اتصال الإنترنت وجرّب متصفحًا حديثًا.",
          "احتفظ بلقطة شاشة للخطأ دون كشف كلمة المرور أو أي بيانات حساسة.",
        ],
      },
      {
        title: "معلومات مطلوبة لتسريع الحل",
        items: [
          "البريد المرتبط بالحساب.",
          "اسم الأداة.",
          "التاريخ والوقت التقريبي للمشكلة.",
          "رقم التشغيل إن وجد.",
          "وصف الخطوات التي أدت إلى المشكلة.",
        ],
      },
      {
        title: "الأولوية والاستجابة",
        paragraphs: [
          "نعطي الأولوية للمشكلات الأمنية وتعطل الحساب بالكامل والأعطال التي تمنع تشغيل الأدوات. نسعى للرد خلال يومي عمل، وقد تتطلب بعض الحالات مراجعة إضافية.",
        ],
      },
      {
        title: "الإبلاغ عن مشكلة أمنية",
        paragraphs: [
          "عند الاشتباه في اختراق حساب أو تسرب بيانات، غيّر كلمة المرور فورًا ثم أرسل رسالة بعنوان بلاغ أمني إلى mohammed-alsakran@hotmail.com. لا ترسل كلمات المرور أو رموز التحقق أو أي بيانات حساسة.",
        ],
      },
    ],
  },
  en: {
    title: "Support",
    intro:
      "Find help for accounts and free tools, along with the information needed for a support request.",
    updatedAt: "Last updated: August 28, 2026",
    primaryLabel: "Contact support",
    secondaryLabel: "Terms and conditions",
    sections: [
      {
        title: "Accounts and tools",
        paragraphs: [
          "Use password recovery for login issues. For tool errors, include the tool name, approximate time, and the displayed error message.",
        ],
      },
      {
        title: "Free service",
        paragraphs: [
          "The tools currently available to users are free to use.",
        ],
      },
      {
        title: "Response time",
        paragraphs: [
          "We aim to respond within two business days, with priority given to security, account access, and service availability issues.",
        ],
      },
    ],
  },
} as const;

export default async function SupportPage({
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
      secondaryHref={`${prefix}/terms`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
