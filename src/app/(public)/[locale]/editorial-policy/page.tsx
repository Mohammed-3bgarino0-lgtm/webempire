import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { getLocaleByCode } from "@/localization/repository";

const copy = {
  ar: {
    title: "السياسة التحريرية",
    description: "كيف نكتب ونراجع ونحدّث شروحات الأدوات ومقالات إمبراطورية الويب.",
    intro:
      "توضح هذه السياسة كيف نقرر ما يستحق النشر، وكيف نفرق بين المحتوى التعليمي والمعلومة القابلة للتغير، وكيف نتعامل مع التصحيحات والمحتوى الذي تساعد الأدوات الآلية في إنتاجه.",
    updatedAt: "آخر تحديث: 10 أغسطس 2026",
    primaryLabel: "اقرأ المدونة",
    secondaryLabel: "من نحن",
    sections: [
      {
        title: "1. الأولوية للقيمة العملية",
        items: [
          "يجب أن يجيب المحتوى عن سؤال واضح أو يساعد المستخدم على تنفيذ مهمة حقيقية.",
          "لا ننشر صفحات متعددة تعيد الفكرة نفسها مع تغيير الكلمات فقط.",
          "نفضل عددًا أقل من الأدلة القابلة للتحقق على مكتبة كبيرة من النصوص المتشابهة.",
        ],
      },
      {
        title: "2. الأصالة وعدم اختلاق الأدلة",
        paragraphs: [
          "لا نستخدم أرقامًا منسوبة إلى دراسة أو تجربة داخلية ما لم توجد لها بيانات فعلية يمكن توثيقها. الأمثلة الحسابية يجب أن تكون قابلة لإعادة الحساب، وأي سيناريو توضيحي يُقدم بوضوح على أنه مثال لا دراسة ميدانية.",
        ],
      },
      {
        title: "3. المعلومات القابلة للتغير",
        paragraphs: [
          "الضرائب والرسوم واللوائح وأسعار الصرف والنسب الرسمية وغيرها من المعلومات المتغيرة تحتاج إلى مراجعة مصدر مناسب وتاريخ تحديث واضح قبل نشرها. عند عدم الحاجة إلى رقم حالي، نشرح المعادلة أو المنهج ونترك النسبة كمدخل للمستخدم بدل تثبيت قيمة قد تصبح قديمة.",
        ],
      },
      {
        title: "4. الشرح حول الأدوات",
        items: [
          "نشرح الغرض من الأداة والمدخلات التي تظهر في نموذجها الفعلي.",
          "نوضح المنهج أو المعادلة عندما تكون قابلة للشرح دون كشف أسرار تشغيلية أو أمنية.",
          "نضيف مثالًا قابلًا للتحقق عندما يكون ذلك مفيدًا.",
          "نوضح القيود والطريقة المناسبة لمراجعة النتيجة.",
          "الصفحات غير المكتملة أو شديدة العمومية قد تُستبعد من الفهرسة إلى أن تحصل على مراجعة تحريرية كافية.",
        ],
      },
      {
        title: "5. استخدام الذكاء الاصطناعي",
        paragraphs: [
          "قد نستخدم أدوات آلية للمساعدة في البحث الداخلي أو الصياغة أو التلخيص، لكن ذلك لا يعفي المحتوى من المراجعة. لا نعتبر النص الآلي مصدرًا بحد ذاته، ولا ننشر ادعاءات واقعية لمجرد أن نموذجًا لغويًا أنشأها.",
        ],
      },
      {
        title: "6. التصحيحات والتحديثات",
        paragraphs: [
          "عند اكتشاف خطأ مؤثر نصححه في الصفحة نفسها، ونحدّث تاريخ المراجعة عندما يكون التغيير جوهريًا. البلاغات التي تصل عبر صفحة التواصل تُراجع بحسب وضوحها وإمكانية إعادة المشكلة.",
        ],
      },
      {
        title: "7. الفصل بين التحرير والإعلانات",
        paragraphs: [
          "وجود إعلان على صفحة عامة لا يحدد نتيجة الأداة ولا ترتيب النصائح التحريرية. لا نقبل أن يكون الإعلان سببًا لإخفاء قيد مهم أو لتغيير مثال حسابي أو نتيجة أداة.",
        ],
      },
      {
        title: "8. الموضوعات عالية الأثر",
        paragraphs: [
          "المحتوى الطبي والقانوني والضريبي والمالي عالي الأثر يُقدَّم للتثقيف والمساعدة على الفهم فقط. عندما يتطلب القرار تشخيصًا أو التزامًا نظاميًا أو استشارة مهنية، يجب الرجوع إلى المصدر الرسمي أو المختص المناسب.",
        ],
      },
    ],
  },
  en: {
    title: "Editorial Policy",
    description: "How Web Empire writes, reviews, updates, and corrects tool guidance and editorial content.",
    intro:
      "This policy explains what we consider publishable value, how we handle changeable facts, how we review tool guidance, and how automated assistance can be used without turning generated text into an unsupported source.",
    updatedAt: "Last updated: August 10, 2026",
    primaryLabel: "Read the blog",
    secondaryLabel: "About Web Empire",
    sections: [
      {
        title: "1. Practical value comes first",
        items: [
          "Content should answer a clear question or help a user complete a real task.",
          "We do not aim to publish many pages that repeat the same idea with different wording.",
          "A smaller set of verifiable guides is preferred over a large library of near-duplicate text.",
        ],
      },
      {
        title: "2. Originality and evidence",
        paragraphs: [
          "We do not present percentages, studies, or internal experiments unless real supporting data exists. Calculation examples should be reproducible, and illustrative scenarios should be labeled as examples rather than implied field studies.",
        ],
      },
      {
        title: "3. Changeable information",
        paragraphs: [
          "Taxes, fees, regulations, exchange rates, official thresholds, and similar changeable facts require an appropriate source and a clear review date before publication. When a current number is not necessary, we explain the method and let the user enter the rate instead of hard-coding a value that can become outdated.",
        ],
      },
      {
        title: "4. Guidance around tools",
        items: [
          "We explain what the tool is for and the inputs shown by the actual form.",
          "We describe the method or formula when it can be explained safely and accurately.",
          "We include a checkable example when it genuinely improves understanding.",
          "We state limitations and practical ways to validate the result.",
          "Thin or generic pages may be excluded from indexing until they receive sufficient editorial review.",
        ],
      },
      {
        title: "5. Use of AI assistance",
        paragraphs: [
          "Automated tools may assist with internal research, drafting, or summarization, but the output still requires review. Generated text is not treated as a source, and factual claims are not published merely because a language model produced them.",
        ],
      },
      {
        title: "6. Corrections and updates",
        paragraphs: [
          "Material errors are corrected on the page itself, and the review date is updated when a change is significant. Reports submitted through the contact page are assessed based on clarity and whether the issue can be reproduced.",
        ],
      },
      {
        title: "7. Editorial independence from advertising",
        paragraphs: [
          "Advertising on a public page does not determine a tool result or editorial recommendation. We do not hide an important limitation or alter an example or tool output to benefit an advertiser.",
        ],
      },
      {
        title: "8. High-impact topics",
        paragraphs: [
          "Medical, legal, tax, and high-impact financial information is provided for education and understanding. Decisions requiring diagnosis, regulatory compliance, or professional judgment should be verified with the relevant official source or qualified professional.",
        ],
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = locale === "ar" ? copy.ar : copy.en;
  return { title: t.title, description: t.description, alternates: { canonical: `/${locale}/editorial-policy` } };
}

export default async function EditorialPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
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
      primaryHref={`${prefix}/blog`}
      primaryLabel={t.primaryLabel}
      secondaryHref={`${prefix}/about`}
      secondaryLabel={t.secondaryLabel}
    />
  );
}
