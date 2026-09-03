import type { LocalizedToolRecord } from "@/domain/types";
import {
  getToolEditorialContent,
  type ToolEditorialContent,
} from "@/lib/tool-editorial-content";
import { getReviewedToolEditorialOverride } from "@/lib/reviewed-tool-editorial";

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
  const reviewedOverride = getReviewedToolEditorialOverride(tool);
  if (reviewedOverride) {
    return { ...base, ...reviewedOverride };
  }

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

  if (text.includes("home-") || text.includes("appliance") || text.includes("flooring") || text.includes("watering") || text.includes("air-conditioner")) {
    if (text.includes("energy") || text.includes("electricity") || text.includes("appliance") || text.includes("air-conditioner") || text.includes("insulation")) {
      return isArabic
        ? withSpecializedMethod(
            base,
            [
              "في أدوات استهلاك المنزل، حافظ على اتساق الوحدة والزمن: القدرة بالكيلوواط، مدة التشغيل بالساعات، والتكلفة لكل كيلوواط ساعة. الاستهلاك = القدرة × زمن التشغيل، ثم تضرب النتيجة في سعر الوحدة عند حساب التكلفة.",
              "النتيجة تقديرية لأن التشغيل الفعلي قد يختلف عن القدرة الاسمية، خصوصًا للمكيفات والأجهزة التي تعمل على دورات. استخدم متوسط تشغيل واقعي بدل افتراض أن الجهاز يعمل بأقصى قدرة طوال الوقت.",
            ],
            "مثال: جهاز قدرته 1.5 كيلوواط يعمل 4 ساعات يوميًا يستهلك نحو 6 ك.و.س يوميًا. على 30 يومًا يصبح الاستهلاك 180 ك.و.س قبل تطبيق سعر الكهرباء المستخدم في الأداة.",
            "استخدم تعرفة وفترة تشغيل تناسب حالتك؛ الفاتورة الفعلية قد تتأثر بشرائح التسعير والضرائب وأجهزة أخرى.",
          )
        : withSpecializedMethod(
            base,
            [
              "For household energy tools, keep units and time periods aligned: power in kilowatts, runtime in hours, and price per kilowatt-hour. Energy use is power × runtime, and cost applies the selected unit price to that consumption.",
              "The result is an estimate because real appliances may cycle below their nameplate rating. Air conditioners and thermostatically controlled devices especially should use realistic average runtime rather than full-power operation all day.",
            ],
            "Example: a 1.5 kW appliance running 4 hours per day uses about 6 kWh daily, or 180 kWh over 30 days before applying the electricity price entered in the calculator.",
            "Use a tariff and runtime appropriate to your situation; actual bills can include tiered pricing, taxes, and other loads.",
          );
    }

    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "في أدوات ميزانية المنزل أو التجديد، وحّد المساحة أو عدد الغرف أو الزيارات مع تكلفة الوحدة نفسها. تكلفة المتر لا تُقارن مباشرة بتكلفة الغرفة، كما أن احتياطي التجديد يضاف فوق التكلفة الأساسية ولا يستبدلها.",
            "دوّن ما الذي تتضمنه تكلفة الوحدة: مواد فقط، عمالة فقط، أم كليهما. اختلاف نطاق العمل هو أكثر أسباب الفروقات بين التقدير والحساب النهائي.",
          ],
          "مثال: إذا كانت مساحة التجديد 80 م² وتكلفة التنفيذ 450 للوحدة، فالتقدير الأساسي 36,000. إذا أضفت احتياطًا 10% يصبح الاحتياطي 3,600 والإجمالي 39,600.",
          "الحساب أداة تخطيط أولي؛ عروض الموردين والمقاسات الفعلية والهدر قد تغير التكلفة النهائية.",
        )
      : withSpecializedMethod(
          base,
          [
            "For home budgeting and renovation tools, match the quantity to the same unit used by the rate: square metres, rooms, visits, or another unit. A cost per square metre is not interchangeable with a cost per room, and a contingency is added to the base estimate rather than replacing it.",
            "Record what the unit rate includes—materials, labour, or both. Scope differences are a common reason a quick estimate differs from contractor pricing.",
          ],
          "Example: 80 m² at 450 per m² gives a base estimate of 36,000. A 10% contingency adds 3,600, producing a planning total of 39,600.",
          "This is a planning estimate; supplier quotes, measured dimensions, labour conditions, and waste can change final cost.",
        );
  }

  if (text.includes("photo") || text.includes("photography") || text.includes("camera") || text.includes("timelapse") || text.includes("aspect-ratio")) {
    if (text.includes("aspect-ratio") || text.includes("dpi") || text.includes("megapixel") || text.includes("storage") || text.includes("gallery")) {
      return isArabic
        ? withSpecializedMethod(
            base,
            [
              "في حسابات الصور، افصل بين أبعاد البكسل، نسبة الأبعاد، ودقة الطباعة. نسبة الأبعاد تحفظ العلاقة بين العرض والارتفاع، بينما DPI يربط عدد البكسلات بالحجم المطبوع ولا يغيّر عدد البكسلات الموجود في الملف.",
              "تقدير التخزين يعتمد على متوسط حجم الملف وعدد الصور والنسخ الاحتياطية. ملفات RAW تختلف كثيرًا عن JPEG، لذلك استخدم متوسطًا من ملفاتك الحقيقية إن أمكن.",
            ],
            "مثال: صورة بعرض 6000 بكسل ونسبة 3:2 يكون ارتفاعها 4000 بكسل. وإذا كان متوسط الملف 24 MB وعدد الصور 500، فنسخة واحدة تحتاج قرابة 12,000 MB قبل احتساب النسخ الاحتياطية.",
            "حجم الملف وجودة الطباعة الفعلية يعتمدان على الضغط ونوع الملف والطابعة وطريقة المعالجة.",
          )
        : withSpecializedMethod(
            base,
            [
              "Photography calculations should distinguish pixel dimensions, aspect ratio, and print density. Aspect ratio preserves the width-to-height relationship, while DPI maps pixels to physical print size and does not create additional source pixels.",
              "Storage estimates depend on average file size, image count, and backup copies. RAW files can differ substantially from JPEG, so a sample from your own workflow gives the best estimate.",
            ],
            "Example: a 6000-pixel-wide image at a 3:2 aspect ratio is 4000 pixels high. At an average 24 MB per file, 500 images require about 12,000 MB for one copy before backups.",
            "Actual file size and print quality depend on compression, format, printer, and processing workflow.",
          );
    }

    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "في تسعير التصوير، افصل إيراد الجلسة عن تكاليف التنفيذ والتحرير والطباعة والسفر. الربح = الإيراد ناقص التكاليف ذات الصلة، بينما معدل الحجز أو التسليم يقيس نسبة وليس مبلغًا نقديًا.",
            "استخدم نفس الفترة عند مقارنة الجلسات أو الساعات أو الصور المسلّمة، ولا تخلط بين عدد الصور الملتقطة وعدد الصور النهائية التي تُسلّم للعميل.",
          ],
          "مثال: جلسة بإيراد 1,200 وتكاليف مباشرة 350 وتحرير 250 تعطي ربحًا حسابيًا 600 قبل المصاريف العامة. وإذا سُلّمت 60 صورة فالإيراد لكل صورة مسلّمة يساوي 20.",
          "التسعير التجاري قد يحتاج إلى احتساب المعدات والاستهلاك والضرائب والمصاريف العامة إضافة إلى التكاليف المباشرة.",
        )
      : withSpecializedMethod(
          base,
          [
            "For photography pricing, separate session revenue from shooting, editing, printing, and travel costs. Profit is revenue minus the relevant costs, while booking or delivery rates are percentages rather than currency amounts.",
            "Keep time periods and units consistent when comparing sessions, hours, or delivered images, and distinguish captured frames from final client deliverables.",
          ],
          "Example: a session with 1,200 revenue, 350 direct shooting cost, and 250 editing cost leaves 600 before overhead. If 60 final photos are delivered, revenue per delivered photo is 20.",
          "Commercial pricing may also need equipment depreciation, taxes, insurance, and overhead beyond direct project costs.",
        );
  }

  if (text.includes("sustainability") || text.includes("carbon") || text.includes("emission") || text.includes("recycling") || text.includes("solar") || text.includes("compost")) {
    if (text.includes("carbon") || text.includes("emission")) {
      return isArabic
        ? withSpecializedMethod(
            base,
            [
              "حساب الانبعاثات يحتاج إلى نشاط قابل للقياس وعامل انبعاث مناسب له. الصيغة العامة هي كمية النشاط × عامل الانبعاث، مع توحيد الوحدات قبل الضرب.",
              "عامل الانبعاث ليس ثابتًا عالميًا؛ يختلف حسب مصدر الكهرباء أو الوقود والمنطقة والفترة. إذا كانت الأداة تطلب العامل، استخدم قيمة من المصدر الذي تعتمد عليه في تقريرك.",
            ],
            "مثال حسابي: استهلاك 1,000 وحدة نشاط مع عامل 0.45 كجم مكافئ CO₂ لكل وحدة يعطي 450 كجم مكافئ CO₂. المثال يوضح العملية فقط ولا يحدد عاملًا رسميًا.",
            "النتيجة تتغير مباشرة مع عامل الانبعاث وحدود القياس؛ استخدم عوامل موثقة ومتوافقة مع منهجية التقرير الذي تتبعه.",
          )
        : withSpecializedMethod(
            base,
            [
              "Emissions calculations need a measurable activity amount and an emission factor that matches that activity. The general relationship is activity × emission factor after converting both to compatible units.",
              "Emission factors are not universal constants; they vary by electricity mix, fuel, geography, and reporting period. When the tool asks for a factor, use the source adopted by your reporting method.",
            ],
            "Arithmetic example: 1,000 activity units at 0.45 kg CO₂e per unit gives 450 kg CO₂e. The value demonstrates the calculation and does not prescribe an official emission factor.",
            "Results depend directly on the factor and reporting boundary; use documented factors consistent with the methodology you follow.",
          );
    }

    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "مؤشرات الاستدامة مثل إعادة التدوير أو الخفض أو الوفر تعتمد على مقارنة كمية مستهدفة بإجمالي أو بخط أساس. تأكد أن البسط والمقام يغطيان الفترة والنطاق نفسيهما.",
            "عند حساب الوفر المالي أو المادي، لا تخلط بين كمية تم تجنبها وبين نسبة الانخفاض. اعرض الكمية والنسبة معًا عندما تحتاج إلى تفسير أوضح للنتيجة.",
          ],
          "مثال: إذا أُعيد تدوير 7.5 طن من أصل 10 أطنان نفايات، فمعدل إعادة التدوير = 75%. وإذا كان خط الأساس 12 طنًا وأصبح الاستهلاك 9 أطنان، فالخفض 3 أطنان أو 25%.",
          "حدد خط الأساس والفترة والنطاق بوضوح قبل مقارنة مؤشرات الاستدامة بين مواقع أو سنوات مختلفة.",
        )
      : withSpecializedMethod(
          base,
          [
            "Sustainability rates such as recycling, reduction, or savings compare a target quantity with a total or baseline. Make sure numerator and denominator describe the same period and reporting boundary.",
            "For financial or material savings, distinguish the absolute amount avoided from the percentage reduction. Showing both often makes the result easier to interpret.",
          ],
          "Example: recycling 7.5 tonnes out of 10 tonnes of waste gives a 75% recycling rate. If a 12-tonne baseline falls to 9 tonnes, the reduction is 3 tonnes or 25%.",
          "Define the baseline, period, and boundary before comparing sustainability metrics across sites or years.",
        );
  }

  if (text.includes("retail") || text.includes("basket-size") || text.includes("branch-sales") || text.includes("gross-profit-per-transaction")) {
    if (text.includes("inventory") || text.includes("stock") || text.includes("sell-through") || text.includes("shrinkage")) {
      return isArabic
        ? withSpecializedMethod(
            base,
            [
              "مقاييس المخزون تحتاج إلى تعريف واضح للمخزون الداخل والخارج خلال الفترة. معدل البيع يختلف عن دوران المخزون، ونسبة الفاقد تختلف عن قيمة المخزون المتبقي.",
              "استخدم تكلفة أو قيمة بيع واحدة بشكل متسق عند المقارنة، ولا تجمع وحدات مادية مع قيم نقدية في النسبة نفسها.",
            ],
            "مثال: إذا توفر 1,000 وحدة خلال الفترة وبيع منها 650، فمعدل البيع 65% إذا كان هذا هو تعريف المقام المستخدم. وإذا فُقدت 20 وحدة من 1,000 فمعدل الفاقد 2%.",
            "تعريفات مؤشرات المخزون قد تختلف بين الشركات؛ طبّق التعريف نفسه عند المقارنة بين الفروع أو الفترات.",
          )
        : withSpecializedMethod(
            base,
            [
              "Inventory metrics require a clear definition of stock available, sold, remaining, or lost during the measurement period. Sell-through is not the same as inventory turnover, and shrinkage rate is not the remaining inventory value.",
              "Use either cost value, retail value, or physical units consistently within a comparison rather than mixing them in one ratio.",
            ],
            "Example: if 1,000 units were available and 650 sold, sell-through is 65% under that denominator definition. If 20 of 1,000 units were lost, shrinkage is 2%.",
            "Retail organizations may define inventory KPIs differently; use the same definition when comparing stores or periods.",
          );
    }

    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "مؤشرات التجزئة تربط عادةً المبيعات أو الربح بعدد المعاملات أو الزوار أو الموظفين أو ساعات العمل. اختر المقام الذي يجيب عن السؤال التشغيلي المطلوب بدل استخدام رقم كبير لمجرد أنه متاح.",
            "في مؤشرات الخصم والهامش، افصل بين الإيراد وقيمة الخصم والتكلفة والربح. نسبة الخصم ليست هامش الربح، وزيادة المبيعات أثناء الترويج لا تعني تلقائيًا زيادة الربح.",
          ],
          "مثال: متجر حقق 50,000 من 2,000 معاملة، فيكون الإيراد لكل معاملة 25. وإذا استقبل 5,000 زائر وأتم 1,000 عملية شراء، فمعدل التحويل 20%.",
          "قارن الفروع والفترات باستخدام نفس تعريفات الإيراد والتكلفة وعدد الزوار والمعاملات.",
        )
      : withSpecializedMethod(
          base,
          [
            "Retail KPIs usually relate sales or profit to transactions, visitors, employees, or opening hours. Choose the denominator that answers the operational question rather than using a large number simply because it is available.",
            "For discount and margin metrics, separate revenue, discount value, cost, and profit. Discount rate is not profit margin, and higher promotional sales do not automatically mean higher profit.",
          ],
          "Example: a store with 50,000 revenue from 2,000 transactions averages 25 revenue per transaction. If 5,000 visitors produce 1,000 purchases, conversion is 20%.",
          "Compare stores and periods using consistent definitions for revenue, cost, visitors, and transactions.",
        );
  }

  if (text.includes("seo") || text.includes("organic") || text.includes("crawl") || text.includes("indexed-pages") || text.includes("backlink") || text.includes("keyword")) {
    if (text.includes("crawl") || text.includes("index") || text.includes("orphan") || text.includes("internal-link")) {
      return isArabic
        ? withSpecializedMethod(
            base,
            [
              "في مؤشرات الزحف والفهرسة، فرّق بين الصفحة التي اكتشفها Google، والصفحة التي زحف إليها، والصفحة التي أضافها فعليًا إلى الفهرس. هذه مراحل مختلفة ولا يجب دمج أعدادها في نسبة واحدة دون تعريف واضح.",
              "عند قياس معدل الفهرسة استخدم مجموعة URL محددة، مثل صفحات sitemap نفسها، ثم قارن عدد المفهرس بإجمالي المجموعة. الروابط الداخلية تساعد الاكتشاف لكنها لا تضمن الفهرسة وحدها.",
            ],
            "مثال: إذا كان sitemap يحتوي 500 URL وظهر 325 منها كمفهرس، فمعدل الفهرسة 65%. وإذا كان 40 URL بلا أي رابط داخلي من الموقع، فنسبة الصفحات اليتيمة 8% من المجموعة نفسها.",
            "بيانات Search Console قد تتأخر وتتغير مع إعادة الزحف؛ استخدم نفس مصدر البيانات والفترة عند المقارنة.",
          )
        : withSpecializedMethod(
            base,
            [
              "For crawl and index metrics, distinguish URLs Google discovered, URLs it crawled, and URLs it actually indexed. These are different stages and should not be combined without a defined denominator.",
              "When measuring indexation, choose a fixed URL set such as the sitemap population, then compare indexed URLs with that same total. Internal links improve discovery but do not guarantee indexing by themselves.",
            ],
            "Example: if a sitemap contains 500 URLs and 325 are indexed, the indexation rate is 65%. If 40 of those URLs have no internal links, the orphan-page rate is 8% for the same set.",
            "Search Console data can lag and change after recrawling; use the same data source and period for comparisons.",
          );
    }

    return isArabic
      ? withSpecializedMethod(
          base,
          [
            "في مؤشرات SEO المرورية، حدّد ما إذا كان القياس للنقرات أو الظهور أو الجلسات أو العملاء المحتملين أو الإيراد. CTR = النقرات ÷ مرات الظهور، بينما معدل التحويل يحتاج التحويلات ÷ الزيارات أو الجلسات وفق تعريفك.",
            "قارن الفترات المتشابهة وتحقق من تغير العلامة التجارية أو الجهاز أو البلد قبل تفسير الزيادة على أنها نتيجة تحسين SEO فقط.",
          ],
          "مثال: 12,000 ظهور و600 نقرة تعطي CTR قدره 5%. وإذا ولّدت هذه الزيارات 30 عميلاً محتملاً من 600 جلسة عضوية، فمعدل العميل المحتمل 5% باستخدام الجلسات كمقام.",
          "مؤشرات SEO وصفية ولا تثبت السببية وحدها؛ راجع تغيرات المحتوى والموسمية والقنوات الأخرى قبل الاستنتاج.",
        )
      : withSpecializedMethod(
          base,
          [
            "For SEO traffic metrics, define whether the measure is based on impressions, clicks, sessions, leads, or revenue. CTR is clicks ÷ impressions, while conversion rate uses conversions ÷ visits or sessions according to your chosen definition.",
            "Compare similar periods and check brand mix, device, country, and seasonality before attributing every change to SEO work alone.",
          ],
          "Example: 12,000 impressions and 600 clicks produce a 5% CTR. If 600 organic sessions generate 30 leads, lead rate is 5% when sessions are the denominator.",
          "SEO KPIs are descriptive and do not prove causality by themselves; review content changes, seasonality, and other channels before drawing conclusions.",
        );
  }

  return base;
}
