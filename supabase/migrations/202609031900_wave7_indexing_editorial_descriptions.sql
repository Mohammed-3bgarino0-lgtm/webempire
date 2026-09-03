-- Wave 7 SEO/editorial enrichment for 100 additional indexable tools.
-- Runtime formulas remain unchanged. Only localized descriptions are updated.

with wave7_slugs(slug) as (
  values
    ('animal-feed-requirement-calculator'),('crop-loss-rate-calculator'),('crop-yield-per-hectare-calculator'),('farm-profit-calculator'),('farm-revenue-calculator'),('feed-cost-per-animal-day-calculator'),('fertilizer-cost-calculator'),('fertilizer-requirement-calculator'),('greenhouse-plant-capacity-calculator'),('greenhouse-revenue-per-sqm-calculator'),
    ('annual-fuel-cost-calculator'),('car-payment-income-ratio-calculator'),('fleet-fuel-budget-calculator'),('fuel-consumption-liters-per-100km'),('fuel-efficiency-km-per-liter-calculator'),('insurance-monthly-equivalent-calculator'),('lease-mileage-overage-calculator'),('maintenance-cost-per-km-calculator'),('ride-profit-calculator'),('service-interval-remaining-calculator'),
    ('bakery-batch-profit-calculator'),('bakery-break-even-items-calculator'),('bakery-cost-per-item-calculator'),('bakery-daily-production-capacity-calculator'),('bakery-daily-profit-calculator'),('bakery-gross-margin-calculator'),('bakery-ingredient-cost-per-batch-calculator'),('bakery-labor-cost-per-batch-calculator'),('bakery-oven-utilization-calculator'),('bakery-packaging-cost-calculator'),
    ('brick-count-calculator'),('cement-bags-calculator'),('concrete-cost-calculator'),('construction-completion-rate-calculator'),('construction-labor-cost-calculator'),('construction-productivity-calculator'),('construction-tile-waste-cost-calculator'),('excavation-volume-calculator'),('floor-area-calculator'),('flooring-material-cost-calculator'),
    ('affiliate-revenue-calculator'),('brand-deal-hourly-rate-calculator'),('content-cost-per-post-calculator'),('content-publishing-frequency-calculator'),('creator-profit-margin-calculator'),('creator-revenue-per-thousand-views-calculator'),('engagements-per-post-calculator'),('follower-growth-rate-calculator'),('newsletter-click-rate-calculator'),('newsletter-open-rate-calculator'),
    ('average-handle-time-calculator'),('average-resolution-time-calculator'),('complaint-rate-per-thousand-customers'),('csat-score-calculator'),('customer-effort-score-average-calculator'),('escalation-rate-calculator'),('first-contact-resolution-rate-calculator'),('first-response-time-calculator'),('nps-score-calculator'),('queue-clearance-hours-calculator'),
    ('aspect-ratio-height-calculator'),('aspect-ratio-width-calculator'),('asset-storage-calculator'),('canvas-area-calculator'),('design-cost-per-asset-calculator'),('design-project-quote-calculator'),('design-utilization-rate-calculator'),('designer-revenue-per-hour-calculator'),('font-license-cost-calculator'),('image-megapixels-calculator'),
    ('annual-bonus-percentage-calculator'),('annual-compensation-calculator'),('annual-overtime-income-calculator'),('benefits-percentage-calculator'),('bonus-amount-calculator'),('commission-plus-salary'),('commission-share-of-income-calculator'),('daily-wage-calculator'),('effective-pay-per-hour-calculator'),('employer-payroll-cost'),
    ('booth-revenue-calculator'),('event-catering-cost-calculator'),('event-catering-waste-cost-calculator'),('event-checkin-rate-calculator'),('event-cost-per-attendee-calculator'),('event-no-show-rate-calculator'),('event-profit-calculator'),('event-registration-conversion-rate-calculator'),('event-roi-calculator'),('event-sponsorship-revenue-share-calculator'),
    ('billable-utilization-rate-calculator'),('client-concentration-rate-calculator'),('effective-hourly-rate-calculator'),('freelance-platform-fee-calculator'),('freelance-project-price-calculator'),('freelance-project-profit-margin-calculator'),('freelancer-availability-hours-calculator'),('freelancer-hourly-rate-calculator'),('freelancer-project-capacity-calculator'),('freelancer-revenue-per-client-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code as locale_code, c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave7_slugs w on w.slug = t.slug
  where t.is_active = true and l.code in ('ar','en')
)
update public.tool_translations tt
set
  short_description = case
    when x.locale_code = 'ar' then x.title || ' تساعدك على ' || case x.category_slug
      when 'agriculture-tools' then 'تحويل بيانات المزرعة إلى مؤشر واضح للغلة أو التكلفة أو العلف أو الأسمدة أو الطاقة الإنتاجية. استخدم المساحة والوزن والفترة نفسها في جميع المدخلات، وميّز بين الكمية المخططة والفعلية عند المقارنة.'
      when 'automotive-tools' then 'تقدير مؤشر استخدام المركبة مثل الوقود أو الصيانة أو المسافة أو التكلفة الشهرية. وحّد المسافة والفترة وسعر الوقود أو الخدمة، ولا تخلط بين تكلفة التشغيل الفعلية وقيمة التمويل أو التأمين.'
      when 'bakery-tools' then 'قياس تكلفة أو ربح أو طاقة إنتاج المخبز على مستوى القطعة أو الدفعة أو اليوم. افصل تكلفة المكونات والعمالة والتغليف، واستخدم عدد القطع القابلة للبيع بعد الهدر عند حساب التكلفة أو الهامش.'
      when 'construction-tools' then 'تقدير كمية أو تكلفة أو إنتاجية مرتبطة بأعمال البناء. راجع وحدات الطول والمساحة والحجم قبل الحساب، وأضف نسبة هدر مناسبة للموقع بدل افتراض أن الكمية النظرية تساوي الاحتياج الفعلي.'
      when 'creator-tools' then 'قياس أداء صناعة المحتوى من حيث الإيراد أو التفاعل أو النمو أو تكلفة المنشور. استخدم بيانات المنصة والفترة نفسها، وافصل بين المشاهدات والمتابعين والتفاعلات عند مقارنة المحتوى.'
      when 'customer-service-tools' then 'قياس جودة وسرعة خدمة العملاء مثل زمن الاستجابة والحل ورضا العملاء والتصعيد. حافظ على تعريف ثابت للتذكرة والعميل والفترة حتى تكون المعدلات قابلة للمقارنة بين الفرق أو الفترات.'
      when 'design-tools' then 'حساب أبعاد أو تكلفة أو إنتاجية مشروع تصميم باستخدام وحدات واضحة للملفات أو الساعات أو المقاسات. راجع نسبة الأبعاد والدقة والتراخيص قبل الاعتماد على النتيجة في التسليم أو التسعير.'
      when 'employment-tools' then 'تقدير مكوّن من مكونات الدخل أو تكلفة التوظيف مثل الأجر والعمولة والمكافأة والمزايا. استخدم القيم لنفس الفترة وراجع سياسات جهة العمل والأنظمة المحلية قبل اعتبار الناتج مبلغًا نهائيًا.'
      when 'event-tools' then 'قياس تكلفة أو ربح أو حضور أو تحويل فعالية. استخدم عدد المسجلين والحاضرين والإيرادات والتكاليف من الحدث نفسه، وافصل الرعايات والتذاكر والمصروفات حتى تكون النتيجة قابلة للتفسير.'
      when 'freelancer-tools' then 'قياس تسعير أو ربحية أو طاقة عمل المستقل. احسب الساعات القابلة للفوترة والرسوم والمصاريف بشكل منفصل، ولا تعتبر كل ساعة متاحة ساعة مدفوعة عند تحديد السعر أو السعة.'
      else 'حساب مؤشر عملي باستخدام مدخلات واضحة وقابلة للمراجعة.'
    end
    else x.title || ' helps you ' || case x.category_slug
      when 'agriculture-tools' then 'turn farm inputs into a clear yield, cost, feed, fertilizer, or capacity metric. Keep area, weight, and time units aligned and distinguish planned quantities from actual results when comparing periods.'
      when 'automotive-tools' then 'estimate a vehicle-use metric such as fuel, maintenance, distance, or monthly operating cost. Keep distance, time period, fuel price, and service basis consistent, and separate operating cost from financing or insurance.'
      when 'bakery-tools' then 'measure bakery cost, profit, or production capacity per item, batch, or day. Separate ingredients, labor, and packaging, and use saleable output after waste when calculating unit cost or margin.'
      when 'construction-tools' then 'estimate a construction quantity, cost, or productivity metric. Check length, area, and volume units before calculating and include a realistic waste allowance rather than treating theoretical quantity as final site demand.'
      when 'creator-tools' then 'measure creator performance across revenue, engagement, growth, or content cost. Use data from the same platform and date range and keep views, followers, and engagements distinct when comparing content.'
      when 'customer-service-tools' then 'measure service speed and quality through response time, resolution, satisfaction, or escalation metrics. Keep definitions of ticket, customer, and reporting period consistent across teams and periods.'
      when 'design-tools' then 'calculate design dimensions, cost, or productivity using clear file, hour, and size units. Check aspect ratio, resolution, and licensing assumptions before using the result for delivery or pricing.'
      when 'employment-tools' then 'estimate a component of compensation or employment cost such as wages, commission, bonus, or benefits. Keep all values on the same pay period and verify employer policy and local rules before treating the result as final pay.'
      when 'event-tools' then 'measure an event metric such as cost, profit, attendance, or registration conversion. Use registrations, attendees, revenue, and costs from the same event and separate sponsorship, ticket income, and expenses.'
      when 'freelancer-tools' then 'measure freelance pricing, profitability, or work capacity. Separate billable hours, fees, and expenses, and do not assume every available hour is a paid hour when estimating rate or capacity.'
      else 'calculate a practical metric using clear, reviewable inputs.'
    end
  end,
  seo_description = case
    when x.locale_code = 'ar' then 'استخدم ' || x.title || ' لحساب المؤشر بسرعة مع شرح واضح للمدخلات وطريقة تفسير النتيجة، ومقارنة القيم على أساس وحدات وفترات متسقة.'
    else 'Use ' || x.title || ' to calculate the metric quickly with clear input guidance, result interpretation, and consistent units for meaningful comparisons.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id and tt.locale_id = x.locale_id;
