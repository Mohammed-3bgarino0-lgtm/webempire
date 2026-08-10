import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "من نحن",
    description: "تعرف على إمبراطورية الويب، طريقة بناء الأدوات، وما الذي نلتزم به عند نشر المحتوى والنتائج.",
    intro:
      "إمبراطورية الويب منصة أدوات رقمية متعددة اللغات تساعد الأفراد وأصحاب الأعمال على إنجاز حسابات ومهام إنتاجية متكررة من مكان واحد، مع شرح واضح لما تفعله الأداة وكيف يمكن مراجعة نتيجتها.",
    updatedAt: "آخر تحديث: 10 أغسطس 2026",
    primaryLabel: "استكشف الأدوات",
    secondaryLabel: "السياسة التحريرية",
    sections: [
      {
        title: "ماذا تقدم إمبراطورية الويب؟",
        paragraphs: [
          "تجمع المنصة أدوات حسابية، تحويلات، أدوات نصية وذكاء اصطناعي ووسائط في واجهة واحدة. الهدف هو تقليل الخطوات اليدوية مع إبقاء المدخلات والنتيجة وطريقة الاستخدام مفهومة للمستخدم.",
        ],
      },
      {
        title: "كيف نبني الأدوات؟",
        items: [
          "نحدد الغرض من الأداة والمدخلات التي يحتاجها المستخدم قبل بناء الواجهة.",
          "الأدوات الحسابية تعتمد على منطق أو معادلات محددة وتعرض الحقول المطلوبة بوضوح.",
          "الأدوات الذكية توضّح أنها تعتمد على معالجة آلية وقد تختلف مخرجاتها بحسب المدخلات والسياق.",
          "نراجع تجربة الاستخدام على الهاتف والكمبيوتر ونحاول تقليل الحقول غير الضرورية.",
          "نضيف شروحات للتحقق من النتيجة بدل الاكتفاء بعرض مخرج بلا سياق.",
        ],
      },
      {
        title: "من يكتب المحتوى؟",
        paragraphs: [
          "يُنشر المحتوى باسم فريق إمبراطورية الويب عندما يكون دليلًا عامًا أعده فريق المنصة. المقالات والإرشادات التي تتضمن أرقامًا أو قواعد قابلة للتغير يجب أن تُراجع قبل النشر، مع تجنب اختلاق دراسات أو نسب أو نتائج لا نستطيع توثيقها.",
        ],
      },
      {
        title: "حدود الأدوات",
        paragraphs: [
          "الأداة تساعد في الحساب أو التنظيم أو إنشاء مسودة، لكنها لا تستبدل الوثيقة الرسمية أو رأي المختص عندما يكون القرار طبيًا أو قانونيًا أو ضريبيًا أو ماليًا عالي الأثر. دقة المخرجات تعتمد أيضًا على صحة المدخلات التي يقدمها المستخدم.",
        ],
      },
      {
        title: "الإعلانات والاستدامة",
        paragraphs: [
          "قد تعرض بعض الصفحات إعلانات للمستخدمين المؤهلين لذلك. الإعلانات منفصلة عن منطق الأدوات والمحتوى التحريري، ولا نكتب نتائج الأدوات أو المقالات لخدمة معلن بعينه.",
        ],
      },
      {
        title: "التواصل والتصحيح",
        paragraphs: [
          "إذا وجدت خطأ في أداة أو شرح، أرسل رابط الصفحة ووصف المشكلة عبر صفحة التواصل. نراجع البلاغات القابلة لإعادة الإنتاج ونحدث المحتوى أو الأداة عند الحاجة.",
        ],
      },
    ],
  },
  en: {
    title: "About Web Empire",
    description: "Learn how Web Empire builds tools, publishes guidance, and reviews the information shown around tool results.",
    intro:
      "Web Empire is a multilingual digital-tools platform for recurring calculations and productivity tasks. We aim to make the input, output, and verification steps understandable instead of presenting unexplained results.",
    updatedAt: "Last updated: August 10, 2026",
    primaryLabel: "Explore tools",
    secondaryLabel: "Editorial policy",
    sections: [
      {
        title: "What Web Empire provides",
        paragraphs: [
          "The platform brings calculators, converters, text utilities, AI-assisted tools, and media workflows into one interface. The goal is to reduce repetitive manual steps while keeping the purpose and limitations of each tool visible.",
        ],
      },
      {
        title: "How we build tools",
        items: [
          "We define the user goal and required inputs before designing the interface.",
          "Formula tools use explicit calculation logic and expose the fields needed for the calculation.",
          "AI-assisted tools are identified as automated and their outputs can vary with input and context.",
          "We review desktop and mobile usability and try to remove fields that do not help the task.",
          "We add result-checking guidance so users can validate important outputs independently.",
        ],
      },
      {
        title: "Who writes the content",
        paragraphs: [
          "General guides are published under the Web Empire team name when prepared by the platform team. Content involving changeable rates, rules, or figures should be reviewed before publication, and we avoid invented studies, percentages, or claims that cannot be supported.",
        ],
      },
      {
        title: "Limits of the tools",
        paragraphs: [
          "A tool can support a calculation, workflow, or draft, but it does not replace an official document or a qualified professional for high-impact medical, legal, tax, or financial decisions. Output quality also depends on the accuracy of the user's inputs.",
        ],
      },
      {
        title: "Advertising and sustainability",
        paragraphs: [
          "Some eligible users may see advertising on public pages. Advertising is separate from tool logic and editorial content, and we do not shape tool results or articles for a specific advertiser.",
        ],
      },
      {
        title: "Corrections and contact",
        paragraphs: [
          "If you find an error in a tool or guide, send the page URL and a clear description through the contact page. We review reproducible reports and update the content or tool when needed.",
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
