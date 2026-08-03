import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "الدعم والمساعدة",
    intro:
      "تجد هنا إرشادات سريعة للحسابات والأدوات والنقاط والاشتراكات والمدفوعات، إضافة إلى طريقة رفع طلب دعم واضح لتسريع الحل.",
    updatedAt: "آخر تحديث: 4 أغسطس 2026",
    primaryLabel: "تواصل مع الدعم",
    secondaryLabel: "الشروط والاسترداد",
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
          "عند ظهور خطأ، لا تكرر التشغيل مرات كثيرة قبل التأكد من حالة الرصيد.",
          "أرسل اسم الأداة ووقت التشغيل ورسالة الخطأ عند طلب الدعم.",
        ],
      },
      {
        title: "النقاط والرصيد",
        items: [
          "يظهر الرصيد الحالي داخل لوحة الحساب.",
          "يتم خصم النقاط بحسب تكلفة الأداة وطريقة التشغيل.",
          "بعد نجاح الاشتراك قد يستغرق تحديث الرصيد لحظات حتى يصل تأكيد مزود الدفع.",
          "إذا تم الخصم دون نتيجة، أرسل رقم التشغيل أو وقته لمراجعة السجل.",
        ],
      },
      {
        title: "الاشتراكات والمدفوعات",
        items: [
          "يتم تفعيل الخطة بعد وصول تأكيد الدفع الناجح.",
          "تتجدد الاشتراكات المدفوعة تلقائيًا حتى يتم إلغاؤها.",
          "تتم معالجة المدفوعات والفواتير بواسطة Paddle.",
          "عند وجود خصم مكرر أو عملية غير معروفة، تواصل فورًا مع ذكر رقم المعاملة.",
        ],
      },
      {
        title: "الإلغاء والاسترداد",
        paragraphs: [
          "لطلب إلغاء الاشتراك أو استرداد دفعة، أرسل رسالة إلى mohammed-alsakran@hotmail.com من البريد المرتبط بالحساب. اذكر رقم المعاملة وسبب الطلب. تخضع الطلبات لسياسة الاسترداد الموجودة ضمن الشروط والأحكام وللحقوق النظامية المطبقة.",
        ],
      },
      {
        title: "قبل إرسال طلب الدعم",
        items: [
          "سجل الخروج ثم الدخول مرة أخرى.",
          "حدّث الصفحة تحديثًا كاملًا أو جرّب متصفحًا حديثًا.",
          "تحقق من اتصال الإنترنت ومن عدم حظر النوافذ المنبثقة عند الدفع.",
          "احتفظ بلقطة شاشة للخطأ دون كشف كلمة المرور أو بيانات البطاقة.",
        ],
      },
      {
        title: "معلومات مطلوبة لتسريع الحل",
        items: [
          "البريد المرتبط بالحساب.",
          "اسم الأداة أو الخطة.",
          "التاريخ والوقت التقريبي للمشكلة.",
          "رقم المعاملة أو التشغيل إن وجد.",
          "وصف الخطوات التي أدت إلى المشكلة.",
        ],
      },
      {
        title: "الأولوية والاستجابة",
        paragraphs: [
          "نعطي الأولوية للمشكلات الأمنية، وفشل الدفع، وعدم تفعيل الاشتراك بعد نجاح العملية، وتعطل الحساب بالكامل. نسعى للرد خلال يومي عمل، وقد تتطلب بعض الحالات مراجعة إضافية.",
        ],
      },
      {
        title: "الإبلاغ عن مشكلة أمنية",
        paragraphs: [
          "عند الاشتباه في اختراق حساب أو تسرب بيانات، غيّر كلمة المرور فورًا ثم أرسل رسالة بعنوان بلاغ أمني إلى mohammed-alsakran@hotmail.com. لا ترسل كلمات المرور أو رموز التحقق أو بيانات البطاقة.",
        ],
      },
    ],
  },
  en: {
    title: "Support",
    intro:
      "Find help for accounts, tools, credits, subscriptions, and payments, along with the information needed for a support request.",
    updatedAt: "Last updated: August 4, 2026",
    primaryLabel: "Contact support",
    secondaryLabel: "Terms and refunds",
    sections: [
      {
        title: "Accounts and tools",
        paragraphs: [
          "Use password recovery for login issues. For tool errors, include the tool name, approximate time, and the displayed error message.",
        ],
      },
      {
        title: "Credits and subscriptions",
        paragraphs: [
          "Credits are deducted based on tool usage. Paid plans activate after successful payment confirmation from Paddle.",
        ],
      },
      {
        title: "Cancellation and refunds",
        paragraphs: [
          "Email mohammed-alsakran@hotmail.com from your account email and include the transaction reference and reason for the request.",
        ],
      },
      {
        title: "Response time",
        paragraphs: [
          "We aim to respond within two business days, with priority given to security, billing, and account access issues.",
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
