import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "الشروط والأحكام",
    intro:
      "تنظم هذه الشروط استخدام منصة إمبراطورية الويب وحساباتها وأدواتها الرقمية. لا تقدم المنصة حاليًا خطط اشتراك مدفوعة أو نظام فوترة للمستخدمين.",
    updatedAt: "آخر تحديث: 28 أغسطس 2026",
    primaryLabel: "استكشف الأدوات",
    secondaryLabel: "تواصل معنا",
    sections: [
      {
        title: "1. التعريف بالمنصة",
        paragraphs: [
          "إمبراطورية الويب منصة تقدم أدوات رقمية وحاسبات ومحولات وأدوات إنتاجية. قد تتغير الأدوات والخصائص المتاحة مع تطوير الخدمة.",
        ],
      },
      {
        title: "2. إنشاء الحساب والأهلية",
        items: [
          "يجب تقديم بيانات صحيحة ومحدثة عند إنشاء الحساب.",
          "أنت مسؤول عن حماية بيانات الدخول وعن جميع الأنشطة التي تتم من خلال حسابك.",
          "يجب إبلاغنا فورًا عند الاشتباه في استخدام غير مصرح به للحساب.",
          "لا يجوز إنشاء حسابات بغرض إساءة الاستخدام أو تجاوز القيود الفنية أو الأمنية.",
        ],
      },
      {
        title: "3. إتاحة الأدوات",
        items: [
          "الأدوات المنشورة حاليًا متاحة دون اشتراك مدفوع.",
          "قد تتطلب بعض الأدوات تسجيل الدخول لأسباب تشغيلية أو أمنية دون أن يعني ذلك وجود اشتراك مدفوع.",
          "يجوز إضافة أدوات أو تعديلها أو إيقافها عند الحاجة إلى الصيانة أو تحسين الخدمة.",
        ],
      },
      {
        title: "4. الاستخدام المقبول",
        items: [
          "يحظر استخدام المنصة في أي نشاط غير مشروع أو احتيالي أو ينتهك حقوق الآخرين.",
          "يحظر رفع محتوى ضار أو برمجيات خبيثة أو بيانات لا تملك حق استخدامها.",
          "يحظر محاولة اختراق المنصة أو تعطيلها أو تجاوز الحماية أو القيود الفنية.",
          "يبقى المستخدم مسؤولًا عن مراجعة النتائج قبل الاعتماد عليها مهنيًا أو قانونيًا أو ماليًا.",
        ],
      },
      {
        title: "5. دقة النتائج",
        paragraphs: [
          "تقدم الأدوات نتائج حسابية أو تحويلية أو نصية بحسب البيانات المدخلة وقواعد كل أداة. يجب التحقق من النتائج قبل استخدامها في القرارات المهمة، ولا تمثل النتائج استشارة قانونية أو طبية أو مالية أو مهنية.",
        ],
      },
      {
        title: "6. الملكية الفكرية",
        paragraphs: [
          "تظل العلامة التجارية والتصميم والبرمجيات والمحتوى الأصلي للمنصة مملوكة لإمبراطورية الويب أو لأصحاب التراخيص. يحتفظ المستخدم بحقوقه في المحتوى الذي يقدمه، ويمنح المنصة الإذن الفني اللازم لمعالجته لتقديم الوظيفة المطلوبة.",
        ],
      },
      {
        title: "7. توفر الخدمة والتغييرات",
        paragraphs: [
          "نسعى إلى توفير المنصة بصورة مستقرة، لكن قد تحدث صيانة أو أعطال أو تغييرات في الخدمات الخارجية. يجوز تحديث الأدوات أو الحدود الفنية مع نشر التغييرات المهمة عند الحاجة.",
        ],
      },
      {
        title: "8. تعليق الحساب وإنهاؤه",
        paragraphs: [
          "يجوز تعليق الحساب أو إنهاؤه عند مخالفة هذه الشروط أو إساءة الاستخدام أو وجود مخاطر أمنية. سنحاول إشعار المستخدم متى كان ذلك ممكنًا، مع الاحتفاظ بالحقوق والالتزامات النظامية.",
        ],
      },
      {
        title: "9. المسؤولية",
        paragraphs: [
          "تقدم الخدمة بحسب حالتها المتاحة. وفي الحدود التي يسمح بها النظام، لا نتحمل الأضرار غير المباشرة الناتجة عن سوء استخدام المنصة أو الاعتماد غير المتحقق على النتائج أو تعطل خدمات طرف ثالث.",
        ],
      },
      {
        title: "10. القانون والتواصل",
        paragraphs: [
          "تخضع هذه الشروط للأنظمة المعمول بها في المملكة العربية السعودية دون الإخلال بحقوق المستهلك الإلزامية في بلد إقامته. للاستفسارات تواصل معنا من صفحة التواصل.",
        ],
      },
    ],
  },
  en: {
    title: "Terms and Conditions",
    intro:
      "These terms govern the use of Web Empire accounts and digital tools. Web Empire currently does not offer paid subscription plans or user billing.",
    updatedAt: "Last updated: August 28, 2026",
    primaryLabel: "Explore tools",
    secondaryLabel: "Contact us",
    sections: [
      {
        title: "Service",
        paragraphs: [
          "Web Empire provides digital tools, calculators, converters, and productivity utilities. Available tools and features may change as the service develops.",
        ],
      },
      {
        title: "Accounts",
        paragraphs: [
          "Users must provide accurate account information, protect their credentials, and promptly report suspected unauthorized access.",
        ],
      },
      {
        title: "Tool access",
        paragraphs: [
          "Published tools are currently available without a paid subscription. Some tools may require sign-in for operational or security reasons.",
        ],
      },
      {
        title: "Acceptable use",
        paragraphs: [
          "Users may not misuse the service, attempt unauthorized access, upload malicious content, violate third-party rights, or interfere with the platform's operation.",
        ],
      },
      {
        title: "Results and responsibility",
        paragraphs: [
          "Tool results should be reviewed before use in important decisions and do not constitute legal, medical, financial, or other professional advice.",
        ],
      },
      {
        title: "Intellectual property and availability",
        paragraphs: [
          "Web Empire branding, software, design, and original content remain protected. The service may be changed, maintained, suspended, or updated when necessary.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "These terms are governed by the applicable laws of the Kingdom of Saudi Arabia without limiting mandatory consumer rights. Use the contact page for questions.",
        ],
      },
    ],
  },
} as const;

export default async function TermsPage({
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
      primaryHref={`${prefix}/tools`}
      primaryLabel={t.primaryLabel}
      secondaryHref={`${prefix}/contact`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
