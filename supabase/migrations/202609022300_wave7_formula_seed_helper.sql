-- Web Empire wave 7 helper for staged deterministic formula tools.
-- GitHub staging only. Removed by the wave7 cleanup migration.

create or replace function public._wave7_ar_label(p_key text)
returns text language plpgsql immutable as $$
declare
  labels jsonb := '{"activated_users":"المستخدمون المفعلون","active_policies":"الوثائق النشطة","ad_revenue":"إيراد الإعلانات","ad_spend":"الإنفاق الإعلاني","annual_revenue":"الإيراد السنوي","approved_claims":"المطالبات المعتمدة","attraction_budget":"ميزانية الأنشطة","attributed_revenue":"الإيراد المنسوب للحملة","availability_rate":"نسبة التوفر","average_photo_mb":"متوسط حجم الصورة بالميجابايت","base_trip_cost":"تكلفة الرحلة الأساسية","baseline_kwh":"الاستهلاك الأساسي بالكيلوواط ساعة","baseline_paper":"استهلاك الورق الأساسي","buffer_rate":"نسبة الاحتياطي","call_attempts":"محاولات المكالمات","campaign_days":"أيام الحملة","capital_invested":"رأس المال المستثمر","capture_duration_seconds":"مدة الالتقاط بالثواني","captured_photos":"الصور الملتقطة","carbon_emissions":"انبعاثات الكربون","cash_balance":"الرصيد النقدي","churned_mrr":"MRR المتسرب","claim_amount":"قيمة المطالبة","company_valuation":"تقييم الشركة","complaints":"عدد الشكاوى","completed_views":"المشاهدات المكتملة","composted_waste":"النفايات المحولة لسماد","contraction_mrr":"MRR المنخفض","cost_of_service":"تكلفة تقديم الخدمة","course_revenue":"إيراد الدورة","coverage_amount":"قيمة التغطية","crop_factor":"معامل القص","current_equity":"الملكية الحالية","current_kwh":"الاستهلاك الحالي بالكيلوواط ساعة","current_paper":"استهلاك الورق الحالي","current_savings":"المدخرات الحالية","customers":"عدد العملاء","data_gb":"حجم البيانات بالجيجابايت","data_revenue":"إيراد البيانات","days":"عدد الأيام","delivered_photos":"الصور المسلّمة","diverted_tons":"الأطنان المحوّلة","diverted_waste":"النفايات المحوّلة","earned_premiums":"الأقساط المكتسبة","editing_cost":"تكلفة التحرير","ending_subscribers":"المشتركون نهاية الفترة","enrollments":"عدد التسجيلات","exchange_amount":"مبلغ التحويل","exchange_fee_rate":"نسبة رسوم التحويل","expansion_mrr":"MRR التوسعي","expected_claims":"المطالبات المتوقعة","expense_ratio":"نسبة المصروفات","fixed_costs":"التكاليف الثابتة","focal_length":"البعد البؤري","founder_equity_rate":"نسبة ملكية المؤسس","frame_rate":"معدل الإطارات","frames":"عدد الإطارات","free_users":"المستخدمون المجانيون","funding_amount":"مبلغ التمويل","gross_earnings":"الأرباح الإجمالية","gross_income":"الدخل الإجمالي","gross_margin_rate":"هامش الربح الإجمالي","hotel_tax_rate":"نسبة ضريبة الفندق","hours_per_day":"الساعات يوميًا","impression_share_rate":"نسبة حصة الظهور","impressions":"مرات الظهور","infrastructure_cost":"تكلفة البنية التحتية","interval_seconds":"الفاصل بالثواني","investment_amount":"مبلغ الاستثمار","landfill_cost_per_ton":"تكلفة الطمر لكل طن","lapsed_policies":"الوثائق المنقطعة","leads":"العملاء المحتملون","local_transport_cost":"تكلفة النقل المحلي","loss_ratio":"نسبة الخسارة","meal_budget":"ميزانية الطعام","members":"عدد الأعضاء","monthly_burn":"معدل الحرق الشهري","monthly_expenses":"المصروفات الشهرية","monthly_fee":"الرسوم الشهرية","monthly_income":"الدخل الشهري","monthly_rent":"الإيجار الشهري","months_until_trip":"الأشهر حتى الرحلة","net_burn":"صافي الحرق النقدي","net_income":"صافي الدخل","net_new_arr":"صافي ARR الجديد","new_consumption":"الاستهلاك الجديد","new_emissions":"الانبعاثات الجديدة","new_energy_cost":"تكلفة الطاقة الجديدة","new_monthly_payroll":"الرواتب الشهرية الجديدة","new_mrr":"MRR الجديد","new_shares_percent":"نسبة الحصص الجديدة","new_users":"المستخدمون الجدد","nightly_rate":"سعر الليلة","nights":"عدد الليالي","old_consumption":"الاستهلاك السابق","old_emissions":"الانبعاثات السابقة","old_energy_cost":"تكلفة الطاقة السابقة","operating_expenses":"المصروفات التشغيلية","organic_waste":"النفايات العضوية","paid_claims":"المطالبات المدفوعة","paid_customers":"العملاء المدفوعون","paid_users":"المستخدمون المدفوعون","payment_fees":"رسوم الدفع","photos":"عدد الصور","pixel_height":"ارتفاع الصورة بالبكسل","pixel_width":"عرض الصورة بالبكسل","planned_spend":"الإنفاق المخطط","platform_fees":"رسوم المنصة","policies":"عدد الوثائق","post_money_valuation":"التقييم بعد الاستثمار","power_kw":"القدرة بالكيلوواط","premium":"قيمة القسط","previous_quarter_sales_marketing_cost":"تكلفة المبيعات والتسويق للربع السابق","price_per_cubic_meter":"سعر المتر المكعب","price_per_kwh":"سعر الكيلوواط ساعة","print_cost":"تكلفة الطباعة","print_width_inches":"عرض الطباعة بالبوصة","processed_claims":"المطالبات المعالجة","production_units":"وحدات الإنتاج","purchases":"عدد المشتريات","quarterly_new_arr":"ARR الجديد للربع","reached_users":"عدد مستخدمي الوصول","recharge_revenue":"إيراد الشحن","recharges":"عدد عمليات الشحن","recovered_amount":"المبلغ المسترد","refunds":"المبالغ المستردة","renovation_budget":"ميزانية الترميم","reserves":"الاحتياطيات","reusable_cost":"تكلفة الخيار القابل لإعادة الاستخدام","revenue":"الإيراد","revenue_generated":"الإيراد المولّد","revenue_multiple":"مضاعف الإيراد","revenue_share_rate":"نسبة مشاركة الإيراد","room_height":"ارتفاع الغرفة","room_length":"طول الغرفة","room_width":"عرض الغرفة","sales":"المبيعات","selling_price":"سعر البيع","session_attempts":"محاولات الجلسات","session_revenue":"إيراد الجلسة","shoot_cost":"تكلفة التصوير","shoot_hours":"ساعات التصوير","single_use_cost":"تكلفة الاستخدام الواحد","solar_kwh":"إنتاج الطاقة الشمسية بالكيلوواط ساعة","spent_amount":"المبلغ المصروف","sponsorship_revenue":"إيراد الرعاية","starting_mrr":"MRR بداية الفترة","starting_subscribers":"المشتركون بداية الفترة","storage_height":"ارتفاع مساحة التخزين","storage_length":"طول مساحة التخزين","storage_width":"عرض مساحة التخزين","submitted_claims":"المطالبات المقدمة","subscribers":"عدد المشتركين","subscription_revenue":"إيراد الاشتراكات","successful_call_setups":"إعدادات المكالمات الناجحة","successful_sessions":"الجلسات الناجحة","support_tickets":"تذاكر الدعم","tax_rate":"نسبة الضريبة","total_bandwidth":"إجمالي عرض النطاق","total_budget":"إجمالي الميزانية","total_distance":"إجمالي المسافة","total_flight_cost":"إجمالي تكلفة الطيران","total_hours":"إجمالي الساعات","total_kwh":"إجمالي الاستهلاك بالكيلوواط ساعة","total_luggage_fees":"إجمالي رسوم الأمتعة","total_processing_days":"إجمالي أيام المعالجة","total_waste":"إجمالي النفايات","total_watts":"إجمالي القدرة بالواط","tower_capacity":"سعة البرج","travel_cost":"تكلفة السفر","travel_days":"أيام السفر","travelers":"عدد المسافرين","trial_users":"مستخدمو التجربة","trip_goal":"هدف تكلفة الرحلة","used_bandwidth":"عرض النطاق المستخدم","used_capacity":"السعة المستخدمة","video_starts":"مرات بدء الفيديو","views":"المشاهدات","visitors":"عدد الزوار","water_consumption":"استهلاك المياه","water_liters":"المياه باللترات","watts":"القدرة بالواط","work_hours":"ساعات العمل"}'::jsonb;
