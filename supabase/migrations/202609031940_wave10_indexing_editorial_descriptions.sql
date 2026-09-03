-- Wave 10 SEO/editorial enrichment for 100 indexable formula tools.
-- Runtime formulas, pricing, and authentication behavior are unchanged.

with wave10_slugs(slug) as (
  values
    ('hospitality-no-show-rate-calculator'),('hospitality-refund-rate-calculator'),('hospitality-revenue-per-guest-calculator'),('hospitality-room-service-revenue-per-order-calculator'),('hospitality-staff-cost-share-calculator'),('hospitality-utility-cost-per-occupied-room-calculator'),('hotel-cancellation-rate-calculator'),('hotel-food-beverage-revenue-per-guest-calculator'),('hotel-housekeeping-cost-per-room-calculator'),('hotel-labor-cost-per-occupied-room-calculator'),
    ('logistics-cost-per-km-calculator'),('logistics-cost-per-shipment-calculator'),('logistics-damage-rate-calculator'),('logistics-delivery-attempt-success-rate-calculator'),('logistics-empty-mile-rate-calculator'),('logistics-fuel-cost-share-calculator'),('logistics-load-utilization-calculator'),('logistics-lost-shipment-rate-calculator'),('logistics-on-time-delivery-rate-calculator'),('logistics-return-shipment-rate-calculator'),
    ('manufacturing-energy-cost-per-unit-calculator'),('manufacturing-good-units-per-hour-calculator'),('manufacturing-labor-cost-per-unit-calculator'),('manufacturing-maintenance-cost-per-unit-calculator'),('manufacturing-material-cost-per-unit-calculator'),('manufacturing-order-completion-rate-calculator'),('manufacturing-output-per-worker-calculator'),('manufacturing-rework-cost-rate-calculator'),('manufacturing-throughput-per-hour-calculator'),('overall-equipment-effectiveness-calculator'),
    ('procurement-expedited-order-rate-calculator'),('procurement-lead-time-calculator'),('procurement-order-frequency-calculator'),('procurement-return-rate-calculator'),('procurement-savings-rate-calculator'),('procurement-spend-per-supplier-calculator'),('purchase-order-accuracy-rate-calculator'),('purchase-order-error-rate-calculator'),('purchase-price-variance-calculator'),('spend-under-management-calculator'),
    ('escape-defect-rate-calculator'),('first-pass-yield-calculator'),('inspection-cost-per-unit-calculator'),('inspection-pass-rate-calculator'),('nonconformance-cost-per-case-calculator'),('nonconformance-rate-calculator'),('process-conformance-rate-calculator'),('quality-acceptance-rate-calculator'),('quality-audit-pass-rate-calculator'),('quality-cost-per-unit-calculator'),
    ('rental-delivery-cost-per-booking-calculator'),('rental-deposit-refund-rate-calculator'),('rental-discount-rate-calculator'),('rental-extension-rate-calculator'),('rental-fleet-revenue-per-asset-calculator'),('rental-idle-days-calculator'),('rental-insurance-cost-per-day-calculator'),('rental-late-fee-calculator'),('rental-maintenance-cost-rate-calculator'),('rental-net-margin-calculator'),
    ('menu-item-contribution-rate-calculator'),('menu-price-from-food-cost-calculator'),('recipe-cost-per-serving-calculator'),('restaurant-average-check-calculator'),('restaurant-break-even-covers-calculator'),('restaurant-break-even-orders-calculator'),('restaurant-delivery-order-share-calculator'),('restaurant-food-cost-rate-calculator'),('restaurant-labor-cost-per-cover-calculator'),('restaurant-labor-cost-percentage-calculator'),
    ('saas-discount-rate-calculator'),('saas-expansion-mrr-rate-calculator'),('saas-feature-adoption-rate-calculator'),('saas-freemium-conversion-rate-calculator'),('saas-gross-margin-calculator'),('saas-infrastructure-cost-per-customer-calculator'),('saas-ltv-cac-ratio-calculator'),('saas-ltv-calculator'),('saas-magic-number-calculator'),('saas-monthly-logo-retention-calculator'),
    ('salon-consumables-cost-per-service-calculator'),('salon-customer-retention-rate-calculator'),('salon-daily-capacity-calculator'),('salon-discount-rate-calculator'),('salon-labor-cost-share-calculator'),('salon-membership-revenue-share-calculator'),('salon-new-client-conversion-calculator'),('salon-no-show-rate-calculator'),('salon-product-attachment-rate-calculator'),('salon-product-revenue-share-calculator'),
    ('startup-cash-need-calculator'),('startup-customer-growth-rate-calculator'),('startup-equity-dilution-calculator'),('startup-equity-value-per-percent-calculator'),('startup-funding-gap-calculator'),('startup-funding-runway-calculator'),('startup-gross-burn-calculator'),('startup-hiring-runway-impact-calculator'),('startup-marketing-spend-share-calculator'),('startup-monthly-cash-change-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code as locale_code, c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave10_slugs w on w.slug = t.slug
  where t.is_active = true and l.code in ('ar','en')
)
update public.tool_translations tt
set
  short_description = case
    when x.locale_code = 'ar' then x.title || ' تساعدك على ' || case x.category_slug
      when 'hospitality-tools' then 'قياس أداء الضيافة من الحجوزات والإيرادات والتكاليف لكل ضيف أو غرفة مشغولة. استخدم بيانات الفترة نفسها وافصل بين الإيرادات الأساسية والإضافية عند المقارنة.'
      when 'logistics-tools' then 'تحليل تكلفة وجودة النقل والتوصيل مثل التكلفة لكل شحنة، الاستفادة من الحمولة، التسليم في الموعد، والمرتجعات. وحّد تعريف الشحنة والمسافة والفترة الزمنية.'
      when 'manufacturing-tools' then 'قياس كفاءة التصنيع من الطاقة والعمالة والمواد والإنتاجية وإعادة العمل. استخدم نفس أساس الوحدة أو الساعة أو الدفعة حتى تكون النتيجة قابلة للمقارنة.'
      when 'procurement-tools' then 'تحليل دورة الشراء والدقة والتوفير والإنفاق على الموردين. استخدم نفس الفترة وتعريف أمر الشراء والمورد عند تفسير المعدلات والانحرافات.'
      when 'quality-tools' then 'قياس الجودة من العيوب والفحص والمطابقة والتكلفة لكل وحدة أو حالة. افصل الوحدات المقبولة عن المرفوضة واستخدم قاعدة قياس ثابتة.'
      when 'rental-business-tools' then 'قياس ربحية وتشغيل نشاط التأجير من الحجوزات والأيام الخاملة والخصومات والصيانة والإيراد لكل أصل. استخدم نفس الأصل والفترة عند المقارنة.'
      when 'restaurant-tools' then 'تحليل تسعير وربحية المطعم من تكلفة الوصفة والطعام والعمالة ومتوسط الفاتورة ونقطة التعادل. استخدم تكاليف ومبيعات الفترة نفسها.'
      when 'saas-tools' then 'قياس اقتصاديات SaaS من MRR والاحتفاظ والتبني والهامش وLTV وCAC. حافظ على تعريف العميل والإيراد والفترة نفسها عند المقارنة بين المؤشرات.'
      when 'salon-tools' then 'قياس تشغيل وربحية الصالون من السعة والاحتفاظ وعدم الحضور والعمالة ومبيعات المنتجات. استخدم عدد المواعيد والعملاء والإيرادات للفترة نفسها.'
      when 'startup-tools' then 'تحليل مؤشرات شركة ناشئة مثل السيولة والنمو والتمويل والحرق والتخفيف في الملكية. النتائج تقديرية وتناسب التخطيط والسيناريوهات، وليست تقييمًا استثماريًا نهائيًا.'
      else 'حساب مؤشر تشغيلي بمدخلات واضحة ومتسقة.'
    end
    else x.title || ' helps you ' || case x.category_slug
      when 'hospitality-tools' then 'measure hospitality performance across bookings, revenue, and costs per guest or occupied room. Use figures from the same period and separate core room revenue from ancillary revenue.'
      when 'logistics-tools' then 'analyze transport and delivery cost and quality, including cost per shipment, load utilization, on-time delivery, losses, and returns. Keep shipment, distance, and period definitions consistent.'
      when 'manufacturing-tools' then 'measure manufacturing efficiency across energy, labor, materials, throughput, and rework. Use a consistent unit, hour, shift, or batch basis for every input.'
      when 'procurement-tools' then 'analyze purchasing cycle time, order accuracy, savings, and supplier spend. Keep the reporting period and definitions of supplier and purchase order consistent.'
      when 'quality-tools' then 'measure quality through defects, inspection, conformance, and cost per unit or case. Separate accepted and rejected output and keep the measurement base consistent.'
      when 'rental-business-tools' then 'measure rental operating performance through bookings, idle days, discounts, maintenance, and revenue per asset. Compare results on the same asset and reporting period basis.'
      when 'restaurant-tools' then 'analyze restaurant pricing and profitability through recipe cost, food cost, labor, average check, and break-even volume. Use costs and sales from the same period.'
      when 'saas-tools' then 'measure SaaS economics across MRR, retention, adoption, margin, LTV, and CAC. Keep customer, revenue, and reporting-period definitions consistent across metrics.'
      when 'salon-tools' then 'measure salon operations and profitability across capacity, retention, no-shows, labor, and product sales. Use appointments, clients, and revenue from the same reporting period.'
      when 'startup-tools' then 'analyze startup planning metrics such as cash needs, growth, funding runway, burn, and equity dilution. Results are scenario estimates for planning and are not a definitive investment valuation.'
      else 'calculate an operational metric with clearly defined inputs.'
    end
  end,
  seo_description = case
    when x.locale_code = 'ar' then 'استخدم ' || x.title || ' لحساب المؤشر بسرعة مع شرح واضح للمدخلات وطريقة تفسير النتيجة ومقارنتها باستخدام بيانات متسقة.'
    else 'Use ' || x.title || ' to calculate the metric quickly with clear input guidance, result interpretation, and consistent comparison principles.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id and tt.locale_id = x.locale_id;
