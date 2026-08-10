import type { LocalizedToolRecord, ToolInputField } from "@/domain/types";

type ToolFaq = { question: string; answer: string };

export type ToolEditorialContent = {
  overviewTitle: string;
  overview: string;
  inputsTitle: string;
  inputsIntro: string;
  inputItems: string[];
  methodTitle: string;
  method: string[];
  exampleTitle: string;
  example: string;
  validationTitle: string;
  validation: string[];
  faqTitle: string;
  faq: ToolFaq[];
  disclaimer: string;
};

const priorityPatterns = [
  "vat",
  "tax",
  "ضريبة",
  "discount",
  "خصم",
  "margin",
  "هامش",
  "roi",
  "عائد",
  "percentage",
  "percent",
  "نسبة",
  "bmi",
  "كتلة",
  "gpa",
  "معدل",
  "loan",
  "قرض",
  "zakat",
  "زكاة",
  "gosi",
  "تأمينات",
  "convert",
  "converter",
  "تحويل",
  "millimeter",
  "inch",
];

function searchable(tool: LocalizedToolRecord) {
  return `${tool.slug} ${tool.title} ${tool.seoTitle}`.toLowerCase();
}

export function isEditoriallyIndexableTool(tool: LocalizedToolRecord) {
  if (tool.engine_type !== "formula") return false;
  const text = searchable(tool);
  const hasPriorityTopic = priorityPatterns.some((pattern) => text.includes(pattern));
  const fieldCount = tool.localizedInputSchema.fields.length;
  return (
    hasPriorityTopic &&
    fieldCount >= 1 &&
    fieldCount <= 10 &&
    tool.localizedDescription.trim().length >= 35
  );
}

function fieldDescription(field: ToolInputField, isArabic: boolean) {
  const details: string[] = [];
  if (field.required) details.push(isArabic ? "حقل مطلوب" : "required");
  if (typeof field.min === "number") {
    details.push(isArabic ? `الحد الأدنى ${field.min}` : `minimum ${field.min}`);
  }
  if (typeof field.max === "number") {
    details.push(isArabic ? `الحد الأعلى ${field.max}` : `maximum ${field.max}`);
  }
  if (field.options?.length) {
    const options = field.options.slice(0, 5).map((option) => option.label).join("، ");
    details.push(isArabic ? `الخيارات: ${options}` : `options: ${options}`);
  }
  if (field.helpText?.trim()) details.push(field.helpText.trim());

  if (!details.length) {
    return isArabic
      ? `${field.label}: أدخل القيمة المطلوبة كما هي موضحة في نموذج الأداة.`
      : `${field.label}: enter the value requested by the calculator.`;
  }

  return `${field.label}: ${details.join(isArabic ? "، " : ", ")}.`;
}

