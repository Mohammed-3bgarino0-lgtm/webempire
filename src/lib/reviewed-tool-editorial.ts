import type { ToolEditorialContent } from "@/lib/tool-editorial-content";
import type { LocalizedToolRecord } from "@/domain/types";

type EditorialOverride = Partial<ToolEditorialContent>;
type BilingualOverride = { ar: EditorialOverride; en: EditorialOverride };

const reviewedEditorial: Record<string, BilingualOverride> = {
  "average-calculator": {
    ar: {
      overviewTitle: "ما الذي تحسبه هذه الحاسبة؟",
      overview: "تحسب هذه الأداة المتوسط الحسابي عندما تعرف مجموع القيم وعددها. وهي مفيدة عندما يكون المجموع جاهزًا لديك، مثل مجموع درجات أو مبيعات أو قراءات، ولا تحتاج إلى إدخال كل قيمة على حدة.",
      methodTitle: "المعادلة المستخدمة",
      method: [
        "المتوسط الحسابي = مجموع القيم ÷ عدد القيم.",
        "يجب أن يمثل العدد عدد العناصر التي دخلت فعلًا في المجموع. إذا تغيّر العدد أو استُبعدت قيمة من المجموع، فيجب تعديل الطرفين معًا قبل الحساب.",
      ],
      exampleTitle: "مثال محلول",
      example: "إذا كان مجموع 8 قيم يساوي 640، فالمتوسط = 640 ÷ 8 = 80. للتحقق، اضرب 80 × 8 ويجب أن تعود إلى 640.",
      validationTitle: "كيف تتحقق من النتيجة؟",
      validation: [
        "تأكد أن عدد القيم أكبر من صفر.",
        "راجع أن المجموع والعدد يعودان إلى المجموعة نفسها من البيانات.",
        "اختبر النتيجة بضرب المتوسط في عدد القيم ومقارنة الناتج بالمجموع الأصلي.",
      ],
      faqTitle: "أسئلة شائعة",
      faq: [
        { question: "هل هذه الحاسبة تحسب الوسيط؟", answer: "لا. المتوسط الحسابي يختلف عن الوسيط، الذي يحتاج إلى ترتيب القيم ومعرفة القيمة الواقعة في المنتصف." },
        { question: "هل يصلح المتوسط مع النسب المئوية؟", answer: "نعم إذا كانت النسب متساوية الوزن. إذا كانت لكل نسبة أوزان مختلفة فالأصح استخدام المتوسط المرجح." },
        { question: "ماذا يحدث إذا كان عدد القيم صفرًا؟", answer: "القسمة على صفر غير معرفة، لذلك يجب إدخال عدد أكبر من صفر." },
      ],
      disclaimer: "النتيجة حسابية فقط. اختيار المتوسط المناسب يعتمد على طبيعة البيانات وطريقة جمعها.",
    },
    en: {
      overviewTitle: "What this calculator does",
      overview: "This calculator finds the arithmetic mean when you already know the total of a group of values and how many values are in that group. It is useful for totals such as scores, sales, or measurements when entering every individual value is unnecessary.",
      methodTitle: "Formula used",
      method: [
        "Arithmetic mean = total of values ÷ number of values.",
        "The count must describe the same set of values included in the total. If a value is added or removed, update both the total and the count before calculating.",
      ],
      exampleTitle: "Worked example",
      example: "If 8 values add up to 640, the mean is 640 ÷ 8 = 80. A quick check is 80 × 8 = 640, which returns the original total.",
      validationTitle: "How to check the result",
      validation: [
        "Make sure the count is greater than zero.",
        "Confirm that the total and count refer to the same data set.",
        "Multiply the calculated mean by the count and compare it with the original total.",
      ],
      faqTitle: "Frequently asked questions",
      faq: [
        { question: "Does this calculate the median?", answer: "No. Median requires the individual values to be ordered so the middle value can be identified." },
        { question: "Can I average percentages this way?", answer: "Only when the percentages have equal weight. Use a weighted mean when their weights differ." },
        { question: "Can the count be zero?", answer: "No. Division by zero is undefined, so the count must be greater than zero." },
      ],
      disclaimer: "This is an arithmetic result. Whether the mean is the right summary depends on the structure of your data.",
    },
  },

  "cbm-calculator": {
    ar: {
      overviewTitle: "ما هو CBM؟",
      overview: "CBM اختصار للمتر المكعب، وهو مقياس للحجم يستخدم كثيرًا في الشحن والتخزين. تحسب الأداة حجم صندوق مستطيل ثم تضربه في عدد الصناديق للحصول على الحجم الإجمالي.",
      methodTitle: "طريقة حساب الحجم بالمتر المكعب",
      method: [
        "حجم الصندوق = الطول × العرض × الارتفاع بعد تحويل الأبعاد إلى أمتار.",
        "الحجم الإجمالي = حجم الصندوق الواحد × عدد الصناديق. إذا كانت الأبعاد بالسنتيمتر، اقسم كل بعد على 100 قبل الضرب.",
      ],
      exampleTitle: "مثال شحن",
      example: "صندوق أبعاده 0.60 م × 0.40 م × 0.50 م حجمه 0.12 م³. إذا كان لديك 10 صناديق متطابقة فالإجمالي = 1.20 م³.",
      validationTitle: "نقاط يجب مراجعتها",
      validation: [
        "استخدم وحدة واحدة لجميع الأبعاد قبل الضرب.",
        "أدخل الأبعاد الخارجية للصندوق إذا كان الهدف تقدير مساحة الشحن.",
        "لا تخلط بين الحجم الحجمي والوزن الحجمي؛ شركة الشحن قد تستخدم معادلة مختلفة لتسعير الوزن.",
      ],
      faqTitle: "أسئلة عن CBM",
      faq: [
        { question: "هل CBM هو الوزن الحجمي؟", answer: "لا. CBM يقيس الحجم فقط، بينما الوزن الحجمي يحول الحجم إلى وزن افتراضي وفق معامل تحدده شركة النقل." },
        { question: "كيف أحول السنتيمتر إلى متر قبل الحساب؟", answer: "اقسم كل بعد بالسنتيمتر على 100، ثم اضرب الأبعاد بالمتر." },
        { question: "هل أضيف مساحة المنصات الخشبية؟", answer: "إذا كانت المنصة جزءًا من الشحنة الفعلية فالأدق استخدام الأبعاد الخارجية للشحنة بعد التجهيز." },
      ],
      disclaimer: "الحجم الناتج هندسي. متطلبات التعبئة والتسعير والوزن الحجمي تختلف بين شركات النقل.",
    },
    en: {
      overviewTitle: "What CBM means",
      overview: "CBM means cubic metres, a volume measure commonly used in freight and storage. This calculator finds the volume of a rectangular package and multiplies it by the number of identical packages.",
      methodTitle: "How cubic metres are calculated",
      method: [
        "Box volume = length × width × height after converting every dimension to metres.",
        "Total CBM = volume per box × number of boxes. For centimetres, divide each dimension by 100 before multiplying.",
      ],
      exampleTitle: "Shipping example",
      example: "A box measuring 0.60 m × 0.40 m × 0.50 m has a volume of 0.12 m³. Ten identical boxes occupy 1.20 m³ in total.",
      validationTitle: "Checks before using the result",
      validation: [
        "Use the same unit for all dimensions before multiplying.",
        "Use external package dimensions when estimating freight space.",
        "Do not confuse cubic volume with volumetric weight; carriers may price using a separate dimensional-weight formula.",
      ],
      faqTitle: "CBM questions",
      faq: [
        { question: "Is CBM the same as volumetric weight?", answer: "No. CBM is volume only. Volumetric weight converts volume into a billing weight using a carrier-specific factor." },
        { question: "How do I use centimetres?", answer: "Divide each centimetre measurement by 100 to convert it to metres before multiplying." },
        { question: "Should pallet dimensions be included?", answer: "If the pallet ships with the goods, use the outside dimensions of the prepared shipment for a space estimate." },
      ],
      disclaimer: "The result is geometric volume. Packaging, billing rules, and dimensional-weight policies vary by carrier.",
    },
  },

  "celsius-to-fahrenheit-converter": {
    ar: {
      overviewTitle: "تحويل المئوية إلى فهرنهايت",
      overview: "تحول الأداة درجة الحرارة من مقياس سيلسيوس (°C) إلى فهرنهايت (°F) باستخدام العلاقة الرياضية القياسية بين المقياسين.",
      methodTitle: "معادلة التحويل",
      method: [
        "فهرنهايت = (سيلسيوس × 9 ÷ 5) + 32.",
        "الإضافة بمقدار 32 مهمة لأن نقطتي الصفر في المقياسين مختلفتان، لذلك لا يكفي ضرب الدرجة في عامل ثابت فقط.",
      ],
      exampleTitle: "مثال سريع",
      example: "عند 25°C: 25 × 9 ÷ 5 = 45، ثم 45 + 32 = 77°F.",
      validationTitle: "قيم مرجعية للتحقق",
      validation: [
        "0°C تساوي 32°F.",
        "100°C تساوي 212°F عند الضغط الجوي القياسي كمرجع شائع لغليان الماء.",
        "-40°C تساوي -40°F، وهي نقطة يتساوى عندها المقياسان.",
      ],
      faqTitle: "أسئلة شائعة عن الحرارة",
      faq: [
        { question: "لماذا نضيف 32؟", answer: "لأن مقياس فهرنهايت يستخدم نقطة صفر مختلفة عن سيلسيوس؛ عامل 9/5 يضبط حجم الدرجة و32 يضبط الإزاحة." },
        { question: "هل التحويل دقيق؟", answer: "نعم رياضيًا. الدقة المعروضة تعتمد فقط على عدد المنازل العشرية المستخدمة في العرض." },
        { question: "كيف أعكس التحويل؟", answer: "من فهرنهايت إلى سيلسيوس استخدم: (°F - 32) × 5 ÷ 9." },
      ],
      disclaimer: "التحويل رياضي بين مقياسي الحرارة ولا يمثل قياسًا فعليًا لدرجة حرارة جسم أو بيئة.",
    },
    en: {
      overviewTitle: "Celsius to Fahrenheit conversion",
      overview: "This tool converts a temperature from degrees Celsius (°C) to degrees Fahrenheit (°F) using the standard mathematical relationship between the two scales.",
      methodTitle: "Conversion formula",
      method: [
        "Fahrenheit = (Celsius × 9 ÷ 5) + 32.",
        "The +32 offset matters because the two scales use different zero points; conversion is not a simple multiplication by one constant.",
      ],
      exampleTitle: "Quick example",
      example: "For 25°C: 25 × 9 ÷ 5 = 45, then 45 + 32 = 77°F.",
      validationTitle: "Reference values",
      validation: [
        "0°C equals 32°F.",
        "100°C equals 212°F, commonly used as the boiling-point reference for water at standard atmospheric pressure.",
        "-40°C equals -40°F, the point where both scales show the same number.",
      ],
      faqTitle: "Temperature conversion questions",
      faq: [
        { question: "Why is 32 added?", answer: "The Fahrenheit scale has a different zero point. The 9/5 factor adjusts degree size and 32 adjusts the offset." },
        { question: "Is the conversion exact?", answer: "The formula is exact. Display precision depends on how many decimal places are shown." },
        { question: "How do I convert back to Celsius?", answer: "Use (°F - 32) × 5 ÷ 9." },
      ],
      disclaimer: "This is a mathematical scale conversion and does not measure the temperature of an object or environment.",
    },
  },

  "circle-circumference-calculator": {
    ar: {
      overviewTitle: "حساب محيط الدائرة",
      overview: "محيط الدائرة هو طول الخط الذي يلتف حول الدائرة بالكامل. تحتاج هذه الحاسبة إلى نصف القطر ثم تستخدم ثابت π لحساب المحيط.",
      methodTitle: "معادلة محيط الدائرة",
      method: [
        "المحيط = 2 × π × نصف القطر.",
        "إذا كان لديك القطر بدل نصف القطر، يمكنك استخدام المحيط = π × القطر لأن القطر يساوي ضعفي نصف القطر.",
      ],
      exampleTitle: "مثال هندسي",
      example: "لدائرة نصف قطرها 5 سم: المحيط = 2 × π × 5 ≈ 31.416 سم.",
      validationTitle: "طريقة مراجعة الحساب",
      validation: [
        "استخدم وحدة واحدة لنصف القطر والنتيجة؛ إذا أدخلت السنتيمتر فالمحيط يكون بالسنتيمتر.",
        "تأكد أنك لم تدخل القطر في خانة نصف القطر، لأن ذلك يضاعف النتيجة.",
        "للتقدير السريع، استخدم π ≈ 3.14 ثم قارن الناتج بالحساب الدقيق.",
      ],
      faqTitle: "أسئلة هندسية شائعة",
      faq: [
        { question: "ما الفرق بين المحيط والمساحة؟", answer: "المحيط يقيس طول الحد الخارجي، بينما المساحة تقيس السطح داخل الدائرة وتستخدم πr²." },
        { question: "هل يمكن استخدام القطر؟", answer: "نعم. إذا كان القطر معلومًا فاستخدم C = πd." },
        { question: "ما قيمة π المستخدمة؟", answer: "تستخدم الحاسبات قيمة π بدقة الآلة، بينما 3.14 مناسب فقط للتقدير اليدوي السريع." },
      ],
      disclaimer: "النتيجة هندسية نظرية وتفترض دائرة كاملة وقياسًا صحيحًا لنصف القطر.",
    },
    en: {
      overviewTitle: "Circle circumference",
      overview: "Circumference is the distance around a complete circle. This calculator uses the radius together with the constant π to find that distance.",
      methodTitle: "Circumference formula",
      method: [
        "Circumference = 2 × π × radius.",
        "If you know the diameter instead, use circumference = π × diameter because diameter is twice the radius.",
      ],
      exampleTitle: "Geometry example",
      example: "For a circle with radius 5 cm: circumference = 2 × π × 5 ≈ 31.416 cm.",
      validationTitle: "How to check the calculation",
      validation: [
        "The result uses the same length unit as the radius.",
        "Do not enter diameter in a radius field, which would double the intended result.",
        "For a rough manual check, use π ≈ 3.14 and compare with the calculator result.",
      ],
      faqTitle: "Common geometry questions",
      faq: [
        { question: "What is the difference between circumference and area?", answer: "Circumference measures the boundary length. Area measures the surface inside the circle and uses πr²." },
        { question: "Can I use diameter instead?", answer: "Yes. When diameter is known, C = πd." },
        { question: "What value of π is used?", answer: "Calculators use machine precision for π; 3.14 is mainly useful for quick hand estimates." },
      ],
      disclaimer: "The result assumes a complete circle and an accurate radius measurement.",
    },
  },

  "concrete-volume-calculator": {
    ar: {
      overviewTitle: "تقدير حجم الخرسانة",
      overview: "تحسب الأداة الحجم الهندسي لجزء خرساني مستطيل مثل بلاطة أو قاعدة عندما تعرف الطول والعرض والسماكة. الناتج بالمتر المكعب إذا كانت جميع الأبعاد بالمتر.",
      methodTitle: "معادلة الحجم",
      method: [
        "حجم الخرسانة = الطول × العرض × السماكة أو العمق.",
        "إذا كانت السماكة بالسنتيمتر فحوّلها إلى متر بقسمتها على 100 قبل الضرب. مثال: 15 سم = 0.15 م.",
      ],
      exampleTitle: "مثال لبلاطة",
      example: "بلاطة طولها 6 م وعرضها 4 م وسماكتها 0.15 م تحتاج حجمًا نظريًا = 6 × 4 × 0.15 = 3.6 م³.",
      validationTitle: "قبل طلب الخرسانة",
      validation: [
        "راجع الوحدات، خصوصًا السماكة لأنها كثيرًا ما تكون بالسنتيمتر.",
        "الناتج لا يضيف تلقائيًا فاقد الصب أو تفاوت الحفر أو الهدر.",
        "الأشكال غير المستطيلة تحتاج تقسيمها إلى أجزاء أو استخدام معادلة مناسبة لكل شكل.",
      ],
      faqTitle: "أسئلة عن تقدير الخرسانة",
      faq: [
        { question: "هل أضيف نسبة هدر؟", answer: "الحاسبة تعطي الحجم الهندسي فقط. نسبة الاحتياط تعتمد على المشروع وطريقة التنفيذ ويحددها المشرف أو المورد." },
        { question: "كيف أدخل سماكة 20 سم؟", answer: "حوّلها إلى 0.20 متر إذا كانت بقية الأبعاد بالمتر." },
        { question: "هل تصلح للأعمدة الدائرية؟", answer: "لا مباشرة؛ العمود الدائري يحتاج معادلة حجم الأسطوانة πr²h." },
      ],
      disclaimer: "هذا تقدير هندسي أولي، وليس مخطط كميات أو توصية إنشائية. راجع مهندسًا أو موردًا قبل الطلب الفعلي.",
    },
    en: {
      overviewTitle: "Estimating concrete volume",
      overview: "This calculator finds the geometric volume of a rectangular concrete element such as a slab or footing from its length, width, and thickness. The result is in cubic metres when every dimension is entered in metres.",
      methodTitle: "Volume formula",
      method: [
        "Concrete volume = length × width × thickness or depth.",
        "Convert centimetres to metres before multiplying. For example, 15 cm = 0.15 m.",
      ],
      exampleTitle: "Slab example",
      example: "A slab 6 m long, 4 m wide, and 0.15 m thick has a theoretical volume of 6 × 4 × 0.15 = 3.6 m³.",
      validationTitle: "Before ordering concrete",
      validation: [
        "Check units carefully, especially thickness values commonly measured in centimetres.",
        "The result does not automatically include spillage, excavation variation, or waste allowance.",
        "Irregular shapes should be split into simpler sections or calculated with the correct geometry for each section.",
      ],
      faqTitle: "Concrete estimate questions",
      faq: [
        { question: "Should I add a waste allowance?", answer: "The calculator returns geometric volume only. Any contingency depends on the project and should be confirmed with the contractor or supplier." },
        { question: "How do I enter a 20 cm slab?", answer: "Use 0.20 m when the other dimensions are in metres." },
        { question: "Can this calculate a round column?", answer: "Not directly. A round column uses the cylinder formula πr²h." },
      ],
      disclaimer: "This is an initial geometric estimate, not a bill of quantities or structural recommendation. Confirm the order with a qualified professional or supplier.",
    },
  },

  "discount-calculator": {
    ar: {
      overviewTitle: "حساب الخصم والسعر النهائي",
      overview: "توضح الحاسبة مقدار الخصم النقدي والسعر المتبقي بعد تطبيق نسبة خصم على سعر أصلي. وهي مناسبة لمقارنة عروض البيع أو مراجعة ملصق خصم قبل الشراء.",
      methodTitle: "معادلة الخصم",
      method: [
        "قيمة الخصم = السعر الأصلي × نسبة الخصم ÷ 100.",
        "السعر بعد الخصم = السعر الأصلي - قيمة الخصم. إذا كانت هناك ضريبة أو رسوم لاحقة، احسبها في خطوة منفصلة حسب قاعدة السعر التي تطبق عليها.",
      ],
      exampleTitle: "مثال شراء",
      example: "سعر أصلي 320 وخصم 25%: قيمة الخصم = 320 × 0.25 = 80، والسعر بعد الخصم = 240.",
      validationTitle: "أخطاء شائعة",
      validation: [
        "أدخل نسبة 25 للخصم 25%، وليس 0.25 إذا كانت الخانة تطلب نسبة مئوية.",
        "تأكد أن السعر الأصلي هو السعر قبل الخصم فعلًا.",
        "الخصومات المتتابعة مثل 20% ثم 10% لا تساوي خصمًا واحدًا قدره 30% لأن الخصم الثاني يطبق على سعر أقل.",
      ],
      faqTitle: "أسئلة عن الخصومات",
      faq: [
        { question: "هل خصم 20% ثم 10% يساوي 30%؟", answer: "لا. مثال سعر 100 يصبح 80 بعد 20% ثم 72 بعد 10% إضافية، أي خصم فعلي 28%." },
        { question: "كيف أعرف المبلغ الذي وفرته؟", answer: "قيمة الخصم نفسها هي مقدار التوفير مقارنة بالسعر الأصلي قبل أي رسوم لاحقة." },
        { question: "هل تضيف الحاسبة الضريبة؟", answer: "لا إلا إذا كانت الأداة تنص على ذلك. هذه الصفحة تركز على الخصم؛ الضريبة خطوة مستقلة." },
      ],
      disclaimer: "النتيجة حسابية. شروط المتجر والضرائب والرسوم قد تغير المبلغ النهائي عند الدفع.",
    },
    en: {
      overviewTitle: "Discount amount and final price",
      overview: "This calculator shows the money saved and the remaining price after applying a percentage discount to an original price. It is useful for checking sale labels or comparing offers.",
      methodTitle: "Discount formula",
      method: [
        "Discount amount = original price × discount rate ÷ 100.",
        "Price after discount = original price - discount amount. Taxes or later fees should be calculated separately using the basis that applies to them.",
      ],
      exampleTitle: "Shopping example",
      example: "Original price 320 with 25% off: discount = 320 × 0.25 = 80, so the discounted price is 240.",
      validationTitle: "Common mistakes",
      validation: [
        "Enter 25 for a 25% rate when the field expects a percentage, not 0.25.",
        "Make sure the original price really is the pre-discount price.",
        "Sequential discounts such as 20% then 10% do not equal one 30% discount because the second rate applies to a lower price.",
      ],
      faqTitle: "Discount questions",
      faq: [
        { question: "Is 20% off followed by 10% off the same as 30% off?", answer: "No. A price of 100 becomes 80 and then 72, which is an effective 28% discount." },
        { question: "How much did I save?", answer: "The calculated discount amount is the saving compared with the original price before later taxes or fees." },
        { question: "Does this include tax?", answer: "Not unless the tool explicitly says so. This calculation is for discount; tax is a separate step." },
      ],
      disclaimer: "This is an arithmetic result. Store terms, taxes, and fees can change the amount paid at checkout.",
    },
  },

  "millimeter-to-inch-converter": {
    ar: {
      overviewTitle: "تحويل المليمتر إلى بوصة",
      overview: "تستخدم الأداة العلاقة الدولية الدقيقة بين المليمتر والبوصة. هذا التحويل مفيد في المقاسات الهندسية، الطباعة، الشاشات، القطع الميكانيكية، والمخططات التي تجمع بين النظامين المتري والإمبراطوري.",
      methodTitle: "عامل التحويل الدقيق",
      method: [
        "1 بوصة = 25.4 مليمتر بالضبط.",
        "لذلك: البوصة = المليمتر ÷ 25.4. وللتحويل العكسي: المليمتر = البوصة × 25.4.",
      ],
      exampleTitle: "مثال مرجعي",
      example: "50.8 مم ÷ 25.4 = 2 بوصة بالضبط.",
      validationTitle: "التحقق من التحويل",
      validation: [
        "25.4 مم يجب أن تعطي 1 بوصة.",
        "كلما صغرت القيمة، قد تحتاج إلى منازل عشرية أكثر لتجنب فقدان الدقة.",
        "لا تخلط بين البوصة العشرية والكسور الشائعة مثل 1/8 أو 1/16 بوصة؛ التحويل هنا يعطي قيمة عشرية ما لم تعرض الأداة خلاف ذلك.",
      ],
      faqTitle: "أسئلة عن المليمتر والبوصة",
      faq: [
        { question: "هل 25.4 رقم تقريبي؟", answer: "لا. تعريف البوصة الدولي يجعل 1 بوصة مساوية لـ25.4 مم بالضبط." },
        { question: "كيف أحول 10 مم؟", answer: "10 ÷ 25.4 ≈ 0.3937 بوصة." },
        { question: "هل النتيجة كسر بوصة؟", answer: "النتيجة الأساسية عشرية. تحويلها إلى كسر قياسي يحتاج تقريبًا إضافيًا حسب الدقة المطلوبة." },
      ],
      disclaimer: "عامل التحويل دقيق، لكن دقة القياس الفعلي تعتمد على الأداة المستخدمة لقياس القطعة الأصلية.",
    },
    en: {
      overviewTitle: "Millimetres to inches",
      overview: "This converter uses the exact international relationship between millimetres and inches. It is useful for engineering dimensions, printing, displays, mechanical parts, and drawings that mix metric and imperial units.",
      methodTitle: "Exact conversion factor",
      method: [
        "1 inch = exactly 25.4 millimetres.",
        "Therefore inches = millimetres ÷ 25.4. For the reverse direction, millimetres = inches × 25.4.",
      ],
      exampleTitle: "Reference example",
      example: "50.8 mm ÷ 25.4 = exactly 2 inches.",
      validationTitle: "How to verify the conversion",
      validation: [
        "25.4 mm should return exactly 1 inch.",
        "Small measurements may require more decimal places to preserve useful precision.",
        "A decimal-inch result is not automatically the same as a common fractional size such as 1/8 or 1/16 inch.",
      ],
      faqTitle: "Millimetre and inch questions",
      faq: [
        { question: "Is 25.4 only an approximation?", answer: "No. The international definition makes one inch exactly 25.4 mm." },
        { question: "What is 10 mm in inches?", answer: "10 ÷ 25.4 ≈ 0.3937 inches." },
        { question: "Does the result show an inch fraction?", answer: "The basic result is decimal. Converting it to a standard fraction requires an additional rounding choice." },
      ],
      disclaimer: "The conversion factor is exact, but real-world accuracy still depends on the precision of the original measurement.",
    },
  },

  "paint-liters-calculator": {
    ar: {
      overviewTitle: "تقدير كمية الدهان",
      overview: "تقدّر الحاسبة عدد لترات الدهان اللازمة اعتمادًا على مساحة السطح، وعدد الطبقات، ومعدل التغطية لكل لتر. الهدف هو التخطيط للشراء، وليس ضمان استهلاك ثابت لكل نوع دهان أو سطح.",
      methodTitle: "طريقة التقدير",
      method: [
        "اللترات المطلوبة = مساحة السطح × عدد الطبقات ÷ معدل التغطية بالمتر المربع لكل لتر.",
        "معدل التغطية يختلف حسب المنتج وخشونة السطح وطريقة التطبيق؛ استخدم الرقم المكتوب في بيانات الشركة المصنعة عندما يكون متاحًا.",
      ],
      exampleTitle: "مثال لغرفة",
      example: "إذا كانت المساحة المطلية 60 م²، وتحتاج طبقتين، والدهان يغطي 10 م² لكل لتر، فالكمية النظرية = 60 × 2 ÷ 10 = 12 لترًا.",
      validationTitle: "ما الذي قد يغيّر الاستهلاك؟",
      validation: [
        "الأسطح المسامية أو الخشنة قد تستهلك دهانًا أكثر.",
        "لا تنس طرح مساحات الأبواب والنوافذ إذا كنت تريد تقديرًا أدق.",
        "الطبقة التمهيدية أو البرايمر منتج منفصل ولا تدخل تلقائيًا في كمية الدهان النهائي.",
      ],
      faqTitle: "أسئلة عن كمية الدهان",
      faq: [
        { question: "ما هو معدل التغطية؟", answer: "هو عدد الأمتار المربعة التي يغطيها لتر واحد تقريبًا في طبقة واحدة، ويختلف بين المنتجات." },
        { question: "هل أضيف احتياطًا؟", answer: "قد يكون الاحتياط مناسبًا لاختلاف السطح أو أعمال اللمس، لكن النسبة المناسبة تعتمد على المشروع والمنتج." },
        { question: "هل أحسب السقف ضمن المساحة؟", answer: "أضفه فقط إذا كنت ستطليه، واحسب مساحته كجزء مستقل من إجمالي السطح." },
      ],
      disclaimer: "التقدير تقريبي. اتبع معدل التغطية وتعليمات التحضير والتطبيق على عبوة الدهان المستخدمة.",
    },
    en: {
      overviewTitle: "Estimating paint quantity",
      overview: "This calculator estimates litres of paint from surface area, number of coats, and coverage per litre. It is intended for purchase planning, not as a guarantee of consumption for every paint or surface.",
      methodTitle: "Estimation method",
      method: [
        "Litres required = surface area × number of coats ÷ coverage in square metres per litre.",
        "Coverage varies with product, surface texture, and application method. Use the manufacturer's stated coverage whenever available.",
      ],
      exampleTitle: "Room example",
      example: "For 60 m² of paintable surface, two coats, and coverage of 10 m²/L, the theoretical quantity is 60 × 2 ÷ 10 = 12 litres.",
      validationTitle: "What can change paint usage?",
      validation: [
        "Porous or rough surfaces may consume more paint.",
        "Subtract doors and windows when a more precise wall-area estimate is needed.",
        "Primer is a separate coating and is not automatically included in the finish-paint quantity.",
      ],
      faqTitle: "Paint quantity questions",
      faq: [
        { question: "What is coverage rate?", answer: "It is the approximate area one litre covers in one coat, and it varies by product." },
        { question: "Should I buy extra paint?", answer: "A contingency can help with surface variation and touch-ups, but the appropriate amount depends on the project and product." },
        { question: "Should the ceiling be included?", answer: "Include it only when it will be painted, and add its area separately to the total." },
      ],
      disclaimer: "This is an estimate. Follow the coverage, preparation, and application instructions for the specific paint you use.",
    },
  },

  "percentage-calculator": {
    ar: {
      overviewTitle: "حساب نسبة جزء من إجمالي",
      overview: "تحسب هذه الأداة النسبة المئوية التي يمثلها جزء من قيمة إجمالية. وهي مناسبة لأسئلة مثل: كم تمثل 30 من أصل 120؟",
      methodTitle: "معادلة النسبة المئوية",
      method: [
        "النسبة المئوية = الجزء ÷ الإجمالي × 100.",
        "يجب ألا يكون الإجمالي صفرًا. كما يجب أن يكون الجزء والإجمالي مقاسين على الأساس نفسه قبل المقارنة.",
      ],
      exampleTitle: "مثال محلول",
      example: "إذا كان الجزء 30 والإجمالي 120: 30 ÷ 120 × 100 = 25%.",
      validationTitle: "كيف تتأكد؟",
      validation: [
        "إذا كان الجزء يساوي الإجمالي فالنتيجة يجب أن تكون 100%.",
        "إذا كان الجزء نصف الإجمالي فالنتيجة يجب أن تكون 50%.",
        "قد تتجاوز النتيجة 100% عندما يكون الجزء أكبر من الإجمالي، وهذا ليس خطأ حسابيًا إذا كان السياق يسمح بذلك.",
      ],
      faqTitle: "أسئلة عن النسب",
      faq: [
        { question: "هل يمكن أن تكون النسبة أكبر من 100%؟", answer: "نعم، إذا كان الجزء أكبر من القيمة المرجعية التي وضعتها كإجمالي أو أساس للمقارنة." },
        { question: "ما الفرق بين النسبة ونسبة التغير؟", answer: "هذه الحاسبة تقارن جزءًا بإجمالي. نسبة التغير تقارن قيمة جديدة بقيمة قديمة وتستخدم معادلة مختلفة." },
        { question: "لماذا لا يمكن أن يكون الإجمالي صفرًا؟", answer: "لأن المعادلة تتطلب القسمة على الإجمالي، والقسمة على صفر غير معرفة." },
      ],
      disclaimer: "فسّر النسبة ضمن سياق البيانات؛ اختيار المقام أو القيمة المرجعية يغيّر معنى النتيجة.",
    },
    en: {
      overviewTitle: "Part as a percentage of a total",
      overview: "This calculator finds the percentage that one value represents of a total. It answers questions such as: what percentage is 30 out of 120?",
      methodTitle: "Percentage formula",
      method: [
        "Percentage = part ÷ total × 100.",
        "The total cannot be zero, and both values should be measured on the same basis before they are compared.",
      ],
      exampleTitle: "Worked example",
      example: "If the part is 30 and the total is 120: 30 ÷ 120 × 100 = 25%.",
      validationTitle: "Quick checks",
      validation: [
        "If part equals total, the result should be 100%.",
        "If part is half the total, the result should be 50%.",
        "A result above 100% can be valid when the part exceeds the chosen reference total.",
      ],
      faqTitle: "Percentage questions",
      faq: [
        { question: "Can a percentage be above 100%?", answer: "Yes, when the part is larger than the reference total used in the denominator." },
        { question: "Is this the same as percentage change?", answer: "No. This compares a part with a total. Percentage change compares a new value with an old value using a different formula." },
        { question: "Why can't total be zero?", answer: "The calculation divides by the total, and division by zero is undefined." },
      ],
      disclaimer: "Interpret the percentage in context; changing the denominator or reference value changes what the result means.",
    },
  },

  "profit-margin-calculator": {
    ar: {
      overviewTitle: "ما هو هامش الربح؟",
      overview: "هامش الربح يوضح نسبة الربح من سعر البيع أو الإيراد. يساعدك على فهم مقدار ما يبقى من كل وحدة إيراد بعد خصم التكلفة التي أدخلتها.",
      methodTitle: "معادلة هامش الربح",
      method: [
        "الربح = سعر البيع - التكلفة.",
        "هامش الربح % = الربح ÷ سعر البيع × 100. لا تخلطه مع نسبة الزيادة على التكلفة (Markup)، التي تقسم الربح على التكلفة بدل سعر البيع.",
      ],
      exampleTitle: "مثال تجاري",
      example: "إذا كانت التكلفة 350 وسعر البيع 500، فالربح 150، وهامش الربح = 150 ÷ 500 × 100 = 30%.",
      validationTitle: "مراجعة النتيجة",
      validation: [
        "استخدم تعريفًا ثابتًا للتكلفة؛ هل تشمل الشحن أو العمولة أو المصروفات الأخرى؟",
        "إذا كان سعر البيع صفرًا فلا يمكن حساب الهامش بهذه المعادلة.",
        "إذا كانت التكلفة أكبر من سعر البيع سيظهر هامش سالب، وهو يعبر عن خسارة حسابية.",
      ],
      faqTitle: "أسئلة عن هامش الربح",
      faq: [
        { question: "ما الفرق بين Margin وMarkup؟", answer: "Margin يقسم الربح على سعر البيع، بينما Markup يقسم الربح على التكلفة، لذلك تعطيان نسبتين مختلفتين لنفس الصفقة." },
        { question: "هل الهامش 30% يعني أنني أضفت 30% على التكلفة؟", answer: "ليس بالضرورة. هامش 30% يقاس من سعر البيع، وليس من التكلفة." },
        { question: "هل أدخل التكلفة الشاملة لكل المصروفات؟", answer: "ذلك يعتمد على الهدف. للمقارنة الدقيقة حدد مسبقًا ما الذي تعتبره تكلفة واستخدم التعريف نفسه دائمًا." },
      ],
      disclaimer: "الحساب لا يحدد الربحية المحاسبية الكاملة إلا إذا كانت مدخلات التكلفة تشمل البنود ذات الصلة بهدف التحليل.",
    },
    en: {
      overviewTitle: "What profit margin means",
      overview: "Profit margin expresses profit as a percentage of selling price or revenue. It helps show how much of each revenue unit remains after subtracting the cost you entered.",
      methodTitle: "Profit margin formula",
      method: [
        "Profit = selling price - cost.",
        "Profit margin % = profit ÷ selling price × 100. Do not confuse margin with markup, which divides profit by cost instead of selling price.",
      ],
      exampleTitle: "Business example",
      example: "If cost is 350 and selling price is 500, profit is 150 and margin = 150 ÷ 500 × 100 = 30%.",
      validationTitle: "How to review the result",
      validation: [
        "Use a consistent definition of cost; decide whether freight, commissions, or other expenses are included.",
        "Selling price cannot be zero in this margin formula.",
        "If cost exceeds selling price, a negative margin represents an arithmetic loss.",
      ],
      faqTitle: "Profit margin questions",
      faq: [
        { question: "What is the difference between margin and markup?", answer: "Margin divides profit by selling price; markup divides profit by cost, so they produce different percentages for the same transaction." },
        { question: "Does a 30% margin mean I added 30% to cost?", answer: "Not necessarily. Margin is measured against selling price, not cost." },
        { question: "Should cost include every expense?", answer: "It depends on your purpose. Define which costs belong in the analysis and use that definition consistently." },
      ],
      disclaimer: "The calculation is not a complete accounting profit measure unless the cost input includes all items relevant to your analysis.",
    },
  },

  "roi-calculator": {
    ar: {
      overviewTitle: "حساب العائد على الاستثمار",
      overview: "ROI مقياس مبسط يقارن صافي العائد بتكلفة الاستثمار. يفيد في المقارنة الأولية بين نتائج استثمارات أو حملات عندما تستخدم التعريف نفسه للتكلفة والعائد.",
      methodTitle: "معادلة ROI",
      method: [
        "صافي العائد = القيمة النهائية أو العائد - تكلفة الاستثمار.",
        "ROI % = صافي العائد ÷ تكلفة الاستثمار × 100. هذه المعادلة لا تضبط تلقائيًا اختلاف المدة الزمنية أو المخاطر أو التدفقات النقدية المرحلية.",
      ],
      exampleTitle: "مثال استثماري مبسط",
      example: "تكلفة 500 وعائد نهائي 650 تعني صافي عائد 150، وبالتالي ROI = 150 ÷ 500 × 100 = 30%.",
      validationTitle: "قبل مقارنة نتيجتين",
      validation: [
        "استخدم الفترة الزمنية نفسها عند المقارنة قدر الإمكان.",
        "أدخل التكاليف المباشرة والرسوم التي تريد أن تكون ضمن المقارنة بصورة متسقة.",
        "ROI المرتفع لا يصف المخاطر أو السيولة أو توقيت التدفقات النقدية بمفرده.",
      ],
      faqTitle: "أسئلة عن ROI",
      faq: [
        { question: "هل ROI السنوي هو نفسه ROI لأي مدة؟", answer: "لا. النسبة البسيطة لا تحول النتيجة تلقائيًا إلى معدل سنوي، لذلك يجب الانتباه إلى مدة الاستثمار." },
        { question: "هل يمكن أن يكون ROI سالبًا؟", answer: "نعم، عندما يكون العائد النهائي أقل من التكلفة التي أدخلتها." },
        { question: "هل ROI وحده يكفي لاتخاذ قرار؟", answer: "لا. قد تحتاج إلى تقييم المخاطر والمدة والسيولة والتدفقات النقدية ومؤشرات أخرى." },
      ],
      disclaimer: "الحساب تعليمي ومبسّط ولا يمثل نصيحة استثمارية أو تقييمًا كاملًا للمخاطر والعائد.",
    },
    en: {
      overviewTitle: "Return on investment",
      overview: "ROI is a simple measure that compares net return with investment cost. It is useful for an initial comparison when the same definitions of cost and return are used consistently.",
      methodTitle: "ROI formula",
      method: [
        "Net return = final value or return - investment cost.",
        "ROI % = net return ÷ investment cost × 100. This basic formula does not automatically adjust for different time periods, risk, or interim cash flows.",
      ],
      exampleTitle: "Simple investment example",
      example: "A cost of 500 and final return of 650 gives a net return of 150, so ROI = 150 ÷ 500 × 100 = 30%.",
      validationTitle: "Before comparing two results",
      validation: [
        "Use the same time period when possible.",
        "Treat direct costs and fees consistently between alternatives.",
        "A high ROI number by itself does not describe risk, liquidity, or timing of cash flows.",
      ],
      faqTitle: "ROI questions",
      faq: [
        { question: "Is ROI automatically an annual rate?", answer: "No. A simple ROI does not annualize the result, so the investment period matters." },
        { question: "Can ROI be negative?", answer: "Yes. It is negative when the final return is lower than the cost entered." },
        { question: "Is ROI enough for an investment decision?", answer: "No. Risk, duration, liquidity, cash flows, and other measures may also matter." },
      ],
      disclaimer: "This is a simplified educational calculation, not investment advice or a complete risk-and-return assessment.",
    },
  },

  "vat-calculator": {
    ar: {
      overviewTitle: "حساب قيمة ضريبة القيمة المضافة",
      overview: "تحسب الأداة مبلغ الضريبة انطلاقًا من سعر أساسي ونسبة ضريبة تدخلها أنت. كما تساعد على رؤية الإجمالي بعد إضافة الضريبة. لا تفترض الصفحة أن نسبة واحدة تنطبق على كل بلد أو سلعة أو فترة.",
      methodTitle: "طريقة الحساب",
      method: [
        "قيمة الضريبة = السعر قبل الضريبة × نسبة الضريبة ÷ 100.",
        "الإجمالي بعد الضريبة = السعر قبل الضريبة + قيمة الضريبة. إذا كان السعر الذي لديك شاملًا للضريبة أصلًا، فهذه ليست معادلة استخراج الضريبة من الإجمالي؛ استخدم وضعًا مخصصًا للسعر الشامل إن كان متاحًا.",
      ],
      exampleTitle: "مثال تعليمي",
      example: "إذا كان السعر قبل الضريبة 200 وأدخلت نسبة 15%، فقيمة الضريبة = 30 والإجمالي = 230. النسبة هنا مثال إدخال وليست تصريحًا بأنها النسبة الصحيحة لكل حالة.",
      validationTitle: "قبل الاعتماد على الرقم",
      validation: [
        "تأكد هل السعر المدخل شامل للضريبة أم غير شامل لها.",
        "تحقق من النسبة السارية على السلعة أو الخدمة والفترة والمكان المعنيين من مصدر رسمي عند الحاجة.",
        "التقريب في الفواتير قد يخضع لقواعد محاسبية أو نظامية خاصة؛ قارن النتيجة بالفاتورة الفعلية عند وجودها.",
      ],
      faqTitle: "أسئلة عن ضريبة القيمة المضافة",
      faq: [
        { question: "هل الحاسبة تفرض نسبة ضريبة محددة؟", answer: "لا. النسبة مدخل للحساب، ومسؤولية المستخدم التحقق من النسبة الصحيحة لحالته." },
        { question: "هل يمكن استخراج الضريبة من سعر شامل؟", answer: "يحتاج ذلك إلى معادلة مختلفة عن مجرد ضرب الإجمالي في النسبة؛ استخدم حاسبة أو وضع السعر الشامل إذا كان متاحًا." },
        { question: "لماذا قد يختلف الناتج عن الفاتورة بفارق بسيط؟", answer: "قد يرجع ذلك إلى التقريب أو إلى طريقة توزيع الضريبة على بنود متعددة أو قواعد الفوترة المطبقة." },
      ],
      disclaimer: "هذه أداة حسابية وليست استشارة ضريبية. تحقق من النسب والقواعد الحالية لدى الجهة الرسمية المختصة قبل استخدام النتيجة في إقرار أو فاتورة رسمية.",
    },
    en: {
      overviewTitle: "Calculating VAT amount",
      overview: "This tool calculates a tax amount from a pre-tax price and a VAT rate that you enter, and it can show the total after tax. The page does not assume one rate applies to every country, item, or period.",
      methodTitle: "Calculation method",
      method: [
        "VAT amount = pre-tax price × VAT rate ÷ 100.",
        "Total after VAT = pre-tax price + VAT amount. If the price you have already includes VAT, extracting the tax from that total requires a different formula or an inclusive-price mode.",
      ],
      exampleTitle: "Teaching example",
      example: "For a pre-tax price of 200 and an entered rate of 15%, VAT is 30 and the total is 230. The 15% rate is only an example input, not a statement that it applies to every transaction.",
      validationTitle: "Checks before relying on the number",
      validation: [
        "Confirm whether the entered price is tax-exclusive or tax-inclusive.",
        "Verify the rate applicable to the item, place, and period from an official source when the result will be used formally.",
        "Invoice rounding can follow specific accounting or legal rules, so compare with the actual invoice when available.",
      ],
      faqTitle: "VAT questions",
      faq: [
        { question: "Does the calculator assume a fixed VAT rate?", answer: "No. The rate is an input, and the user should verify the rate that applies to the specific case." },
        { question: "Can I extract VAT from a tax-inclusive price?", answer: "That requires a different formula from multiplying the total by the rate. Use an inclusive-price calculator or mode when available." },
        { question: "Why can an invoice differ slightly from the result?", answer: "Rounding, line-item treatment, or local invoicing rules can create small differences." },
      ],
      disclaimer: "This is a calculation tool, not tax advice. Verify current rates and rules with the relevant official authority before using the result for a filing or official invoice.",
    },
  },
};

export function getReviewedToolEditorialOverride(
  tool: LocalizedToolRecord,
): EditorialOverride | null {
  const content = reviewedEditorial[tool.slug];
  if (!content) return null;
  return tool.locale === "ar" ? content.ar : content.en;
}
