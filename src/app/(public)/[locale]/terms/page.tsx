import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "الشروط والأحكام",
    intro:
      "تنظم هذه الشروط استخدام منصة إمبراطورية الويب وحساباتها وأدواتها وخطط الاشتراك والنقاط. باستخدامك للمنصة فإنك تقر بأنك قرأت هذه الشروط ووافقت عليها.",
    updatedAt: "آخر تحديث: 4 أغسطس 2026",
    primaryLabel: "عرض الأسعار",
    secondaryLabel: "تواصل معنا",
    sections: [
      {
        title: "1. التعريف بالمنصة",
        paragraphs: [
          "إمبراطورية الويب منصة برمجية تقدم أدوات رقمية وخدمات مدعومة بالذكاء الاصطناعي لمعالجة المحتوى والإنتاجية والأتمتة. قد تتغير الأدوات والخصائص المتاحة مع تطوير الخدمة.",
        ],
      },
      {
        title: "2. إنشاء الحساب والأهلية",
        items: [
          "يجب تقديم بيانات صحيحة ومحدثة عند إنشاء الحساب.",
          "أنت مسؤول عن حماية بيانات الدخول وعن جميع الأنشطة التي تتم من خلال حسابك.",
          "يجب إبلاغنا فورًا عند الاشتباه في استخدام غير مصرح به للحساب.",
          "لا يجوز إنشاء حسابات بغرض إساءة الاستخدام أو تجاوز القيود الفنية أو المالية.",
        ],
      },
      {
        title: "3. الخطط والاشتراكات والدفع",
        items: [
          "توضح صفحة الأسعار قيمة كل خطة والمزايا والنقاط الشهرية المخصصة لها.",
          "الاشتراكات المدفوعة تتجدد تلقائيًا في نهاية دورة الفوترة ما لم يتم إلغاؤها قبل موعد التجديد.",
          "قد تشمل الفاتورة ضرائب أو رسومًا واجبة بحسب بلد العميل والأنظمة المطبقة.",
          "تتم معالجة المدفوعات والفواتير بواسطة Paddle بصفتها جهة معالجة الدفع والتاجر المسجل، ولا نخزن بيانات البطاقة كاملة داخل أنظمتنا.",
          "لا يصبح الاشتراك فعالًا إلا بعد تأكيد نجاح المعاملة من مزود الدفع.",
        ],
      },
      {
        title: "4. النقاط وحدود الاستخدام",
        items: [
          "تُستخدم النقاط لتشغيل الأدوات والخدمات داخل المنصة، وتختلف التكلفة حسب الأداة وطريقة التشغيل.",
          "النقاط ليست عملة نقدية ولا يمكن تحويلها أو بيعها أو سحبها خارج المنصة.",
          "قد تنتهي النقاط أو يعاد ضبط الرصيد وفق شروط الخطة ودورة الاشتراك المبينة في صفحة الأسعار أو لوحة الحساب.",
          "أي محاولة للتلاعب بالرصيد أو إعادة استخدام طلبات الدفع أو استغلال أخطاء النظام قد تؤدي إلى تعليق الحساب.",
        ],
      },
      {
        title: "5. الاستخدام المقبول",
        items: [
          "يحظر استخدام المنصة في أي نشاط غير مشروع أو احتيالي أو ينتهك حقوق الآخرين.",
          "يحظر رفع محتوى ضار أو برمجيات خبيثة أو بيانات لا تملك حق استخدامها.",
          "يحظر محاولة اختراق المنصة أو تعطيلها أو تجاوز الحماية أو حدود الاستخدام.",
          "يبقى المستخدم مسؤولًا عن مراجعة النتائج قبل نشرها أو الاعتماد عليها مهنيًا أو قانونيًا أو ماليًا.",
        ],
      },
      {
        title: "6. مخرجات الذكاء الاصطناعي",
        paragraphs: [
          "قد تنتج الأدوات محتوى آليًا يحتمل الخطأ أو النقص. لا تمثل المخرجات استشارة قانونية أو طبية أو مالية أو مهنية، ويجب التحقق منها قبل استخدامها في القرارات المهمة.",
        ],
      },
      {
        title: "7. الملكية الفكرية",
        paragraphs: [
          "تظل العلامة التجارية والتصميم والبرمجيات والمحتوى الأصلي للمنصة مملوكة لإمبراطورية الويب أو لأصحاب التراخيص. يحتفظ المستخدم بحقوقه في المحتوى الذي يرفعه، ويمنح المنصة الإذن الفني اللازم لمعالجته وتشغيل الخدمة المطلوبة.",
        ],
      },
      {
        title: "8. الإلغاء وسياسة الاسترداد",
        items: [
          "يمكن طلب إلغاء الاشتراك، ويستمر الوصول إلى المزايا حتى نهاية الفترة المدفوعة ما لم توضح صفحة الإلغاء خلاف ذلك.",
          "يمكن تقديم طلب استرداد خلال 14 يومًا من أول عملية شراء عند عدم استخدام الرصيد أو في حال وجود خصم مكرر أو خلل تقني جوهري يمنع استخدام الخدمة.",
          "تُراجع طلبات الاسترداد بحسب حالة الاستخدام وسجل المعاملة والحقوق النظامية للعميل، وقد تتم معالجتها من خلال Paddle.",
          "لا يشمل الاسترداد عادةً النقاط أو الخدمات التي تم استهلاكها بالفعل، إلا إذا أوجب النظام المعمول به خلاف ذلك.",
          "لطلب الإلغاء أو الاسترداد تواصل عبر البريد: mohammed-alsakran@hotmail.com مع ذكر بريد الحساب ورقم المعاملة وسبب الطلب.",
        ],
      },
      {
        title: "9. توفر الخدمة والتغييرات",
        paragraphs: [
          "نسعى إلى توفير المنصة بصورة مستقرة، لكن قد تحدث صيانة أو أعطال أو تغييرات في مزودي الخدمات الخارجيين. يجوز تحديث الأدوات أو الأسعار أو الحدود مع نشر التغييرات المهمة قبل سريانها متى كان ذلك مناسبًا.",
        ],
      },
      {
        title: "10. تعليق الحساب وإنهاؤه",
        paragraphs: [
          "يجوز تعليق الحساب أو إنهاؤه عند مخالفة هذه الشروط أو إساءة الاستخدام أو وجود مخاطر أمنية أو مطالبات دفع غير مشروعة. سنحاول إشعار المستخدم متى كان ذلك ممكنًا، مع الاحتفاظ بالحقوق والالتزامات النظامية.",
        ],
      },
      {
        title: "11. المسؤولية",
        paragraphs: [
          "تقدم الخدمة بحسب حالتها المتاحة. وفي الحدود التي يسمح بها النظام، لا نتحمل الأضرار غير المباشرة الناتجة عن سوء استخدام المنصة أو الاعتماد غير المتحقق على المخرجات أو تعطل خدمات طرف ثالث.",
        ],
      },
      {
        title: "12. القانون والتواصل",
        paragraphs: [
          "تخضع هذه الشروط للأنظمة المعمول بها في المملكة العربية السعودية دون الإخلال بحقوق المستهلك الإلزامية في بلد إقامته. للاستفسارات القانونية أو المتعلقة بالفوترة تواصل عبر البريد: mohammed-alsakran@hotmail.com.",
        ],
      },
    ],
  },
  en: {
    title: "Terms and Conditions",
    intro:
      "These terms govern the use of Web Empire accounts, tools, subscriptions, and credits.",
    updatedAt: "Last updated: August 4, 2026",
    primaryLabel: "View pricing",
    secondaryLabel: "Contact us",
    sections: [
      {
        title: "Service and accounts",
        paragraphs: [
          "Web Empire provides digital and AI-powered tools. Users must provide accurate account information, protect their credentials, and use the service lawfully.",
        ],
      },
      {
        title: "Subscriptions and billing",
        paragraphs: [
          "Paid subscriptions renew automatically unless canceled. Payments and invoices are processed by Paddle. A subscription becomes active only after successful payment confirmation.",
        ],
      },
      {
        title: "Credits and acceptable use",
        paragraphs: [
          "Credits are used only inside Web Empire and have no cash value. Abuse, fraud, security attacks, or attempts to manipulate balances may result in account suspension.",
        ],
      },
      {
        title: "Cancellation and refunds",
        paragraphs: [
          "Refund requests may be submitted within 14 days of the first purchase when credits remain unused, or in cases of duplicate charging or a material technical failure. Contact mohammed-alsakran@hotmail.com with the account email and transaction reference.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "These terms are governed by the applicable laws of the Kingdom of Saudi Arabia, without limiting mandatory consumer rights. Contact: mohammed-alsakran@hotmail.com.",
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
      primaryHref={`${prefix}/pricing`}
      primaryLabel={t.primaryLabel}
      secondaryHref={`${prefix}/contact`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
