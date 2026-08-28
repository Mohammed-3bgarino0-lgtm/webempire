import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "من نحن",
    description: "تعرف على إمبراطورية الويب، طريقة بناء الأدوات، وما الذي نلتزم به عند نشر المحتوى والنتائج.",
    intro:
      "إمبراطورية الويب منصة أدوات رقمية متعددة اللغات تجمع حاسبات ومحولات وأدوات نصية وإنتاجية في مكان واحد، مع توضيح المدخلات وطريقة استخدام كل أداة قدر الإمكان.",
    updatedAt: "آخر تحديث: 29 أغسطس 2026",
    primaryLabel: "استكشف الأدوات",
    secondaryLabel: "السياسة التحريرية",
    sections: [
      {
        title: "ماذا تقدم إمبراطورية الويب؟",
        paragraphs: [
          "تضم المنصة حاسبات وأدوات تحويل وأدوات نصية وإنتاجية منشورة للاستخدام عبر الويب. لا ندّعي أن كل أداة تناسب كل حالة، لذلك يجب قراءة وصف الأداة ومدخلاتها ومراجعة النتيجة قبل الاعتماد عليها.",
        ],
      },
      {
        title: "كيف نبني الأدوات؟",
        items: [
          "نحدد الغرض من الأداة والمدخلات التي يحتاجها المستخدم قبل بناء الواجهة.",
          "الأدوات الحسابية تعتمد على منطق أو معادلات محددة وتعرض الحقول المطلوبة بوضوح.",
          "أدوات التحويل والنصوص تنفذ عمليات محددة يمكن وصفها للمستخدم بصورة مباشرة.",
          "نختبر الواجهة على أحجام شاشات مختلفة ونحاول تقليل الحقول غير الضرورية.",
          "نضيف شرحًا أو مثالًا عندما يساعد ذلك على فهم النتيجة أو مراجعتها.",
        ],
      },
      {
        title: "المحتوى والمراجعة",
        paragraphs: [
          "تُنشر الأدلة والشروحات باسم فريق إمبراطورية الويب. نتجنب نسب أرقام إلى دراسات أو تجارب داخلية ما لم توجد بيانات فعلية تدعمها، ونوضح عندما يكون الرقم مجرد مثال حسابي أو سيناريو توضيحي.",
        ],
      },
      {
        title: "حدود الأدوات",
        paragraphs: [
          "الأداة تساعد في الحساب أو التنظيم أو معالجة النص، لكنها لا تستبدل الوثيقة الرسمية أو رأي المختص عندما يكون القرار طبيًا أو قانونيًا أو ضريبيًا أو ماليًا عالي الأثر. دقة النتيجة تعتمد أيضًا على صحة المدخلات التي يقدمها المستخدم.",
        ],
      },
      {
        title: "الإعلانات",
        paragraphs: [
          "قد تعرض بعض الصفحات العامة إعلانات. الإعلانات منفصلة عن منطق الأدوات والمحتوى التحريري ولا تغيّر نتيجة الأداة.",
        ],
      },
      {
        title: "التواصل والتصحيح",
        paragraphs: [
          "إذا وجدت خطأ في أداة أو شرح، أرسل رابط الصفحة ووصف المشكلة عبر صفحة التواصل حتى يمكن مراجعتها وتصحيحها عند الحاجة.",
        ],
      },
    ],
  },
  en: {
    title: "About Web Empire",
    description: "Learn what Web Empire currently provides and how its tools and guidance are maintained.",
    intro:
      "Web Empire is a multilingual digital-tools platform that brings calculators, converters, text utilities, and productivity tools into one place, with practical input and usage guidance where available.",
    updatedAt: "Last updated: August 29, 2026",
    primaryLabel: "Explore tools",
    secondaryLabel: "Editorial policy",
    sections: [
      {
        title: "What Web Empire provides",
        paragraphs: [
          "The platform currently publishes calculators, converters, text utilities, and productivity tools for web use. No tool is presented as suitable for every situation, so users should read the tool description and review important results before relying on them.",
        ],
      },
      {
        title: "How tools are built",
        items: [
          "We define the purpose of a tool and its required inputs before designing the interface.",
          "Calculation tools use defined formulas or logic and expose the fields needed for the calculation.",
          "Conversion and text tools perform specific operations that can be described directly to users.",
          "We test interfaces across different screen sizes and try to remove unnecessary fields.",
          "We add an explanation or example when it improves understanding or result checking.",
        ],
      },
      {
        title: "Content and review",
        paragraphs: [
          "Guides are published under the Web Empire team name. We avoid presenting percentages, studies, or internal experiments unless supporting data actually exists, and we label illustrative numbers as examples rather than evidence.",
        ],
      },
      {
        title: "Limits of the tools",
        paragraphs: [
          "A tool can support calculations, organization, or text processing, but it does not replace an official document or qualified professional for high-impact medical, legal, tax, or financial decisions. Result quality also depends on the accuracy of user inputs.",
        ],
      },
      {
        title: "Advertising",
        paragraphs: [
          "Some public pages may display advertising. Advertising is separate from tool logic and editorial content and does not change a tool result.",
        ],
      },
      {
        title: "Corrections and contact",
        paragraphs: [
          "If you find an error in a tool or guide, send the page URL and a clear description through the contact page so it can be reviewed and corrected when necessary.",
        ],
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = locale === "ar" ? copy.ar : copy.en;
  return { title: t.title, description: t.description, alternates: { canonical: `/${locale}/about` } };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
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
      secondaryHref={`${prefix}/editorial-policy`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
