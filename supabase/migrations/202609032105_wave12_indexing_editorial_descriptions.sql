-- Wave 12 SEO/editorial enrichment for 100 indexable formula tools.
-- Formulas, pricing, authentication, and runtime behavior are unchanged.

with wave12_slugs(slug) as (
  values
    ('expense-ratio-calculator'),('fixed-cost-per-unit-calculator'),('gross-margin-calculator'),('inventory-days-calculator'),('net-profit-margin-calculator'),('operating-expense-per-customer-calculator'),('operating-leverage-calculator'),('operating-margin-calculator'),('payable-days-calculator'),('profit-per-employee-calculator'),
    ('alert-to-incident-conversion-rate-calculator'),('backup-recovery-success-rate-calculator'),('backup-success-rate-calculator'),('critical-vulnerability-rate-calculator'),('endpoint-coverage-rate-calculator'),('incident-cost-per-event-calculator'),('log-ingestion-per-day-calculator'),('mean-time-to-detect-calculator'),('mean-time-to-respond-calculator'),('mfa-coverage-rate-calculator'),('password-reset-rate-calculator'),('patch-compliance-rate-calculator'),('phishing-click-rate-calculator'),('phishing-reporting-rate-calculator'),('security-alert-to-incident-rate-calculator'),('security-awareness-completion-rate-calculator'),('security-backup-failure-rate-calculator'),('security-cost-per-endpoint-calculator'),('security-false-positive-rate-calculator'),('security-incident-cost-per-user-calculator'),
    ('minutes-to-hours-calculator'),('minutes-to-seconds-calculator'),('months-to-weeks-estimate'),('months-to-years-estimator'),('net-shift-hours-calculator'),('overtime-hours-calculator'),('production-time-per-unit'),('shifts-to-hours-calculator'),('task-throughput-per-hour'),('time-budget-per-day-calculator'),
    ('ecommerce-conversion-rate-calculator'),('ecommerce-customer-churn-rate-calculator'),('ecommerce-customer-order-frequency-calculator'),('ecommerce-delivery-success-rate-calculator'),('ecommerce-gross-margin-per-order-calculator'),('ecommerce-net-order-value-calculator'),('ecommerce-payment-fee-rate-calculator'),('ecommerce-refund-adjusted-margin-calculator'),('ecommerce-refund-rate-calculator'),('ecommerce-return-loss-calculator'),
    ('grade-improvement-rate'),('grade-point-contribution-calculator'),('points-needed-for-target'),('practice-question-accuracy-calculator'),('quiz-average-calculator'),('reading-pages-per-day-calculator'),('semester-credit-load-calculator'),('study-hours-per-subject'),('study-plan-hours-calculator'),('study-session-efficiency-calculator'),
    ('customer-acquisition-cost-calculator'),('customer-lifetime-value-simple'),('email-bounce-rate-calculator'),('email-click-to-open-rate'),('email-delivery-rate-calculator'),('email-open-rate-calculator'),('landing-page-bounce-rate'),('landing-page-conversion-value-calculator'),('lead-cost-calculator'),('lead-to-sale-rate'),
    ('ad-revenue-share-calculator'),('affiliate-commission-per-sale-calculator'),('affiliate-conversion-rate-calculator'),('affiliate-epc-calculator'),('affiliate-revenue-per-click-calculator'),('course-refund-rate-calculator'),('course-revenue-per-enrollment-calculator'),('creator-income-per-content-piece-calculator'),('creator-rpm-calculator'),('digital-download-conversion-rate-calculator'),('digital-product-net-earnings-calculator'),('digital-product-profit-margin-calculator'),('income-goal-pageviews-calculator'),('membership-annual-revenue-calculator'),('membership-monthly-revenue-calculator'),('newsletter-paid-conversion-rate-calculator'),('online-income-effective-hourly-rate-calculator'),('online-income-monthly-growth-rate-calculator'),('online-income-revenue-per-transaction-calculator'),('platform-fee-rate-calculator'),
    ('productive-meeting-hours-ratio-calculator'),('productivity-output-per-hour-calculator'),('project-progress-calculator'),('recurring-task-annual-hours-calculator'),('schedule-adherence-rate-calculator'),('task-completion-rate-calculator'),('tasks-per-workday-calculator'),('team-utilization-rate-calculator'),('weekly-focus-hours-calculator'),('weekly-work-capacity-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code as locale_code, c.slug as category_slug
  from public.tool_translations tt
  join public.tools t on t.id = tt.tool_id
  join public.locales l on l.id = tt.locale_id
  join public.categories c on c.id = t.category_id
  join wave12_slugs w on w.slug = t.slug
  where t.is_active = true and l.code in ('ar','en')
)
update public.tool_translations tt
set
  short_description = case
    when x.locale_code = 'ar' then
      x.title || ' تساعدك على ' ||
      case x.category_slug
        when 'business-tools' then 'قياس مؤشر أعمال تشغيلي أو ربحي باستخدام أرقام من الفترة نفسها. وحّد تعريف الإيراد والتكلفة والعملاء أو المخزون قبل المقارنة، واستخدم النتيجة مع اتجاه زمني أو هدف داخلي.'
        when 'cybersecurity-tools' then 'قياس مؤشر دفاعي للأمن السيبراني مثل التغطية أو الاستجابة أو النسخ الاحتياطي أو معالجة الثغرات. استخدم بيانات مجمعة ومصرحًا بها من بيئتك، ولا تعتبر النتيجة بديلًا عن تقييم أمني متخصص.'
        when 'date-time-tools' then 'تحويل أو توزيع الوقت والوحدات الزمنية بطريقة مباشرة. راجع وحدة الإدخال ووحدة الإخراج، وحدد ما إذا كان الحساب تقويميًا أو تشغيليًا قبل استخدام النتيجة.'
        when 'ecommerce-tools' then 'قياس أداء التجارة الإلكترونية من الطلبات والعملاء والهوامش والمرتجعات والرسوم. استخدم نفس الفترة ومصدر البيانات، وافصل الطلبات المكتملة عن المرتجعات والإلغاءات.'
        when 'education-tools' then 'حساب مؤشر دراسي مثل التقدم أو الدرجات أو الحمل الدراسي أو دقة الممارسة. استخدم نفس نظام الدرجات والساعات والوحدات الأكاديمية، وراجع سياسة المؤسسة عند وجود تحويلات رسمية.'
        when 'marketing-tools' then 'قياس أداء تسويقي مثل تكلفة العميل أو البريد أو الصفحة المقصودة أو التحويل. استخدم نفس القناة والفترة ومصدر التتبع حتى تكون المقارنة عادلة.'
        when 'online-income-tools' then 'تقدير مؤشر دخل رقمي من العمولة أو المبيعات أو الاشتراكات أو المنتجات الرقمية. أدخل الإيرادات والرسوم والاستردادات من الفترة نفسها، وتعامل مع الناتج كتقدير تشغيلي لا كضمان للدخل.'
        when 'productivity-tools' then 'قياس مؤشر إنتاجية من الوقت والمهام والتركيز والطاقة الاستيعابية. اعتمد على وقت فعلي قدر الإمكان، وقارن النتيجة عبر فترات متشابهة بدل استخدامها كحكم منفرد على الأداء.'
        else 'حساب مؤشر تشغيلي باستخدام مدخلات واضحة ومتسقة.'
      end
    else
      x.title || ' helps you ' ||
      case x.category_slug
        when 'business-tools' then 'measure an operating or profitability metric using figures from the same reporting period. Keep revenue, cost, customer, and inventory definitions consistent and compare the result with a trend or internal target.'
        when 'cybersecurity-tools' then 'measure a defensive cybersecurity metric such as coverage, response, backup reliability, or vulnerability handling. Use aggregated authorized data from your own environment and do not treat the result as a substitute for a professional security assessment.'
        when 'date-time-tools' then 'convert or allocate time units directly. Check the input and output units and whether the calculation is calendar-based or operational before using the result.'
        when 'ecommerce-tools' then 'measure ecommerce performance across orders, customers, margins, returns, and fees. Use the same reporting period and data source and separate completed orders from refunds and cancellations.'
        when 'education-tools' then 'calculate a study metric such as progress, grades, workload, or practice accuracy. Keep grading scales, credit units, and study-hour definitions consistent and check institutional rules for official conversions.'
        when 'marketing-tools' then 'measure a marketing metric involving acquisition cost, email, landing pages, or conversion. Use the same channel, date range, and tracking source for meaningful comparisons.'
        when 'online-income-tools' then 'estimate a digital income metric involving commission, sales, subscriptions, or digital products. Enter revenue, fees, and refunds from the same period and treat the result as an operating estimate rather than an income guarantee.'
        when 'productivity-tools' then 'measure productivity using time, tasks, focus, or capacity inputs. Prefer measured time where possible and compare similar periods rather than using the result as a standalone performance judgment.'
        else 'calculate an operational metric with clearly defined inputs.'
      end
  end,
  seo_description = case
    when x.locale_code = 'ar' then
      'استخدم ' || x.title || ' لحساب المؤشر بسرعة مع إرشادات واضحة للمدخلات وطريقة تفسير النتيجة ومقارنتها على أساس بيانات متسقة.'
    else
      'Use ' || x.title || ' to calculate the metric quickly with clear input guidance, result interpretation, and consistent comparison principles.'
  end,
  updated_at = now()
from targets x
where tt.tool_id = x.tool_id and tt.locale_id = x.locale_id;
