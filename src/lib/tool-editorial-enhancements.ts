import type { LocalizedToolRecord } from "@/domain/types";
import {
  getToolEditorialContent,
  type ToolEditorialContent,
} from "@/lib/tool-editorial-content";

function searchable(tool: LocalizedToolRecord) {
  return `${tool.slug} ${tool.title} ${tool.seoTitle}`.toLowerCase();
}

function withSpecializedMethod(
  base: ToolEditorialContent,
  method: string[],
  example: string,
  disclaimer?: string,
): ToolEditorialContent {
  return {
    ...base,
    method,
    example,
    disclaimer: disclaimer ?? base.disclaimer,
  };
}

export function getEnhancedToolEditorialContent(
  tool: LocalizedToolRecord,
): ToolEditorialContent {
  const base = getToolEditorialContent(tool);
  const text = searchable(tool);
  const isArabic = tool.locale === "ar";

  if (text.includes("loan") || text.includes("قرض")) {
    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "في القرض ذي الأقساط المتساوية على رصيد متناقص، تعتمد الدفعة على أصل المبلغ، ومعدل الفائدة أو الربح الدوري، وعدد الدفعات. الصيغة الشائعة للدفعة الدورية هي: P × r × (1+r)^n ÷ ((1+r)^n - 1)، حيث P أصل القرض وr المعدل الدوري وn عدد الدفعات.",
            "حوّل المعدل إلى الفترة نفسها المستخدمة للدفعات قبل الحساب. المعدل السنوي لا يُستخدم مباشرة كأنه معدل شهري، كما أن الرسوم والتأمين والدفعة المقدمة قد تجعل التكلفة الفعلية مختلفة عن القسط النظري.",
          ],
          "مثال تعليمي: أصل 12,000، ومعدل سنوي اسمي 12% مع دفعات شهرية لمدة 12 شهرًا يعني معدلًا دوريًا 1% شهريًا. باستخدام صيغة القسط المتساوي تكون الدفعة النظرية نحو 1,066.19 قبل أي رسوم أو تكاليف إضافية.",
          "الحساب تعليمي ولا يمثل عرض تمويل. تحقق من معدل النسبة السنوي والرسوم وجدول السداد وشروط الجهة الممولة قبل اتخاذ قرار مالي.",
        )
      : withSpecializedMethod(
          base,
          [
            "For a standard reducing-balance loan with equal payments, the periodic payment depends on principal, periodic rate, and number of payments. A common payment formula is P × r × (1+r)^n ÷ ((1+r)^n - 1), where P is principal, r is the periodic rate, and n is the payment count.",
            "Convert the rate to the same period as the payments before calculating. An annual rate is not a monthly rate, and fees, insurance, or down payments can make the real financing cost differ from the theoretical installment.",
          ],
          "Teaching example: principal 12,000, nominal annual rate 12%, monthly payments for 12 months gives a 1% monthly periodic rate. The equal-payment formula produces a theoretical payment of about 1,066.19 before fees or other charges.",
          "This is educational calculation guidance, not a financing offer. Verify APR, fees, payment schedule, and lender terms before making a financial decision.",
        );
  }

  if (text.includes("zakat") || text.includes("زكاة")) {
    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "ابدأ بتحديد الوعاء الذي ستطبّق عليه النسبة وفق نوع المال والحالة التي تحسبها. لا تفترض أن كل الأصول أو الالتزامات تعامل بالطريقة نفسها، ولا تستخدم نسبة ثابتة من الذاكرة إذا كان الحكم أو الوعاء محل اختلاف.",
            "إذا كانت الأداة تسمح بإدخال النسبة أو الوعاء، فراجع القيم قبل التشغيل واحتفظ بمصدرها. النصاب والحول وطريقة تقييم بعض الموجودات مسائل قد تتطلب الرجوع إلى جهة شرعية أو رسمية مناسبة لحالتك.",
          ],
          "مثال حسابي فقط: إذا كان الوعاء الذي قررت استخدامه 40,000 وأدخلت نسبة 2.5%، فالناتج الحسابي = 40,000 × 0.025 = 1,000. المثال يشرح العملية الرياضية ولا يقرر أن هذا الوعاء أو المعدل واجب في حالتك.",
          "هذه الصفحة تشرح الحساب ولا تصدر حكمًا شرعيًا أو فتوى. تحقق من الوعاء والنصاب والحول والنسبة لدى جهة موثوقة تناسب حالتك قبل الاعتماد النهائي.",
        )
      : withSpecializedMethod(
          base,
          [
            "First define the qualifying base to which you intend to apply a rate. Do not assume every asset or liability is treated the same way, and do not rely on a remembered rate when the applicable base or rule is uncertain.",
            "If the tool lets you enter the base or rate, verify those inputs and keep their source. Thresholds, holding periods, and treatment of specific assets can require guidance appropriate to your circumstances.",
          ],
          "Calculation example only: if the base you chose is 40,000 and you enter 2.5%, the arithmetic result is 40,000 × 0.025 = 1,000. This demonstrates the calculation and does not determine what is due in your case.",
          "This page explains arithmetic and is not a religious ruling. Verify the applicable base, threshold, holding period, and rate with an appropriate trusted authority before relying on the result.",
        );
  }

  if (text.includes("gosi") || text.includes("تأمينات")) {
    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "نتيجة حاسبة التأمينات تعتمد على الأجر الخاضع للاشتراك، ونوع المشترك أو الفرع التأميني، والنسب والحدود المطبقة في الفترة التي تحسبها. هذه القيم قد تتغير، لذلك لا تعتبر شرح الصفحة بديلًا عن القواعد الرسمية الحالية.",
            "إذا كانت الأداة تعرض نسبة افتراضية فراجعها قبل الاعتماد، خصوصًا عند حساب راتب فعلي أو التزام صاحب عمل. استخدم الفترة نفسها وتأكد من أن الأجر المدخل هو الوعاء الصحيح للحساب.",
          ],
          "مثال رياضي غير رسمي: إذا أدخلت وعاء اشتراك 8,000 ونسبة 10%، فالناتج الحسابي 800. النسبة هنا للتوضيح فقط وليست تصريحًا بأن 10% هي النسبة النظامية المطبقة على حالتك.",
          "نسب التأمينات والحدود والأجر الخاضع للاشتراك قد تتغير حسب النظام والفئة والفترة. راجع معلومات المؤسسة العامة للتأمينات الاجتماعية أو مختص الرواتب قبل اعتماد مبلغ فعلي.",
        )
      : withSpecializedMethod(
          base,
          [
            "A social-insurance result depends on the contributory wage base, member or coverage type, and the rates and caps applicable for the period. These inputs can change, so page guidance should not replace current official rules.",
            "If the calculator supplies a default rate, verify it before using the result for payroll or employer obligations. Use a consistent period and make sure the entered wage is the correct contribution base.",
          ],
          "Non-official arithmetic example: if you enter a contribution base of 8,000 and a rate of 10%, the calculation gives 800. The 10% figure is used only to demonstrate the math and is not a statement of the rate that applies to your case.",
          "Contribution rates, caps, and wage bases can change by rule, category, and period. Verify current GOSI information or qualified payroll guidance before relying on an actual amount.",
        );
  }

  return base;
}
