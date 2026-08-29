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
          "قد نعتمد على مزودي استضافة وقواعد بيانات وبريد وتحليلات وإعلانات ودعم لتشغيل المنصة. نشارك معهم الحد الأدنى اللازم من البيانات لتقديم الخدمة وحمايتها وفق الإعدادات والمتطلبات المطبقة.",
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
          "لا نبيع بيانات المستخدمين. قد نشارك الحد الأدنى اللازم من البيانات مع مزودي الاستضافة وقواعد البيانات والبريد والتحليلات والإعلانات والدعم، أو مع الجهات المختصة عندما يوجب النظام ذلك.",
        ],
      },
      {
        title: "6. الإعلانات وملفات تعريف الارتباط من Google",
        items: [
          "قد تستخدم جهات خارجية، بما فيها Google، ملفات تعريف الارتباط أو تقنيات مشابهة لعرض الإعلانات وقياسها عند تفعيل الإعلانات على الموقع.",
          "قد تتيح ملفات تعريف الارتباط الإعلانية لـGoogle وشركائها عرض إعلانات استنادًا إلى زيارة المستخدم لهذا الموقع أو مواقع أخرى وفق إعدادات الإعلانات والموافقة المطبقة.",
          "يمكن للمستخدم إدارة تخصيص الإعلانات أو إيقاف الإعلانات المخصصة من إعدادات الإعلانات في حساب Google عندما تكون هذه الخيارات متاحة.",
          "قد تستخدم خدمات التحليلات، ومنها Google Analytics عند تفعيلها، معرّفات وتقنيات مشابهة لقياس استخدام الموقع وتحسين الأداء.",
        ],
      },
      {
        title: "7. ملفات الارتباط والتفضيلات",
        paragraphs: [
          "قد نستخدم ملفات ارتباط وتقنيات مشابهة لحفظ الجلسة وتفضيلات اللغة وتحسين الأداء وقياس الاستخدام. يمكن التحكم في بعض ملفات الارتباط من إعدادات المتصفح، لكن تعطيل الضروري منها قد يؤثر في تسجيل الدخول أو تشغيل المنصة.",
        ],
      },
      {
        title: "8. الموافقة على الإعلانات في المناطق الخاضعة لمتطلبات خاصة",
        paragraphs: [
          "عند الحاجة نظاميًا، قد نعرض رسالة موافقة لإدارة خيارات الإعلانات وملفات الارتباط قبل استخدام تقنيات غير ضرورية. قد تختلف الخيارات المتاحة بحسب بلد المستخدم وإعدادات مزود الإعلانات.",
        ],
      },
      {
        title: "9. الاحتفاظ بالبيانات",
        paragraphs: [
          "نحتفظ بالبيانات للمدة اللازمة لتقديم الخدمة والوفاء بالالتزامات الأمنية والنظامية وتسوية النزاعات. وقد نحذف أو نخفي هوية بعض البيانات عندما لا تعود الحاجة قائمة إليها.",
        ],
      },
      {
        title: "10. حماية البيانات",
        paragraphs: [
          "نطبق إجراءات فنية وتنظيمية معقولة تشمل التحكم في الصلاحيات، وتشفير الاتصال، ومراقبة الأنشطة، والنسخ الاحتياطي. ومع ذلك لا توجد وسيلة إلكترونية تضمن الحماية المطلقة، لذلك يجب على المستخدم حماية كلمة المرور وأجهزته.",
        ],
      },
      {
        title: "11. حقوقك وخياراتك",
        items: [
          "طلب الوصول إلى بياناتك أو نسخة منها.",
          "طلب تصحيح البيانات غير الدقيقة.",
          "طلب حذف الحساب أو بعض البيانات عندما يسمح النظام بذلك.",
          "الاعتراض على بعض أوجه المعالجة أو طلب تقييدها عندما ينطبق ذلك.",
          "إيقاف الرسائل غير الضرورية.",
          "تقديم شكوى أو استفسار بشأن الخصوصية.",
        ],
      },
      {
        title: "12. نقل البيانات خارج الدولة",
        paragraphs: [
          "قد تتم معالجة بعض البيانات في دول توجد فيها شركات الاستضافة أو الخدمات التقنية. نختار مزودين موثوقين ونسعى إلى تطبيق الضمانات المناسبة وفق الأنظمة المعمول بها.",
        ],
      },
      {
        title: "13. خصوصية الأطفال",
        paragraphs: [
          "المنصة غير موجهة لمن تقل أعمارهم عن السن النظامي لإبرام العقود أو استخدام الخدمات الرقمية بصورة مستقلة. عند اكتشاف حساب غير مؤهل قد نقيده أو نحذفه.",
        ],
      },
      {
        title: "14. تحديث السياسة والتواصل",
        paragraphs: [
          "قد نحدث هذه السياسة عند تطوير الخدمة أو تغير المتطلبات. سننشر النسخة المحدثة في هذه الصفحة مع تاريخ التحديث. لطلبات الخصوصية تواصل عبر البريد: mohammed-alsakran@hotmail.com.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    intro:
      "This policy explains what data Web Empire collects, how it is used, and the choices available to users of the site and its free tools.",
    updatedAt: "Last updated: August 29, 2026",
    primaryLabel: "Contact us",
    secondaryLabel: "Terms and conditions",
    sections: [
      {
        title: "Data we collect",
        paragraphs: [
          "We may collect account information, tool usage, submitted content, technical logs, and support communications where needed to operate and protect the service.",
        ],
      },
      {
        title: "How we use data",
        paragraphs: [
          "We use data to operate accounts and tools, record execution status, provide support, improve security and performance, prevent abuse, and meet legal obligations.",
        ],
      },
      {
        title: "Service providers",
        paragraphs: [
          "Web Empire may use trusted hosting, database, analytics, email, advertising, and support providers to operate and protect the service.",
        ],
      },
      {
        title: "Google advertising cookies and analytics",
        items: [
          "Third-party vendors, including Google, may use cookies or similar technologies to serve and measure ads when advertising is enabled on the site.",
          "Google advertising cookies may allow Google and its partners to serve ads based on visits to this site and other sites, subject to applicable consent and ad settings.",
          "Users can manage ad personalization through Google Ads Settings where available.",
          "Analytics services, including Google Analytics when enabled, may use identifiers and similar technologies to measure site usage and improve performance.",
        ],
      },
      {
        title: "Consent and cookie choices",
        paragraphs: [
          "Where required, Web Empire may display a consent message before non-essential advertising or measurement technologies are used. Available choices may vary by region and provider configuration.",
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
