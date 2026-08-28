import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "سياسة الخصوصية",
    intro:
      "توضح هذه السياسة نوع البيانات التي تجمعها إمبراطورية الويب، وكيف نستخدمها ونحميها، والخيارات المتاحة لك عند استخدام الحساب والأدوات المجانية.",
    updatedAt: "آخر تحديث: 29 أغسطس 2026",
    primaryLabel: "تواصل معنا",
    secondaryLabel: "الشروط والأحكام",
    sections: [
      {
        title: "1. البيانات التي نجمعها",
        items: [
          "بيانات الحساب مثل الاسم والبريد الإلكتروني ومعرّف المستخدم وحالة الحساب.",
          "بيانات الاستخدام مثل الأدوات التي يتم تشغيلها، وقت التشغيل، وحالة الطلب.",
          "المحتوى الذي يرسله المستخدم إلى الأدوات لمعالجته والنتائج التي تنتج عنها عند الحاجة لتقديم الخدمة.",
          "بيانات تقنية مثل عنوان الإنترنت ونوع المتصفح والجهاز وسجلات الأمان والأخطاء.",
          "الرسائل التي ترسلها إلى الدعم أو التواصل.",
        ],
      },
      {
        title: "2. كيف نستخدم البيانات",
        items: [
          "إنشاء الحساب وتسجيل الدخول وحمايته.",
          "تشغيل الأدوات ومعالجة الطلبات وتسجيل حالة التشغيل.",
          "تقديم الدعم الفني والرد على الاستفسارات والشكاوى.",
          "تحسين الأداء وتجربة المستخدم واكتشاف الأعطال وإساءة الاستخدام.",
          "الوفاء بالالتزامات النظامية وحماية حقوق المنصة والمستخدمين.",
        ],
      },
      {
        title: "3. مزودو الخدمة",
        paragraphs: [
          "قد نعتمد على مزودي استضافة وقواعد بيانات وبريد وتحليلات ودعم لتشغيل المنصة. نشارك معهم الحد الأدنى اللازم من البيانات لتقديم الخدمة وحمايتها.",
        ],
      },
      {
        title: "4. المحتوى المرسل إلى الأدوات",
        paragraphs: [
          "نستخدم المحتوى الذي ترسله فقط لتنفيذ الأداة المطلوبة، وحماية الخدمة، ومعالجة الأخطاء عند الحاجة. يجب ألا ترفع معلومات سرية أو شخصية لا تملك حق معالجتها.",
        ],
      },
      {
        title: "5. مشاركة البيانات",
        paragraphs: [
          "لا نبيع بيانات المستخدمين. قد نشارك الحد الأدنى اللازم من البيانات مع مزودي الاستضافة وقواعد البيانات والبريد والتحليلات والدعم، أو مع الجهات المختصة عندما يوجب النظام ذلك.",
        ],
      },
      {
        title: "6. ملفات الارتباط والتحليلات",
        paragraphs: [
          "قد نستخدم ملفات ارتباط وتقنيات مشابهة لحفظ الجلسة وتفضيلات اللغة وتحسين الأداء وقياس الاستخدام. يمكن التحكم في بعض ملفات الارتباط من إعدادات المتصفح، لكن تعطيل الضروري منها قد يؤثر في تسجيل الدخول أو تشغيل المنصة.",
        ],
      },
      {
        title: "7. الاحتفاظ بالبيانات",
        paragraphs: [
          "نحتفظ بالبيانات للمدة اللازمة لتقديم الخدمة والوفاء بالالتزامات الأمنية والنظامية وتسوية النزاعات. وقد نحذف أو نخفي هوية بعض البيانات عندما لا تعود الحاجة قائمة إليها.",
        ],
      },
      {
        title: "8. حماية البيانات",
        paragraphs: [
          "نطبق إجراءات فنية وتنظيمية معقولة تشمل التحكم في الصلاحيات، وتشفير الاتصال، ومراقبة الأنشطة، والنسخ الاحتياطي. ومع ذلك لا توجد وسيلة إلكترونية تضمن الحماية المطلقة، لذلك يجب على المستخدم حماية كلمة المرور وأجهزته.",
        ],
      },
      {
        title: "9. حقوقك وخياراتك",
        items: [
          "طلب الوصول إلى بياناتك أو نسخة منها.",
          "طلب تصحيح البيانات غير الدقيقة.",
          "طلب حذف الحساب أو بعض البيانات عندما يسمح النظام بذلك.",
          "الاعتراض على بعض أوجه المعالجة أو طلب تقييدها.",
          "إيقاف الرسائل غير الضرورية.",
          "تقديم شكوى أو استفسار بشأن الخصوصية.",
        ],
      },
      {
        title: "10. نقل البيانات خارج الدولة",
        paragraphs: [
          "قد تتم معالجة بعض البيانات في دول توجد فيها شركات الاستضافة أو الخدمات التقنية. نختار مزودين موثوقين ونسعى إلى تطبيق الضمانات المناسبة وفق الأنظمة المعمول بها.",
        ],
      },
      {
        title: "11. خصوصية الأطفال",
        paragraphs: [
          "المنصة غير موجهة لمن تقل أعمارهم عن السن النظامي لإبرام العقود أو استخدام الخدمات الرقمية بصورة مستقلة. عند اكتشاف حساب غير مؤهل قد نقيده أو نحذفه.",
        ],
      },
      {
        title: "12. تحديث السياسة والتواصل",
        paragraphs: [
          "قد نحدث هذه السياسة عند تطوير الخدمة أو تغير المتطلبات. سننشر النسخة المحدثة في هذه الصفحة مع تاريخ التحديث. لطلبات الخصوصية تواصل عبر البريد: mohammed-alsakran@hotmail.com.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains what data Web Empire collects, how it is used, and the choices available to users.",
    updatedAt: "Last updated: August 29, 2026",
    primaryLabel: "Contact us",
    secondaryLabel: "Terms and conditions",
    sections: [
      {
        title: "Data we collect",
        paragraphs: [
          "We may collect account information, tool usage, submitted content, technical logs, and support communications.",
        ],
      },
      {
        title: "How we use data",
        paragraphs: [
          "We use data to operate accounts and tools, record execution status, provide support, improve security and performance, and meet legal obligations.",
        ],
      },
      {
        title: "Service providers",
        paragraphs: [
          "Web Empire may use trusted hosting, database, analytics, email, and support providers to operate and protect the service.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You may request access, correction, deletion, or restriction where applicable. Contact mohammed-alsakran@hotmail.com for privacy requests.",
        ],
      },
    ],
  },
} as const;

export default async function PrivacyPage({
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
      primaryHref={`${prefix}/contact`}
      primaryLabel={t.primaryLabel}
      secondaryHref={`${prefix}/terms`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
