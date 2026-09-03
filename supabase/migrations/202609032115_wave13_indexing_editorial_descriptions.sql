-- Wave 13 SEO/editorial enrichment for 100 indexable formula tools.
-- Runtime formulas, auth, pricing, and ad configuration are unchanged.

with wave13_slugs(slug) as (
  values
    ('harvest-loss-calculator'),('irrigation-cost-calculator'),('irrigation-hours-calculator'),('irrigation-water-calculator'),('livestock-feed-conversion-ratio-calculator'),('livestock-weight-gain-calculator'),('planting-area-from-seed-calculator'),('planting-density-calculator'),('seed-requirement-calculator'),
    ('tire-cost-per-km-calculator'),('trip-average-speed-calculator'),('vehicle-cost-per-km-calculator'),('vehicle-depreciation-amount-calculator'),('vehicle-depreciation-calculator'),('vehicle-finance-total-cost-calculator'),('vehicle-fuel-cost-calculator'),('vehicle-maintenance-budget-calculator'),('vehicle-ownership-monthly-cost-calculator'),('vehicle-running-cost-calculator'),
    ('bakery-production-yield-rate-calculator'),('bakery-revenue-per-labor-hour-calculator'),('bakery-waste-rate-calculator'),('batch-cycle-time-calculator'),('dough-yield-per-item-calculator'),('flour-cost-per-loaf-calculator'),('ingredient-cost-per-item-calculator'),('ingredient-cost-rate-calculator'),('oven-throughput-per-hour-calculator'),('packaging-cost-rate-calculator'),
    ('material-waste-cost-calculator'),('paint-material-cost-calculator'),('plaster-cost-calculator'),('project-contingency-calculator'),('rebar-cost-calculator'),('rebar-weight-estimator'),('tile-quantity-calculator'),('wall-area-calculator'),
    ('newsletter-revenue-per-subscriber-calculator'),('production-hours-per-post-calculator'),('social-engagement-rate-calculator'),('sponsorship-cpm-calculator'),('sponsorship-rate-calculator'),('subscriber-conversion-rate-calculator'),('thumbnail-click-through-rate-calculator'),('video-production-cost-calculator'),('video-watch-time-calculator'),('youtube-cpm-revenue-calculator'),
    ('refund-request-rate-calculator'),('self-service-deflection-rate-calculator'),('sla-compliance-rate-calculator'),('support-agent-utilization-calculator'),('support-cost-per-ticket-calculator'),('support-tickets-per-hour-calculator'),('support-training-hours-per-agent-calculator'),('ticket-backlog-calculator'),('ticket-reopen-rate-calculator'),('tickets-per-agent-calculator'),
    ('pixel-height-from-dpi-calculator'),('pixel-width-from-dpi-calculator'),('print-cost-per-copy-calculator'),('print-resolution-dpi-calculator'),('print-run-cost-calculator'),('print-size-with-bleed-calculator'),('render-time-estimator'),('revision-cost-calculator'),('revision-hours-calculator'),('storage-per-design-project-calculator'),
    ('hourly-wage-calculator'),('monthly-hours-worked-calculator'),('net-salary-after-deductions'),('overtime-pay-calculator'),('retirement-years-remaining-calculator'),('salary-deduction-rate-calculator'),('salary-increase-calculator'),('salary-per-working-day-calculator'),('shift-premium-pay'),('unpaid-leave-deduction'),('vacation-pay-estimate'),('weekly-wage-calculator'),('work-hours-per-month-calculator'),
    ('event-staff-ratio-calculator'),('event-ticket-conversion-rate-calculator'),('event-vendor-cost-per-attendee-calculator'),('event-venue-cost-per-attendee-calculator'),('session-attendance-rate-calculator'),('sponsorship-coverage-calculator'),('ticket-break-even-calculator'),('ticket-sell-through-rate-calculator'),('venue-cost-per-attendee-calculator'),('venue-occupancy-rate-calculator'),
    ('freelancer-tax-reserve-calculator'),('late-payment-fee-calculator'),('monthly-client-revenue-average-calculator'),('net-freelance-income-calculator'),('proposal-cost-per-win-calculator'),('proposal-win-rate-calculator'),('recurring-revenue-share-calculator'),('retainer-contract-value-calculator'),('revision-hours-per-project-calculator'),('unpaid-invoice-rate-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code as locale_code, c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave13_slugs w on w.slug = t.slug
  where t.is_active = true and l.code in ('ar','en')
)
update public.tool_translations tt
set
  short_description = x.title || case x.locale_code || ':' || x.category_slug
    when 'ar:agriculture-tools' then ' تساعدك على تقدير مدخل أو معدل زراعي مثل الري أو البذور أو الإنتاج الحيواني. استخدم مساحة ووحدات وفترة قياس متسقة، وقارن النتيجة ببيانات الحقل الفعلية.'
    when 'en:agriculture-tools' then ' helps estimate an agricultural input or rate such as irrigation, seed requirements, or livestock performance. Keep area, units, and measurement periods consistent and compare the result with actual field data.'
    when 'ar:automotive-tools' then ' تساعدك على تقدير تكلفة أو أداء المركبة مثل الوقود والصيانة والاستهلاك والانخفاض في القيمة. استخدم المسافة والفترة والأسعار من الحالة نفسها؛ والنتائج تقديرية وليست عرض تمويل.'
    when 'en:automotive-tools' then ' helps estimate a vehicle cost or performance measure such as fuel, maintenance, usage, or depreciation. Use distance, period, and prices from the same scenario; results are estimates rather than financing offers.'
    when 'ar:bakery-tools' then ' تساعدك على قياس إنتاجية المخبز وتكلفة المكونات والهدر والطاقة الإنتاجية. استخدم الدفعة نفسها ووحدات الوزن والوقت والتكلفة نفسها عند المقارنة.'
    when 'en:bakery-tools' then ' helps measure bakery productivity, ingredient cost, waste, and production capacity. Use the same batch basis and consistent weight, time, and cost units when comparing results.'
    when 'ar:construction-tools' then ' تساعدك على تقدير كمية أو تكلفة تنفيذ مرتبطة بالمواد والمساحات والهدر. أدخل القياسات الفعلية ووحدة السعر نفسها، وأضف هامش تنفيذ مناسب لمتطلبات المشروع.'
    when 'en:construction-tools' then ' helps estimate a construction quantity or cost related to materials, areas, and waste. Enter actual measurements with consistent pricing units and include an appropriate execution allowance for the project.'
    when 'ar:creator-tools' then ' تساعدك على قياس أداء وربحية إنتاج المحتوى من الوقت والمشاهدات والتفاعل والرعاية. استخدم الفترة والمنصة ونطاق المحتوى نفسه حتى تكون المقارنات ذات معنى.'
    when 'en:creator-tools' then ' helps measure content-production performance and economics across time, views, engagement, and sponsorships. Keep the platform, reporting period, and content scope consistent for meaningful comparisons.'
    when 'ar:customer-service-tools' then ' تساعدك على قياس كفاءة خدمة العملاء مثل التذاكر وSLA والتراكم واستخدام الوكلاء. قارن الفترات باستخدام نفس تعريف التذكرة وساعات العمل وقواعد التصعيد.'
    when 'en:customer-service-tools' then ' helps measure customer-service efficiency across tickets, SLA compliance, backlog, and agent utilization. Compare periods using the same ticket definitions, working hours, and escalation rules.'
    when 'ar:design-tools' then ' تساعدك على تقدير مقاس أو دقة أو تكلفة أو زمن إنتاج في أعمال التصميم والطباعة. ثبّت DPI ووحدات الأبعاد وحجم المشروع عند مقارنة النتائج.'
    when 'en:design-tools' then ' helps estimate dimensions, resolution, cost, or production time for design and print work. Keep DPI, dimension units, and project scope consistent when comparing results.'
    when 'ar:employment-tools' then ' تساعدك على تقدير أجر أو ساعات عمل أو خصم وظيفي وفق المدخلات التي تضعها. راجع عقد العمل وسياسة المنشأة والأنظمة المحلية لأن الاستحقاق الفعلي قد يختلف.'
    when 'en:employment-tools' then ' helps estimate pay, work hours, or an employment deduction from the inputs you provide. Check the employment contract, company policy, and applicable local rules because actual entitlement can differ.'
    when 'ar:event-tools' then ' تساعدك على قياس تكلفة أو حضور أو مبيعات أو إشغال الفعالية. استخدم العدد النهائي للحضور والسعة والتكاليف والإيرادات من الفعالية نفسها.'
    when 'en:event-tools' then ' helps measure event cost, attendance, sales, or occupancy. Use final attendee counts, capacity, costs, and revenue from the same event for a consistent result.'
    when 'ar:freelancer-tools' then ' تساعدك على قياس دخل أو تسعير أو كفاءة العمل الحر مثل العروض والفواتير والعقود المتكررة. افصل الإيراد عن المصروفات والرسوم والاحتياطيات عند تفسير النتيجة.'
    when 'en:freelancer-tools' then ' helps measure freelance income, pricing, or operating efficiency across proposals, invoices, and recurring contracts. Separate revenue from expenses, fees, and reserves when interpreting the result.'
    else case when x.locale_code='ar' then ' تساعدك على حساب مؤشر تشغيلي بمدخلات واضحة ومتسقة.' else ' helps calculate an operational metric with clearly defined and consistent inputs.' end
  end,
  seo_description = case
    when x.locale_code = 'ar' then 'استخدم ' || x.title || ' لحساب المؤشر بسرعة مع شرح للمدخلات وطريقة قراءة النتيجة ومقارنتها على أساس بيانات متسقة.'
    else 'Use ' || x.title || ' to calculate the metric quickly with clear input guidance, result interpretation, and consistent comparison principles.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id and tt.locale_id = x.locale_id;
