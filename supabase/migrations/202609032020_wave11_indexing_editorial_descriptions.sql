-- Wave 11 bilingual SEO/editorial descriptions for 100 indexable formula tools.
with wave11_slugs(slug) as (
  values
  ('break-even-roas-calculator'),('campaign-frequency-calculator'),('daily-ad-budget-calculator'),('effective-cpm-after-fees-calculator'),('impression-share-gap-calculator'),('page-rpm-calculator'),('target-cpc-calculator'),('target-cpm-calculator'),('video-ad-completion-rate-calculator'),('view-through-rate-calculator'),
  ('energy-emissions-estimate-calculator'),('energy-intensity-calculator'),('energy-savings-rate-calculator'),('generator-fuel-consumption-calculator'),('generator-fuel-cost-calculator'),('load-factor-calculator'),('monthly-energy-consumption-calculator'),('peak-demand-reduction-savings-calculator'),('power-factor-penalty-calculator'),('solar-panel-output-calculator'),
  ('retail-stock-cover-days-calculator'),('retail-stock-turn-days-calculator'),('retail-stockout-rate-calculator'),('retail-transactions-per-opening-hour-calculator'),('retail-units-per-labor-hour-calculator'),('retail-units-per-transaction-calculator'),('retail-utilities-cost-rate-calculator'),('sales-per-square-meter-calculator'),('sell-through-rate-calculator'),('store-conversion-rate-calculator'),
  ('telecom-data-cost-per-gb-calculator'),('telecom-data-usage-growth-calculator'),('telecom-network-uptime-calculator'),('telecom-retention-rate-calculator'),('telecom-revenue-per-gb-calculator'),('telecom-revenue-per-minute-calculator'),('telecom-subscriber-acquisition-cost-calculator'),('telecom-subscriber-churn-calculator'),('telecom-support-cost-per-subscriber-calculator'),('tower-utilization-rate-calculator'),
  ('road-trip-distance-per-day-calculator'),('travel-currency-budget-calculator'),('travel-insurance-cost-calculator'),('travel-meal-budget-per-day-calculator'),('travel-savings-per-month-calculator'),('travel-time-calculator'),('trip-budget-per-day-calculator'),('trip-fuel-cost-calculator'),('trip-total-with-taxes-calculator'),('visa-fees-total-calculator'),
  ('box-volume-liter-calculator'),('centimeter-to-meter-converter'),('fahrenheit-to-celsius-converter'),('inch-to-millimeter-converter'),('kilogram-to-pound-converter'),('kilometer-hour-to-mile-hour'),('land-share-area-calculator'),('liter-to-us-gallon-converter'),('meter-to-kilometer-converter'),('mile-hour-to-kilometer-hour'),
  ('annual-work-hours-calculator'),('calendar-weeks-to-days-calculator'),('days-to-hours-calculator'),('days-to-weeks-calculator'),('decimal-days-to-total-hours-calculator'),('decimal-hours-to-minutes'),('hours-to-days-calculator'),('hours-to-seconds-calculator'),('meeting-person-hours-calculator'),('minutes-to-decimal-hours'),
  ('assignment-average-calculator'),('attendance-rate-calculator'),('completed-credits-rate'),('course-completion-rate-calculator'),('course-weighted-score-calculator'),('exam-score-gap-calculator'),('final-exam-required-score'),('gpa-4-to-5-converter'),('gpa-4-to-percentage-calculator'),('gpa-5-to-percentage-calculator'),
  ('average-rate-calculator'),('cost-per-person-calculator'),('cross-multiplication-value-calculator'),('electricity-usage-cost'),('fraction-to-percentage-calculator'),('fuel-efficiency-calculator'),('growth-multiplier-calculator'),('percent-difference-calculator'),('productivity-rate-calculator'),('rate-per-thousand-calculator'),
  ('circle-area-calculator'),('circle-area-from-diameter-calculator'),('cylinder-volume-calculator'),('density-calculator'),('geometric-mean-two-values'),('geometric-mean-two-values-calculator'),('harmonic-mean-two-values'),('harmonic-mean-two-values-calculator'),('linear-interpolation-calculator'),('math-cost-per-unit-calculator')
), targets as (
  select tt.tool_id, tt.locale_id, tt.title, l.code locale_code, c.slug category_slug
  from public.tool_translations tt
  join public.tools t on t.id=tt.tool_id
  join public.locales l on l.id=tt.locale_id
  join public.categories c on c.id=t.category_id
  join wave11_slugs w on w.slug=t.slug
  where t.is_active=true and l.code in ('ar','en')
)
update public.tool_translations tt
set short_description = case
  when x.locale_code='ar' then x.title || ' — ' || (case x.category_slug
    when 'advertising-tools' then 'حاسبة إعلانية لقياس التكلفة أو الوصول أو العائد بمدخلات من نفس الحملة والفترة، مع تفسير عملي للنتيجة قبل المقارنة.'
    when 'energy-tools' then 'أداة طاقة لحساب الاستهلاك أو التكلفة أو الكفاءة باستخدام وحدات قدرة وزمن متسقة، مع توضيح أثر التعرفة والمدخلات.'
    when 'retail-tools' then 'مؤشر تجزئة للمبيعات أو المخزون أو الإنتاجية التشغيلية. استخدم بيانات الفرع والفترة نفسها للحصول على مقارنة قابلة للاستخدام.'
    when 'telecom-tools' then 'مؤشر اتصالات للمشتركين أو الشبكة أو التكلفة أو الإيراد. وحّد قاعدة المشتركين والفترة والوحدات عند قراءة النتيجة.'
    when 'travel-tools' then 'حاسبة سفر لتقدير الوقت أو الميزانية أو الرسوم أو تكاليف الرحلة باستخدام عدد المسافرين والأيام والأسعار المناسبة لنفس الرحلة.'
    when 'converter-tools' then 'تحويل مباشر بين وحدات محددة مع الحفاظ على عامل التحويل الصحيح ووحدة الإدخال والإخراج.'
    when 'date-time-tools' then 'حساب زمني لتحويل أو تجميع الساعات والأيام والأسابيع بدقة مع توحيد الفترة المستخدمة في المدخلات.'
    when 'education-tools' then 'حاسبة تعليمية للدرجات أو الحضور أو التقدم الدراسي. راجع نظام التقييم والأوزان المعتمد قبل تفسير النتيجة.'
    when 'general-tools' then 'حاسبة عامة لمؤشر رقمي واضح مع مدخلات ووحدات محددة تساعد على المقارنة والتحقق من النتيجة.'
    when 'math-tools' then 'حاسبة رياضية تطبق العلاقة الحسابية مباشرة على القيم المدخلة وتعرض نتيجة قابلة للتحقق يدويًا.'
    else 'حاسبة رقمية بمدخلات واضحة ونتيجة قابلة للتحقق.' end)
  else x.title || ' — ' || (case x.category_slug
    when 'advertising-tools' then 'an advertising calculator for cost, reach, or return using inputs from the same campaign and reporting period, with practical result interpretation.'
    when 'energy-tools' then 'an energy calculator for consumption, cost, or efficiency using consistent power and time units, with clear input and tariff context.'
    when 'retail-tools' then 'a retail metric for sales, inventory, or operating productivity. Use figures from the same store and reporting period for meaningful comparison.'
    when 'telecom-tools' then 'a telecom metric for subscribers, network performance, cost, or revenue. Keep subscriber base, period, and units consistent.'
    when 'travel-tools' then 'a travel calculator for time, budget, fees, or trip costs using traveler counts, days, and prices that belong to the same trip.'
    when 'converter-tools' then 'a direct unit conversion using the correct conversion factor and clearly defined input and output units.'
    when 'date-time-tools' then 'a time calculation for converting or totaling hours, days, and weeks while keeping the reporting period consistent.'
    when 'education-tools' then 'an education calculator for grades, attendance, or study progress. Verify the grading scale and weights before interpreting the result.'
    when 'general-tools' then 'a general-purpose calculator for a clearly defined numerical metric with explicit inputs and units.'
    when 'math-tools' then 'a math calculator that applies the stated relationship directly to the entered values and produces a result that can be checked manually.'
    else 'a numerical calculator with clearly defined inputs and a verifiable result.' end)
end,
seo_description = case when x.locale_code='ar'
  then 'استخدم ' || x.title || ' للحساب بسرعة مع مدخلات واضحة وشرح مختصر لطريقة تفسير النتيجة ومقارنتها بشكل صحيح.'
  else 'Use ' || x.title || ' for a quick calculation with clear inputs and concise guidance for interpreting and comparing the result.' end,
updated_at=now()
from targets x
where tt.tool_id=x.tool_id and tt.locale_id=x.locale_id;
