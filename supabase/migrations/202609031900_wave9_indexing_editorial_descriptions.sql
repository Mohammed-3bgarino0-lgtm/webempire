-- Wave 9 SEO/editorial enrichment for 100 indexable formula tools.
-- Runtime formulas and pricing are unchanged.

with wave9_slugs(slug) as (
  values
    ('ad-budget-pacing-calculator'),('ad-clicks-from-budget-calculator'),('ad-impressions-from-budget-calculator'),('ad-lead-to-sale-rate-calculator'),('ad-request-rpm-calculator'),('ad-rpm-calculator'),('adsense-revenue-estimator'),('advertising-cost-per-reached-user-calculator'),('advertising-profit-calculator'),('break-even-cpa-calculator'),
    ('annual-appliance-energy-cost-calculator'),('annual-energy-savings-calculator'),('appliance-running-cost-calculator'),('battery-backup-hours-calculator'),('battery-usable-capacity-calculator'),('daily-energy-consumption-calculator'),('demand-reduction-rate-calculator'),('effective-electricity-cost-per-kwh-calculator'),('electricity-demand-cost-calculator'),('energy-cost-per-unit-calculator'),
    ('home-rent-per-sqm-calculator'),('home-rent-to-income-ratio-calculator'),('home-water-usage-per-person-calculator'),('lighting-monthly-cost-calculator'),('moving-cost-calculator'),('room-paint-cost-calculator'),('room-volume-calculator'),('solar-payback-period-calculator'),('water-bill-estimator'),('water-heater-monthly-cost-calculator'),
    ('photography-project-price-calculator'),('photography-revenue-per-delivered-photo-calculator'),('photography-session-revenue-per-hour-calculator'),('photography-storage-cost-per-gb-calculator'),('photography-travel-cost-per-session-calculator'),('print-dpi-calculator'),('shooting-day-cost-calculator'),('timelapse-frame-count-calculator'),('timelapse-output-duration-calculator'),('video-storage-calculator'),
    ('retail-rent-cost-rate-calculator'),('retail-reorder-quantity-gap-calculator'),('retail-returned-units-rate-calculator'),('retail-revenue-growth-rate-calculator'),('retail-revenue-per-employee-calculator'),('retail-revenue-per-opening-hour-calculator'),('retail-revenue-per-transaction-calculator'),('retail-sales-per-square-meter-calculator'),('retail-sell-through-rate-calculator'),('retail-shrinkage-rate-calculator'),
    ('seo-indexation-rate-calculator'),('seo-lead-to-customer-rate-calculator'),('seo-nonbrand-click-share-calculator'),('seo-organic-lead-rate-calculator'),('seo-organic-revenue-per-visit-calculator'),('seo-pages-per-keyword-calculator'),('seo-ranking-improvement-rate-calculator'),('seo-traffic-growth-rate-calculator'),('serp-click-share-calculator'),('sitemap-indexation-rate-calculator'),
    ('sustainability-packaging-weight-reduction-rate-calculator'),('sustainability-recycled-material-share-calculator'),('sustainability-renewable-energy-cost-share-calculator'),('sustainability-reuse-rate-calculator'),('sustainability-waste-per-employee-calculator'),('sustainability-water-saved-per-employee-calculator'),('tree-offset-calculator'),('waste-diversion-rate-calculator'),('water-intensity-calculator'),('water-savings-calculator'),
    ('average-recharge-value-calculator'),('bandwidth-utilization-rate-calculator'),('call-setup-success-rate-calculator'),('complaints-per-thousand-subscribers-calculator'),('data-session-success-rate-calculator'),('dropped-call-rate-calculator'),('network-availability-hours-calculator'),('prepaid-recharge-frequency-calculator'),('subscriber-growth-rate-calculator'),('telecom-arpu-calculator'),
    ('attraction-budget-per-day-calculator'),('baggage-overweight-fee-calculator'),('currency-exchange-fee-calculator'),('flight-cost-per-traveler-calculator'),('group-trip-share-calculator'),('hotel-stay-total-calculator'),('hotel-tax-total-calculator'),('itinerary-hours-per-day-calculator'),('local-transport-cost-per-day-calculator'),('luggage-cost-per-traveler-calculator'),
    ('latency-improvement-calculator'),('monthly-bandwidth-calculator'),('page-weight-calculator'),('pageviews-per-session-calculator'),('requests-per-second-calculator'),('server-cost-per-request-calculator'),('server-cost-per-user-calculator'),('successful-request-rate-calculator'),('uptime-percentage-calculator'),('web-availability-minutes-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code as locale_code, c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave9_slugs w on w.slug = t.slug
  where t.is_active = true and l.code in ('ar','en')
)
update public.tool_translations tt
set
  short_description = case
    when x.locale_code = 'ar' then x.title || ' تساعدك على ' || case x.category_slug
      when 'advertising-tools' then 'تحليل ميزانية الإعلان والوصول والنقرات والعائد بمقاييس قابلة للمقارنة. استخدم بيانات الحملة من الفترة والمنصة نفسها، وافصل الإيراد عن الإنفاق والعمولات عند قراءة النتيجة.'
      when 'energy-tools' then 'تقدير استهلاك الطاقة والتكلفة أو السعة باستخدام وحدات زمن وقدرة متسقة. راجع الكيلوواط والكيلوواط ساعة وسعر الوحدة قبل الاعتماد على النتيجة.'
      when 'home-tools' then 'تقدير تكلفة أو استهلاك منزلي محدد مثل الإيجار أو الماء أو الإضاءة أو النقل. استخدم المساحة والمدة والتعرفة الفعلية لحالتك للحصول على تقدير أقرب للواقع.'
      when 'photography-tools' then 'حساب مؤشر تصوير متعلق بالتسعير أو التخزين أو الدقة أو زمن الإنتاج. وحّد عدد الصور وحجم الملفات وساعات العمل والتكاليف المستخدمة في المشروع نفسه.'
      when 'retail-tools' then 'قياس أداء التجزئة من المبيعات والمخزون والعوائد والتكاليف التشغيلية. استخدم نفس الفرع والفترة الزمنية عند مقارنة الإيرادات والمخزون وساعات العمل.'
      when 'seo-tools' then 'قياس مؤشر SEO مثل الفهرسة أو الزيارات أو النقرات أو التحويلات. اعتمد على الفترة نفسها ومصدر بيانات ثابت مثل Search Console أو التحليلات عند المقارنة.'
      when 'sustainability-tools' then 'حساب مؤشر استدامة متعلق بالطاقة أو الماء أو النفايات أو المواد المعاد تدويرها. وثّق عامل القياس والوحدة والفترة لأن اختلافها يغير معنى النتيجة.'
      when 'telecom-tools' then 'قياس أداء اتصالات متعلق بالمشتركين أو الشبكة أو الاستخدام أو الإيراد. استخدم نفس قاعدة المشتركين والفترة ووحدة الاستخدام عند تفسير المعدلات.'
      when 'travel-tools' then 'تقدير تكلفة سفر أو حصة فردية أو رسوم مرتبطة بالرحلة. أدخل الأسعار والضرائب وعدد المسافرين والأيام من الرحلة نفسها لتجنب خلط فترات أو عملات مختلفة.'
      when 'web-tools' then 'قياس أداء موقع أو خادم مثل السرعة أو الطلبات أو النطاق الترددي أو التوافر. حافظ على وحدة الزمن وحجم البيانات نفسها، وميّز المتوسط عن الذروة.'
      else 'حساب مؤشر تشغيلي بمدخلات واضحة ومتسقة.'
    end
    else x.title || ' helps you ' || case x.category_slug
      when 'advertising-tools' then 'analyze ad budget, reach, clicks, and return using comparable campaign metrics. Use figures from the same platform and reporting period, and separate revenue, spend, and fees when interpreting the result.'
      when 'energy-tools' then 'estimate energy consumption, cost, or capacity with consistent power and time units. Check kilowatts, kilowatt-hours, runtime, and unit price before relying on the estimate.'
      when 'home-tools' then 'estimate a specific household cost or usage measure such as rent, water, lighting, or moving expenses. Use the actual area, duration, and tariff that match your situation.'
      when 'photography-tools' then 'calculate a photography metric related to pricing, storage, resolution, or production time. Keep photo counts, file sizes, work hours, and project costs on the same job basis.'
      when 'retail-tools' then 'measure retail performance across sales, inventory, returns, and operating costs. Compare figures from the same store and reporting period for meaningful results.'
      when 'seo-tools' then 'measure an SEO metric such as indexation, traffic, clicks, rankings, or conversions. Use a consistent date range and data source such as Search Console or analytics.'
      when 'sustainability-tools' then 'calculate a sustainability metric involving energy, water, waste, or recycled materials. Document the measurement factor, unit, and period because changes in any of them alter the meaning of the result.'
      when 'telecom-tools' then 'measure a telecom metric involving subscribers, network performance, usage, or revenue. Keep the subscriber base, reporting period, and usage units consistent.'
      when 'travel-tools' then 'estimate a travel cost, per-person share, or trip fee. Use prices, taxes, traveler counts, and days from the same trip and avoid mixing currencies without conversion.'
      when 'web-tools' then 'measure a website or server metric such as speed, requests, bandwidth, cost, or availability. Keep time and data-size units consistent and distinguish average load from peak traffic.'
      else 'calculate an operational metric with clearly defined inputs.'
    end
  end,
  seo_description = case
    when x.locale_code = 'ar' then 'استخدم ' || x.title || ' لحساب المؤشر بسرعة مع شرح واضح للمدخلات وطريقة تفسير النتيجة ومقارنتها على أساس بيانات متسقة.'
    else 'Use ' || x.title || ' to calculate the metric quickly with clear input guidance, result interpretation, and consistent comparison principles.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id and tt.locale_id = x.locale_id;
