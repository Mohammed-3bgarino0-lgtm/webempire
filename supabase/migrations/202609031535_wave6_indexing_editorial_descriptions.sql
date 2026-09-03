-- Wave 6 SEO/editorial enrichment for the 100 indexable tools.
-- Keeps formulas and runtime behavior unchanged; improves visible and meta descriptions.

with wave6_slugs(slug) as (
  values
    ('break-even-calculator'),
    ('business-customer-acquisition-cost-calculator'),
    ('business-markup-percentage-calculator'),
    ('capacity-utilization-calculator'),
    ('cash-conversion-cycle-calculator'),
    ('contribution-margin-per-unit'),
    ('contribution-margin-ratio-calculator'),
    ('customer-churn-rate-calculator'),
    ('customer-concentration-calculator'),
    ('customer-retention-rate-calculator'),
    ('average-order-value-calculator'),
    ('break-even-orders-calculator'),
    ('cart-abandonment-rate-calculator'),
    ('checkout-completion-rate-calculator'),
    ('coupon-redemption-rate-calculator'),
    ('customer-acquisition-payback-orders-calculator'),
    ('customer-lifetime-value-basic-calculator'),
    ('customer-retention-rate-basic-calculator'),
    ('ecommerce-average-items-per-order-calculator'),
    ('ecommerce-cart-recovery-value-calculator'),
    ('ad-frequency-calculator'),
    ('aov-calculator'),
    ('campaign-profit-calculator'),
    ('campaign-profit-margin-calculator'),
    ('campaign-revenue-per-lead-calculator'),
    ('conversion-rate-calculator'),
    ('cpa-calculator'),
    ('cpc-calculator'),
    ('cpm-calculator'),
    ('ctr-calculator'),
    ('automation-time-saved-calculator'),
    ('backlog-clearance-days-calculator'),
    ('context-switching-time-cost-calculator'),
    ('deadline-buffer-calculator'),
    ('deep-work-percentage-calculator'),
    ('focus-ratio-calculator'),
    ('interruptions-per-hour-calculator'),
    ('meeting-cost-calculator'),
    ('planned-actual-time-variance-calculator'),
    ('pomodoro-session-calculator'),
    ('api-error-rate-calculator'),
    ('api-throughput-per-minute-calculator'),
    ('average-payload-size-calculator'),
    ('average-response-time-calculator'),
    ('bandwidth-per-user-calculator'),
    ('bounce-rate-reduction-calculator'),
    ('cache-hit-rate-calculator'),
    ('cdn-offload-rate-calculator'),
    ('conversion-uplift-calculator'),
    ('data-transfer-cost-calculator'),
    ('average-delivery-distance-calculator'),
    ('delivery-cost-per-order-calculator'),
    ('delivery-route-cost-calculator'),
    ('dock-to-stock-average-hours-calculator'),
    ('failed-delivery-rate-calculator'),
    ('first-attempt-delivery-rate-calculator'),
    ('freight-cost-per-kg-calculator'),
    ('fuel-cost-per-km-calculator'),
    ('inventory-carrying-cost-calculator'),
    ('logistics-cost-per-delivery-calculator'),
    ('defect-cost-calculator'),
    ('first-time-through-rate-calculator'),
    ('machine-downtime-rate-calculator'),
    ('machine-utilization-rate-calculator'),
    ('manufacturing-bottleneck-loss-rate-calculator'),
    ('manufacturing-capacity-gap-calculator'),
    ('manufacturing-capacity-utilization-rate-calculator'),
    ('manufacturing-changeover-time-share-calculator'),
    ('manufacturing-cycle-time-calculator'),
    ('manufacturing-direct-material-yield-rate-calculator'),
    ('average-check-calculator'),
    ('average-table-revenue-calculator'),
    ('beverage-cost-percentage-calculator'),
    ('delivery-order-contribution-calculator'),
    ('delivery-platform-fee-calculator'),
    ('dish-contribution-margin-calculator'),
    ('food-cost-percentage-calculator'),
    ('food-wastage-rate-calculator'),
    ('ingredient-yield-rate-calculator'),
    ('kitchen-waste-cost-per-day-calculator'),
    ('cost-performance-index-calculator'),
    ('earned-cost-variance-calculator'),
    ('earned-schedule-variance-calculator'),
    ('earned-value-calculator'),
    ('estimate-at-completion-calculator'),
    ('estimate-to-complete-calculator'),
    ('milestone-on-time-rate-calculator'),
    ('planned-value-calculator'),
    ('project-budget-variance-calculator'),
    ('project-burn-rate-calculator'),
    ('average-deal-size-calculator'),
    ('average-sales-cycle-calculator'),
    ('contract-renewal-rate-calculator'),
    ('cost-per-qualified-lead-calculator'),
    ('cross-sell-revenue-calculator'),
    ('lead-response-time-calculator'),
    ('lead-to-opportunity-rate-calculator'),
    ('opportunity-to-close-rate-calculator'),
    ('pipeline-coverage-calculator'),
    ('proposal-acceptance-rate-calculator')
), targets as (
  select
    tt.tool_id,
    tt.locale_id,
    tt.title,
    l.code as locale_code,
    c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave6_slugs w on w.slug = t.slug
  where t.is_active = true
    and l.code in ('ar', 'en')
)
update public.tool_translations tt
set
  short_description = case
    when x.locale_code = 'ar' then
      x.title || ' تساعدك على قياس ' ||
      case x.category_slug
        when 'business-tools' then 'مؤشر أعمال محدد باستخدام مدخلات واضحة من الإيرادات والتكاليف والعملاء أو الطاقة التشغيلية بحسب نوع الحاسبة. استخدم نفس الفترة الزمنية لجميع القيم وقارن النتيجة بفترة سابقة أو هدف داخلي لفهم معناها.'
        when 'ecommerce-tools' then 'مؤشر تجارة إلكترونية مرتبط بالطلبات والعملاء والتحويل أو تكلفة المتجر. أدخل أرقام الفترة نفسها وافصل بين الطلبات المكتملة والمرتجعات والتخفيضات حتى تعكس النتيجة أداء المتجر الفعلي.'
        when 'marketing-tools' then 'مؤشر تسويقي للحملة أو القناة مثل التكلفة أو النقر أو التحويل أو العائد. استخدم بيانات من المصدر نفسه والفترة نفسها حتى تكون المقارنة بين الحملات والقنوات عادلة.'
        when 'productivity-tools' then 'مؤشر إنتاجية مرتبط بالوقت والمهام والتركيز والاجتماعات. سجّل الوقت الفعلي قدر الإمكان، ثم استخدم النتيجة للمقارنة والتحسين بدل اعتبارها حكمًا منفردًا على الأداء.'
        when 'web-tools' then 'مؤشر أداء ويب أو API يتعلق بالطلبات أو الاستجابة أو النطاق الترددي أو الكلفة. وحّد وحدة الزمن وحجم البيانات، وميّز بين متوسط الأداء وقيم الذروة عند تفسير النتيجة.'
        when 'logistics-tools' then 'مؤشر لوجستي للتوصيل أو النقل أو المخزون أو التكلفة. استخدم نفس تعريف الشحنة أو الطلب والمسافة والفترة في جميع المدخلات حتى تحصل على تكلفة أو معدل قابل للمقارنة.'
        when 'manufacturing-tools' then 'مؤشر تصنيع يتعلق بالطاقة الإنتاجية أو الجودة أو التوقف أو زمن الدورة. افصل الوحدات الجيدة عن المعيبة، ووحّد الوردية أو الساعة أو الدفعة المستخدمة في المدخلات.'
        when 'restaurant-tools' then 'مؤشر تشغيل مطعم مرتبط بالمبيعات أو تكلفة الطعام أو الطلبات أو الهدر. استخدم مبيعات وتكاليف الفترة نفسها، وميّز بين تكلفة المكونات والتكاليف التشغيلية الأخرى.'
        when 'project-management-tools' then 'مؤشر إدارة مشروع يقارن الخطة بالتنفيذ أو التكلفة بالإنجاز. تأكد أن القيم تنتمي إلى نقطة القياس نفسها في المشروع حتى تكون مؤشرات القيمة المكتسبة والانحرافات ذات معنى.'
        when 'sales-tools' then 'مؤشر مبيعات مرتبط بالصفقات أو الفرص أو العملاء المحتملين أو دورة البيع. استخدم تعريفًا ثابتًا للفرصة والصفقة والفترة حتى تكون معدلات التحويل والتغطية قابلة للمقارنة.'
        else 'مؤشر تشغيلي باستخدام مدخلات واضحة وقابلة للتحقق. راجع وحدة القياس والفترة قبل الاعتماد على النتيجة.'
      end
    else
      x.title || ' measures ' ||
      case x.category_slug
        when 'business-tools' then 'a focused business metric using revenue, cost, customer, or capacity inputs appropriate to the calculator. Keep every input on the same time basis and compare the result with a prior period or internal target.'
        when 'ecommerce-tools' then 'an ecommerce metric tied to orders, customers, conversion, or store economics. Use data from the same period and distinguish completed orders, returns, discounts, and fees so the result reflects actual store performance.'
        when 'marketing-tools' then 'a campaign or channel metric such as cost, clicks, conversion, or return. Use figures from the same reporting source and date range so comparisons across campaigns remain meaningful.'
        when 'productivity-tools' then 'a productivity metric based on time, tasks, focus, or meetings. Prefer measured time over rough estimates and use the result for trend comparison rather than as a standalone judgment of performance.'
        when 'web-tools' then 'a web or API performance metric involving requests, response time, bandwidth, or cost. Keep time and data-size units consistent and distinguish typical performance from peak traffic when interpreting the result.'
        when 'logistics-tools' then 'a logistics metric for delivery, transport, inventory, or cost. Use a consistent definition of shipment, order, distance, and reporting period so the resulting rate or unit cost is comparable.'
        when 'manufacturing-tools' then 'a manufacturing metric related to capacity, quality, downtime, or cycle time. Separate good output from defective output and keep the shift, hour, or batch basis consistent across inputs.'
        when 'restaurant-tools' then 'a restaurant operating metric tied to sales, food cost, orders, or waste. Use revenue and cost figures from the same period and separate ingredient cost from other operating expenses.'
        when 'project-management-tools' then 'a project metric comparing plan, execution, cost, or earned progress. Make sure all values refer to the same project status date so earned-value and variance results remain meaningful.'
        when 'sales-tools' then 'a sales metric tied to deals, opportunities, leads, or sales-cycle activity. Keep definitions of lead, opportunity, deal, and reporting period consistent so conversion and pipeline measures can be compared.'
        else 'an operational metric using clearly defined inputs. Check the measurement unit and reporting period before relying on the result.'
      end
  end,
  seo_description = case
    when x.locale_code = 'ar' then
      'استخدم ' || x.title || ' لحساب المؤشر بسرعة مع شرح عملي للمدخلات وطريقة قراءة النتيجة. مناسبة للمقارنة بين الفترات واتخاذ قرارات تشغيلية مبنية على أرقام متسقة.'
    else
      'Use ' || x.title || ' to calculate the metric quickly with practical input guidance and result interpretation. Useful for consistent period-over-period operational comparisons.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id
  and tt.locale_id = x.locale_id;
