-- Wave 8 SEO/editorial enrichment for the 100 newly indexable formula tools.
-- Runtime, formulas, pricing and auth behavior remain unchanged.

with wave8_slugs(slug) as (
  values
    ('average-unit-volume-calculator'),
    ('franchise-average-ticket-calculator'),
    ('franchise-break-even-months-calculator'),
    ('franchise-break-even-sales-calculator'),
    ('franchise-contribution-after-fees-calculator'),
    ('franchise-fee-recovery-period-calculator'),
    ('franchise-gross-margin-calculator'),
    ('franchise-labor-cost-rate-calculator'),
    ('franchise-marketing-cost-per-location-calculator'),
    ('franchise-marketing-fund-calculator'),
    ('average-daily-rate-calculator'),
    ('booking-channel-commission-rate-calculator'),
    ('breakfast-cost-per-guest-calculator'),
    ('direct-booking-rate-calculator'),
    ('guest-acquisition-cost-calculator'),
    ('guest-repeat-rate-calculator'),
    ('hospitality-booking-conversion-rate-calculator'),
    ('hospitality-booking-lead-time-calculator'),
    ('hospitality-direct-booking-share-calculator'),
    ('hospitality-guest-repeat-rate-calculator'),
    ('applicants-per-vacancy-calculator'),
    ('benefits-cost-per-employee-calculator'),
    ('cost-per-hire-calculator'),
    ('employee-absence-rate-calculator'),
    ('employee-retention-rate-calculator'),
    ('employee-turnover-rate-calculator'),
    ('internal-promotion-rate-calculator'),
    ('interview-to-offer-rate-calculator'),
    ('manager-span-of-control-calculator'),
    ('new-hire-90-day-retention-calculator'),
    ('downtime-cost-calculator'),
    ('emergency-maintenance-rate-calculator'),
    ('equipment-availability-calculator'),
    ('maintenance-backlog-weeks-calculator'),
    ('maintenance-contract-cost-per-asset-calculator'),
    ('maintenance-cost-per-asset-calculator'),
    ('maintenance-cost-to-replacement-value-calculator'),
    ('maintenance-hours-per-asset-calculator'),
    ('maintenance-inspection-finding-rate-calculator'),
    ('maintenance-inspection-hours-per-asset-calculator'),
    ('average-procurement-order-value-calculator'),
    ('catalog-adoption-rate-calculator'),
    ('contract-savings-rate-calculator'),
    ('cost-avoidance-calculator'),
    ('early-payment-discount-savings-calculator'),
    ('maverick-spend-rate-calculator'),
    ('procurement-contract-savings-calculator'),
    ('procurement-cost-per-order-calculator'),
    ('procurement-cost-per-supplier-calculator'),
    ('procurement-cycle-time-calculator'),
    ('audit-finding-closure-rate-calculator'),
    ('calibration-compliance-rate-calculator'),
    ('corrective-action-closure-days-calculator'),
    ('corrective-action-closure-rate-calculator'),
    ('cost-of-poor-quality-calculator'),
    ('customer-complaint-rate-calculator'),
    ('customer-defect-return-rate-calculator'),
    ('defect-cost-per-unit-calculator'),
    ('defect-rate-calculator'),
    ('defects-per-million-opportunities-calculator'),
    ('average-rental-duration-calculator'),
    ('maintenance-cost-per-rental-calculator'),
    ('rental-add-on-revenue-share-calculator'),
    ('rental-asset-downtime-rate-calculator'),
    ('rental-asset-yield-calculator'),
    ('rental-average-rental-duration-calculator'),
    ('rental-booking-cancellation-rate-calculator'),
    ('rental-booking-conversion-calculator'),
    ('rental-cleaning-cost-per-booking-calculator'),
    ('rental-damage-rate-calculator'),
    ('annual-recurring-revenue-calculator'),
    ('gross-revenue-retention-calculator'),
    ('monthly-recurring-revenue-calculator'),
    ('net-revenue-retention-calculator'),
    ('saas-activation-rate-calculator'),
    ('saas-annual-prepay-share-calculator'),
    ('saas-arpu-calculator'),
    ('saas-cac-calculator'),
    ('saas-cac-payback-calculator'),
    ('saas-customer-churn-rate-calculator'),
    ('salon-appointment-cancellation-rate-calculator'),
    ('salon-appointment-fill-rate-calculator'),
    ('salon-average-service-duration-calculator'),
    ('salon-average-service-time-calculator'),
    ('salon-average-ticket-calculator'),
    ('salon-break-even-appointments-calculator'),
    ('salon-cancellation-rate-calculator'),
    ('salon-chair-revenue-per-hour-calculator'),
    ('salon-chair-utilization-calculator'),
    ('salon-client-frequency-calculator'),
    ('founder-dilution-calculator'),
    ('founder-equity-value-calculator'),
    ('investor-equity-percentage-calculator'),
    ('post-money-valuation-calculator'),
    ('pre-money-valuation-from-post-money-calculator'),
    ('startup-break-even-customers-calculator'),
    ('startup-break-even-revenue-calculator'),
    ('startup-burn-multiple-calculator'),
    ('startup-capital-efficiency-calculator'),
    ('startup-cash-burn-per-employee-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code as locale_code, c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave8_slugs w on w.slug = t.slug
  where t.is_active = true and t.engine_type = 'formula' and l.code in ('ar','en')
)
update public.tool_translations tt
set
  short_description = case
    when x.locale_code = 'ar' then x.title || ' تساعدك على حساب ' ||
      case x.category_slug
        when 'franchise-tools' then 'مؤشر تشغيلي للامتياز مثل حجم الوحدة أو نقطة التعادل أو الرسوم أو هامش التشغيل. استخدم بيانات من الفترة نفسها لكل موقع حتى تقارن الفروع والرسوم على أساس متسق.'
        when 'hospitality-tools' then 'مؤشر ضيافة مرتبط بالإشغال أو الحجز أو تكلفة الضيف أو القناة. استخدم عدد الليالي والحجوزات والإيراد والتكلفة من الفترة نفسها حتى تعكس النتيجة أداء المنشأة بدقة.'
        when 'hr-tools' then 'مؤشر موارد بشرية متعلق بالتوظيف أو الاحتفاظ أو الغياب أو تكلفة الموظفين. ثبّت تعريف الموظف والمرشح والفترة قبل المقارنة بين الفرق أو الأشهر.'
        when 'maintenance-tools' then 'مؤشر صيانة للأصول أو التوقف أو ساعات العمل أو تكلفة الخدمة. استخدم نفس تعريف الأصل والفترة، وافصل الصيانة الوقائية عن الطارئة عند تفسير النتيجة.'
        when 'procurement-tools' then 'مؤشر مشتريات للعقود أو الطلبات أو الموردين أو الوفورات. استخدم قيمة إنفاق وفترة وعقود متسقة، وميّز بين الوفر المحقق وتجنب التكلفة عند المقارنة.'
        when 'quality-tools' then 'مؤشر جودة للعيوب أو الشكاوى أو الإجراءات التصحيحية أو الالتزام. حافظ على نفس تعريف العينة والفرصة والوحدة حتى تكون المعدلات قابلة للمقارنة.'
        when 'rental-business-tools' then 'مؤشر نشاط تأجير مرتبط بالحجوزات أو مدة الاستخدام أو تكلفة الأصل أو العائد. استخدم نفس فترة القياس وافصل أيام الاستخدام الفعلي عن أيام التوقف.'
        when 'saas-tools' then 'مؤشر SaaS مثل الإيراد المتكرر أو الاحتفاظ أو الاستحواذ أو التفعيل. وحّد تعريف العميل والإيراد الشهري والفترة حتى تكون مؤشرات النمو والاحتفاظ قابلة للمقارنة.'
        when 'salon-tools' then 'مؤشر تشغيل صالون للحجوزات أو الكراسي أو زمن الخدمة أو قيمة العميل. استخدم مواعيد مكتملة وإيرادات وفترة موحدة لتفادي تضخيم معدلات الإشغال أو الإلغاء.'
        when 'startup-tools' then 'مؤشر تخطيط لشركة ناشئة مثل التعادل أو الحرق النقدي أو الكفاءة أو نسب الملكية. استخدم الافتراضات نفسها عند مقارنة السيناريوهات، واعتبر النتيجة حسابًا تخطيطيًا وليست تقييمًا استثماريًا نهائيًا.'
        else 'مؤشر تشغيلي بمدخلات قابلة للتحقق. راجع الوحدات والفترة قبل الاعتماد على النتيجة.'
      end
    else x.title || ' calculates ' ||
      case x.category_slug
        when 'franchise-tools' then 'a franchise operating metric such as unit volume, break-even, fees, or margin. Use figures from the same period and location basis so units can be compared consistently.'
        when 'hospitality-tools' then 'a hospitality metric tied to bookings, guest cost, channel mix, or room revenue. Keep nights, bookings, revenue, and costs on the same reporting period.'
        when 'hr-tools' then 'an HR metric for hiring, retention, absence, or employee cost. Keep definitions of employee, applicant, vacancy, and reporting period consistent before comparing teams.'
        when 'maintenance-tools' then 'a maintenance metric for assets, downtime, labor hours, or service cost. Use the same asset population and period and separate planned from emergency work when interpreting results.'
        when 'procurement-tools' then 'a procurement metric for contracts, orders, suppliers, or savings. Keep spend, contract scope, and reporting period consistent and distinguish realized savings from cost avoidance.'
        when 'quality-tools' then 'a quality metric for defects, complaints, corrective actions, or compliance. Use a stable definition of sample, opportunity, and unit so rates remain comparable.'
        when 'rental-business-tools' then 'a rental-business metric for bookings, duration, asset cost, or yield. Keep the measurement period consistent and separate utilized days from downtime.'
        when 'saas-tools' then 'a SaaS metric such as recurring revenue, retention, acquisition, or activation. Keep customer, MRR, and period definitions consistent so growth metrics can be compared.'
        when 'salon-tools' then 'a salon operating metric for appointments, chairs, service time, or client value. Use completed appointments, revenue, and a consistent reporting window.'
        when 'startup-tools' then 'a startup planning metric for break-even, cash burn, efficiency, or ownership percentages. Keep scenario assumptions consistent and treat the result as planning arithmetic rather than a final investment valuation.'
        else 'an operational metric using verifiable inputs. Check units and period before relying on the result.'
      end
  end,
  seo_description = case
    when x.locale_code = 'ar' then 'احسب ' || x.title || ' بسرعة مع شرح واضح للمدخلات وطريقة قراءة النتيجة، واستخدمها للمقارنة بين الفترات والسيناريوهات على أساس أرقام متسقة.'
    else 'Calculate ' || x.title || ' with clear input guidance and practical result interpretation for consistent period-over-period or scenario comparison.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id and tt.locale_id = x.locale_id;