function specializedCopy(tool: LocalizedToolRecord, isArabic: boolean) {
  const text = searchable(tool);

  if (text.includes("margin") || text.includes("هامش")) {
    return isArabic
      ? {
          method: [
            "هامش الربح يقيس نسبة الربح من الإيراد: اطرح التكلفة من الإيراد، ثم اقسم الربح على الإيراد واضرب الناتج في 100.",
            "لا تخلط بين هامش الربح ونسبة الزيادة على التكلفة (Markup)؛ كلاهما يستخدم مقامًا مختلفًا.",
          ],
          example: "مثال: إذا كان الإيراد 500 والتكلفة 350 فالربح 150، وهامش الربح = 150 ÷ 500 × 100 = 30%.",
        }
      : {
          method: [
            "Profit margin measures profit as a share of revenue: subtract cost from revenue, divide profit by revenue, then multiply by 100.",
            "Do not confuse margin with markup; markup uses cost as the denominator instead of revenue.",
          ],
          example: "Example: revenue 500 and cost 350 gives profit 150, so margin = 150 ÷ 500 × 100 = 30%.",
        };
  }

  if (text.includes("roi") || text.includes("عائد")) {
    return isArabic
      ? {
          method: [
            "العائد على الاستثمار يقارن صافي العائد بتكلفة الاستثمار: (العائد - التكلفة) ÷ التكلفة × 100.",
            "استخدم نفس الفترة الزمنية ونفس تعريف التكلفة والعائد عند المقارنة بين بديلين.",
          ],
          example: "مثال: تكلفة استثمار 500 وعائد نهائي 650 يعني صافي عائد 150، وبالتالي ROI = 30%.",
        }
      : {
          method: [
            "Return on investment compares net return with investment cost: (return - cost) ÷ cost × 100.",
            "Use the same time period and the same definition of cost and return when comparing alternatives.",
          ],
          example: "Example: an investment cost of 500 and a final return of 650 produces a net gain of 150, so ROI = 30%.",
        };
  }

  if (text.includes("discount") || text.includes("خصم")) {
    return isArabic
      ? {
          method: [
            "قيمة الخصم = السعر الأصلي × نسبة الخصم ÷ 100، والسعر بعد الخصم = السعر الأصلي - قيمة الخصم.",
            "إذا وُجدت ضريبة أو رسوم بعد الخصم، احسبها في خطوة منفصلة حتى لا تختلط قاعدة الحساب.",
          ],
          example: "مثال: سعر 200 وخصم 25% يعني خصمًا قدره 50، والسعر بعد الخصم 150.",
        }
      : {
          method: [
            "Discount amount = original price × discount rate ÷ 100; final price = original price - discount amount.",
            "If tax or fees apply after the discount, calculate them as a separate step so the basis stays clear.",
          ],
          example: "Example: a price of 200 with a 25% discount gives a discount of 50 and a final price of 150.",
        };
  }

  if (text.includes("vat") || text.includes("tax") || text.includes("ضريبة")) {
    return isArabic
      ? {
          method: [
            "لحساب الضريبة على سعر غير شامل: قيمة الضريبة = السعر الأساسي × نسبة الضريبة ÷ 100، ثم أضفها إلى السعر الأساسي.",
            "ولفصل الضريبة من سعر شامل، استخدم النسبة نفسها التي بُني عليها السعر وتأكد من اختيار وضع الحساب الصحيح داخل الأداة.",
          ],
          example: "مثال تعليمي: سعر أساسي 100 ونسبة ضريبة 10% ينتج ضريبة 10 وإجمالي 110.",
        }
      : {
          method: [
            "For a tax-exclusive amount: tax = base amount × tax rate ÷ 100, then add it to the base amount.",
            "To extract tax from a tax-inclusive amount, use the same rate the total was based on and select the correct calculation mode.",
          ],
          example: "Teaching example: a base amount of 100 with a 10% tax rate gives tax of 10 and a total of 110.",
        };
  }

  if (text.includes("percentage") || text.includes("percent") || text.includes("نسبة")) {
    return isArabic
      ? {
          method: [
            "عند حساب نسبة من قيمة: القيمة × النسبة ÷ 100. وعند إيجاد نسبة جزء من كل: الجزء ÷ الكل × 100.",
            "حدد نوع السؤال أولًا لأن عبارة «النسبة المئوية» قد تعني أكثر من عملية حسابية.",
          ],
          example: "مثال: 15% من 240 = 240 × 15 ÷ 100 = 36.",
        }
      : {
          method: [
            "To calculate a percentage of a value: value × percentage ÷ 100. To find what percentage a part is of a whole: part ÷ whole × 100.",
            "Identify the question type first because “percentage” can describe several different calculations.",
          ],
          example: "Example: 15% of 240 = 240 × 15 ÷ 100 = 36.",
        };
  }

  if (text.includes("bmi") || text.includes("كتلة")) {
    return isArabic
      ? {
          method: [
            "مؤشر كتلة الجسم = الوزن بالكيلوغرام ÷ مربع الطول بالمتر.",
            "المؤشر قيمة حسابية عامة ولا يقدّم تشخيصًا طبيًا؛ تفسير النتيجة يعتمد على العمر والحالة الصحية والسياق الفردي.",
          ],
          example: "مثال حسابي فقط: وزن 72 كجم وطول 1.80 م يعطي 72 ÷ (1.80 × 1.80) ≈ 22.2.",
        }
      : {
          method: [
            "BMI = weight in kilograms ÷ height in metres squared.",
            "BMI is a general numerical measure, not a diagnosis; interpretation depends on age, health status, and individual context.",
          ],
          example: "Calculation example only: 72 kg and 1.80 m gives 72 ÷ (1.80 × 1.80) ≈ 22.2.",
        };
  }

  if (text.includes("convert") || text.includes("converter") || text.includes("تحويل") || text.includes("millimeter") || text.includes("inch")) {
    return isArabic
      ? {
          method: [
            "التحويل الصحيح يعتمد على معامل التحويل بين وحدتي الإدخال والإخراج. احتفظ بدقة كافية أثناء الحساب ثم قرّب النتيجة في النهاية فقط.",
            "تحقق من اتجاه التحويل قبل التنفيذ؛ التحويل من A إلى B ليس هو العملية نفسها عند الرجوع من B إلى A إلا باستخدام المعامل العكسي.",
          ],
          example: "مثال مرجعي: 25.4 مليمتر تساوي 1 بوصة. في التحويلات الأخرى استخدم الوحدات الظاهرة داخل الأداة.",
        }
      : {
          method: [
            "A correct conversion uses the conversion factor between the input and output units. Keep adequate precision during the calculation and round only at the end.",
            "Check the conversion direction before running it; converting A to B requires the reciprocal factor when reversing B to A.",
          ],
          example: "Reference example: 25.4 millimetres equals 1 inch. For other conversions, use the units shown by the tool.",
        };
  }

  if (text.includes("gpa") || text.includes("معدل")) {
    return isArabic
      ? {
          method: [
            "حساب المعدل يعتمد على سلم الدرجات والأوزان أو الساعات المعتمدة التي تدخلها. لا تفترض أن كل الأنظمة تستخدم السلم نفسه.",
            "قبل مقارنة نتيجتين تأكد أن كليهما يستخدم السلم نفسه وأن الساعات أو الأوزان أُدخلت بالطريقة ذاتها.",
          ],
          example: "مثال منهجي: أدخل درجة كل مقرر ووزنه أو ساعاته كما يطلب النموذج، ثم راجع مجموع الأوزان قبل اعتماد المعدل.",
        }
      : {
          method: [
            "GPA calculation depends on the grading scale and the weights or credit hours you enter. Do not assume every institution uses the same scale.",
            "Before comparing two results, confirm they use the same scale and that credits or weights were entered consistently.",
          ],
          example: "Method example: enter each course grade and its weight or credit hours as requested, then verify the total credits before relying on the GPA.",
        };
  }

  return isArabic
    ? {
        method: [
          `تعتمد ${tool.title} على المدخلات الظاهرة في النموذج وتطبّق عليها منطق الأداة مباشرة. اقرأ أسماء الحقول ووحداتها قبل التشغيل ولا تستخدم قيمة تقديرية إذا كانت النتيجة ستؤثر في قرار مهم.`,
          "إذا كانت النتيجة غير متوقعة، غيّر مدخلًا واحدًا في كل مرة. بهذه الطريقة تستطيع معرفة أي قيمة أثرت في الناتج بدل إعادة الحساب عشوائيًا.",
        ],
        example: "ابدأ بحالة بسيطة تعرف نتيجتها أو يمكنك التحقق منها يدويًا، ثم استخدم نفس الخطوات على حالتك الفعلية.",
      }
    : {
        method: [
          `${tool.title} uses the inputs shown in the form and applies the tool logic directly. Read field names and units before running it, and avoid estimates when the result will support an important decision.`,
          "If a result looks unexpected, change one input at a time. This makes it easier to identify which value affected the output instead of recalculating blindly.",
        ],
        example: "Start with a simple case whose result you already know or can verify manually, then apply the same steps to your real case.",
      };
}

