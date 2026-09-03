-- Enrich only Wave 6 SEO descriptions. Tool formulas, titles and short descriptions remain unchanged.
update public.tool_translations tt
set seo_description = case
  when l.code = 'ar' then concat(
    tt.short_description,
    case c.slug
      when 'business-tools' then ' استخدم النتيجة لمقارنة التكاليف والهوامش والكفاءة التشغيلية ضمن الفترة نفسها.'
      when 'ecommerce-tools' then ' يساعدك المؤشر على متابعة أداء الطلبات والتحويل والاحتفاظ بالعملاء باستخدام بيانات الفترة نفسها.'
      when 'marketing-tools' then ' قارن الحملات والفترات باستخدام تعريف ثابت للنقرات والتحويلات والتكلفة والإيراد.'
      when 'productivity-tools' then ' استخدم النتيجة لمقارنة الوقت المخطط والمنجز وتحديد فرص تحسين سير العمل.'
      when 'web-tools' then ' استخدم المؤشر لمتابعة أداء الموقع والطلبات والموثوقية مع توحيد الفترة ووحدات القياس.'
      when 'logistics-tools' then ' قارن التكلفة والمسافة والطلبات ومعدلات التسليم ضمن نفس الفترة التشغيلية.'
      when 'manufacturing-tools' then ' استخدم نفس فترة الإنتاج وتعريف الوحدات عند مقارنة الطاقة والتوقف والهدر والإنتاجية.'
      when 'restaurant-tools' then ' يساعدك القياس على مقارنة الإيراد والتكلفة والهدر وكفاءة الخدمة باستخدام نفس فترة التشغيل.'
      when 'project-management-tools' then ' قارن الخطة والتنفيذ باستخدام خط أساس واحد للميزانية والجدول ونسبة الإنجاز.'
      when 'sales-tools' then ' استخدم تعريفًا ثابتًا للعملاء المحتملين والفرص والصفقات عند مقارنة أداء المبيعات.'
      else ''
    end
  )
  when l.code = 'en' then concat(
    tt.short_description,
    case c.slug
      when 'business-tools' then ' Use the result to compare costs, margins, and operating efficiency over the same period.'
      when 'ecommerce-tools' then ' Use the metric to track order, conversion, and retention performance with a consistent reporting period.'
      when 'marketing-tools' then ' Compare campaigns and periods using consistent definitions for clicks, conversions, cost, and revenue.'
      when 'productivity-tools' then ' Use the result to compare planned and completed time and identify workflow improvement opportunities.'
      when 'web-tools' then ' Use the metric to monitor website performance, requests, and reliability with consistent units and periods.'
      when 'logistics-tools' then ' Compare cost, distance, orders, and delivery rates over the same operating period.'
      when 'manufacturing-tools' then ' Use the same production period and unit definitions when comparing capacity, downtime, waste, and throughput.'
      when 'restaurant-tools' then ' Use the metric to compare revenue, cost, waste, and service efficiency over the same operating period.'
      when 'project-management-tools' then ' Compare plan and execution using one baseline for budget, schedule, and completion.'
      when 'sales-tools' then ' Use consistent definitions for leads, opportunities, and deals when comparing sales performance.'
      else ''
    end
  )
  else tt.seo_description
end,
updated_at = now()
from public.tools t
join public.categories c on c.id = t.category_id
join public.locales l on l.id = tt.locale_id
where tt.tool_id = t.id
  and l.code in ('ar','en')
  and t.slug in (
    'break-even-calculator','business-customer-acquisition-cost-calculator','business-markup-percentage-calculator','capacity-utilization-calculator','cash-conversion-cycle-calculator','contribution-margin-per-unit','contribution-margin-ratio-calculator','customer-churn-rate-calculator','customer-concentration-calculator','customer-retention-rate-calculator',
    'average-order-value-calculator','break-even-orders-calculator','cart-abandonment-rate-calculator','checkout-completion-rate-calculator','coupon-redemption-rate-calculator','customer-acquisition-payback-orders-calculator','customer-lifetime-value-basic-calculator','customer-retention-rate-basic-calculator','ecommerce-average-items-per-order-calculator','ecommerce-cart-recovery-value-calculator',
    'ad-frequency-calculator','aov-calculator','campaign-profit-calculator','campaign-profit-margin-calculator','campaign-revenue-per-lead-calculator','conversion-rate-calculator','cpa-calculator','cpc-calculator','cpm-calculator','ctr-calculator',
    'automation-time-saved-calculator','backlog-clearance-days-calculator','context-switching-time-cost-calculator','deadline-buffer-calculator','deep-work-percentage-calculator','focus-ratio-calculator','interruptions-per-hour-calculator','meeting-cost-calculator','planned-actual-time-variance-calculator','pomodoro-session-calculator',
    'api-error-rate-calculator','api-throughput-per-minute-calculator','average-payload-size-calculator','average-response-time-calculator','bandwidth-per-user-calculator','bounce-rate-reduction-calculator','cache-hit-rate-calculator','cdn-offload-rate-calculator','conversion-uplift-calculator','data-transfer-cost-calculator',
    'average-delivery-distance-calculator','delivery-cost-per-order-calculator','delivery-route-cost-calculator','dock-to-stock-average-hours-calculator','failed-delivery-rate-calculator','first-attempt-delivery-rate-calculator','freight-cost-per-kg-calculator','fuel-cost-per-km-calculator','inventory-carrying-cost-calculator','logistics-cost-per-delivery-calculator',
    'defect-cost-calculator','first-time-through-rate-calculator','machine-downtime-rate-calculator','machine-utilization-rate-calculator','manufacturing-bottleneck-loss-rate-calculator','manufacturing-capacity-gap-calculator','manufacturing-capacity-utilization-rate-calculator','manufacturing-changeover-time-share-calculator','manufacturing-cycle-time-calculator','manufacturing-direct-material-yield-rate-calculator',
    'average-check-calculator','average-table-revenue-calculator','beverage-cost-percentage-calculator','delivery-order-contribution-calculator','delivery-platform-fee-calculator','dish-contribution-margin-calculator','food-cost-percentage-calculator','food-wastage-rate-calculator','ingredient-yield-rate-calculator','kitchen-waste-cost-per-day-calculator',
    'cost-performance-index-calculator','earned-cost-variance-calculator','earned-schedule-variance-calculator','earned-value-calculator','estimate-at-completion-calculator','estimate-to-complete-calculator','milestone-on-time-rate-calculator','planned-value-calculator','project-budget-variance-calculator','project-burn-rate-calculator',
    'average-deal-size-calculator','average-sales-cycle-calculator','contract-renewal-rate-calculator','cost-per-qualified-lead-calculator','cross-sell-revenue-calculator','lead-response-time-calculator','lead-to-opportunity-rate-calculator','opportunity-to-close-rate-calculator','pipeline-coverage-calculator','proposal-acceptance-rate-calculator'
  );