begin
  return coalesce(labels ->> p_key, replace(p_key,'_',' '));
end;
$$;

create or replace function public._wave7_upsert_formula_tools(p_category_slug text,p_tools jsonb)
returns void language plpgsql as $$
begin
  insert into public.tools(
    slug,title_ar,title_en,short_description,category_id,engine_type,
    input_schema,output_schema,runtime_config,pricing_mode,fixed_points,
    minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description
  )
  select
    s.slug,
    s.title_ar,
    s.title_en,
    s.title_ar || ' — حاسبة مجانية تعتمد على القيم المدخلة.',
    c.id,
    'formula',
    jsonb_build_object(
      'submitLabel','احسب',
      'fields',(
        select coalesce(jsonb_agg(jsonb_build_object(
          'key',f.value,
          'label',public._wave7_ar_label(f.value),
          'type','number',
          'required',true,
          'step',0.01,
          'min',case when coalesce(s.nonzero,'[]'::jsonb) ? f.value then 0.000001 else 0 end
        )),'[]'::jsonb)
        from jsonb_array_elements_text(s.fields) f(value)
      )
    ),
    jsonb_build_object('type','number','format','auto'),
    jsonb_build_object('expression',s.expression),
    'free',0,0,false,false,true,s.sort_order,s.title_ar,
    s.title_ar || ' — حاسبة مجانية تعتمد على القيم المدخلة.'
  from jsonb_to_recordset(p_tools) as s(
    slug text,title_ar text,title_en text,expression text,fields jsonb,nonzero jsonb,sort_order integer
  )
  join public.categories c on c.slug=p_category_slug
  on conflict(slug) do update set
    title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,
    category_id=excluded.category_id,engine_type=excluded.engine_type,input_schema=excluded.input_schema,
    output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,pricing_mode=excluded.pricing_mode,
    fixed_points=0,minimum_points=0,requires_auth=false,is_featured=false,is_active=true,
    sort_order=excluded.sort_order,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();

  insert into public.tool_translations(
    tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override
  )
  select
    t.id,l.id,
    case when l.code='ar' then s.title_ar else s.title_en end,
    case when l.code='ar'
      then s.title_ar || ' — حاسبة مجانية تعتمد على القيم المدخلة.'
      else s.title_en || ' — free calculator based on the values you enter.'
    end,
    case when l.code='ar' then s.title_ar else s.title_en end,
    case when l.code='ar'
      then s.title_ar || ' — حاسبة مجانية تعتمد على القيم المدخلة.'
      else s.title_en || ' — free calculator based on the values you enter.'
    end,
    null
  from jsonb_to_recordset(p_tools) as s(
    slug text,title_ar text,title_en text,expression text,fields jsonb,nonzero jsonb,sort_order integer
  )
  join public.tools t on t.slug=s.slug
  join public.locales l on l.code in('ar','en')
  on conflict(tool_id,locale_id) do update set
    title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,
    seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

  insert into public.tool_field_translations(
    tool_id,locale_id,field_key,label,placeholder,help_text,options
  )
  select
    t.id,l.id,f.value,
    case when l.code='ar' then public._wave7_ar_label(f.value)
         else initcap(replace(f.value,'_',' ')) end,
    null,null,null
  from jsonb_to_recordset(p_tools) as s(
    slug text,title_ar text,title_en text,expression text,fields jsonb,nonzero jsonb,sort_order integer
  )
  join public.tools t on t.slug=s.slug
  join public.locales l on l.code in('ar','en')
  cross join lateral jsonb_array_elements_text(s.fields) f(value)
  on conflict(tool_id,locale_id,field_key) do update set
    label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();

  insert into public.tool_field_translations(
    tool_id,locale_id,field_key,label,placeholder,help_text,options
  )
  select t.id,l.id,'__submit__',case when l.code='ar' then 'احسب' else 'Calculate' end,null,null,null
  from jsonb_to_recordset(p_tools) as s(
    slug text,title_ar text,title_en text,expression text,fields jsonb,nonzero jsonb,sort_order integer
  )
  join public.tools t on t.slug=s.slug
  join public.locales l on l.code in('ar','en')
  on conflict(tool_id,locale_id,field_key) do update set
    label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();
end;
$$;