export function getToolEditorialContent(tool: LocalizedToolRecord): ToolEditorialContent {
  const isArabic = tool.locale === "ar";
  const specialized = specializedCopy(tool, isArabic);
  const fields = tool.localizedInputSchema.fields;
  const inputItems = fields.length
    ? fields.map((field) => fieldDescription(field, isArabic))
    : [
        isArabic
          ? "لا تحتاج هذه الأداة إلى حقول يدوية ثابتة؛ اتبع التعليمات داخل مساحة التشغيل."
          : "This tool does not use a fixed set of manual fields; follow the instructions inside the workbench.",
      ];

  if (isArabic) {
    return {
      overviewTitle: `ما الذي تحسبه ${tool.title}؟`,
      overview: `${tool.localizedDescription} صُممت الصفحة لتوضيح المدخلات وطريقة التحقق من النتيجة، وليس فقط لإظهار رقم نهائي دون سياق.`,
      inputsTitle: "المدخلات ومعنى كل حقل",
      inputsIntro: "راجع هذه البيانات قبل الضغط على زر الحساب. أسماء الحقول مأخوذة من نموذج الأداة نفسه حتى يكون الشرح مرتبطًا بما ستستخدمه فعليًا.",
      inputItems,
      methodTitle: "طريقة الحساب والمنهج",
      method: specialized.method,
      exampleTitle: "مثال قابل للتحقق",
      example: specialized.example,
      validationTitle: "كيف تراجع النتيجة؟",
      validation: [
        "تأكد أن الوحدات والفترة الزمنية والنسب هي نفسها التي تقصدها في المسألة الأصلية.",
        "اختبر قيمة سهلة أو حالة حدية تستطيع حسابها يدويًا، ثم قارنها بنتيجة الأداة.",
        "إذا كانت النتيجة ستدخل في قرار مالي أو صحي أو نظامي، استخدمها كأداة مساعدة وراجع المصدر أو المختص المناسب قبل الاعتماد النهائي.",
      ],
      faqTitle: "أسئلة شائعة",
      faq: [
        {
          question: `هل ${tool.title} مجانية؟`,
          answer:
            tool.pricing_mode === "free"
              ? "نعم، الأداة مصنفة حاليًا كأداة مجانية داخل إمبراطورية الويب."
              : "قد تتطلب الأداة نقاطًا حسب نوع التشغيل. يظهر السعر أو الحد الأدنى بوضوح أعلى نموذج الأداة قبل التشغيل.",
        },
        {
          question: "لماذا قد تختلف النتيجة عن حساب آخر؟",
          answer: "الاختلاف غالبًا يأتي من الوحدات أو التقريب أو طريقة تعريف المدخلات. قارن القيم المستخدمة خطوة بخطوة قبل افتراض وجود خطأ.",
        },
        {
          question: "هل تحفظ الأداة النتيجة كمرجع رسمي؟",
          answer: "النتيجة أداة مساعدة للاستخدام العملي. احتفظ بمدخلاتك ومصادرك ولا تعتبرها بديلاً عن مستند رسمي أو مراجعة مختص عندما يتطلب السياق ذلك.",
        },
      ],
      disclaimer: "محتوى الشرح تعليمي ويصف طريقة استخدام الأداة والتحقق من مخرجاتها. لا يمثل نصيحة مالية أو طبية أو قانونية أو ضريبية متخصصة.",
    };
  }

  return {
    overviewTitle: `What does ${tool.title} calculate?`,
    overview: `${tool.localizedDescription} This page explains the inputs, method, and checks around the result instead of presenting an unexplained output alone.`,
    inputsTitle: "Inputs and field meanings",
    inputsIntro: "Review these values before running the tool. The labels below come from the actual form so the guidance matches what you will use on this page.",
    inputItems,
    methodTitle: "Calculation method",
    method: specialized.method,
    exampleTitle: "Checkable example",
    example: specialized.example,
    validationTitle: "How to validate the result",
    validation: [
      "Confirm the units, time period, and rates match the original problem you are trying to solve.",
      "Test a simple value or boundary case you can calculate manually and compare it with the tool output.",
      "For financial, health, tax, or regulatory decisions, use the result as supporting information and verify it against the appropriate source or professional.",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: `Is ${tool.title} free?`,
        answer:
          tool.pricing_mode === "free"
            ? "Yes. This tool is currently classified as free in Web Empire."
            : "This tool may use credits depending on the run type. The price or minimum credit cost is shown above the form before you run it.",
      },
      {
        question: "Why can the result differ from another calculator?",
        answer: "Differences usually come from units, rounding, or how an input is defined. Compare the values and assumptions step by step before concluding that one result is wrong.",
      },
      {
        question: "Is the result an official record?",
        answer: "No. The result is a practical aid. Keep your inputs and source data, and use an official document or qualified professional when the context requires one.",
      },
    ],
    disclaimer: "This explanatory content is educational and describes how to use and verify the tool. It is not specialized financial, medical, legal, or tax advice.",
  };
}
