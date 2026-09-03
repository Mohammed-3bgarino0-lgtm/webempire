-- Release fix for Wave 8 reusing a Wave 4 sales slug.
begin;

-- Restore the original Wave 4 sales tool definition.
update public.tools
set category_id=(select id from public.categories where slug='sales-tools'),
    input_schema='{"submitLabel":"احسب","fields":[{"key":"campaign_cost","label":"تكلفة الحملة","type":"number","required":true,"step":0.01,"min":0},{"key":"qualified_leads","label":"العملاء المحتملون المؤهلون","type":"number","required":true,"step":1,"min":1}]}'::jsonb,
    runtime_config='{"expression":"campaign_cost / qualified_leads"}'::jsonb,
    sort_order=8006,
    updated_at=now()
where slug='cost-per-qualified-lead-calculator';

insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,pricing_mode,fixed_points,minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
values('marketing-cost-per-converted-lead-calculator','حاسبة تكلفة التسويق لكل عميل محتمل متحوّل','Marketing Cost per Converted Lead Calculator','احسب متوسط الإنفاق التسويقي لكل عميل محتمل تحوّل إلى نتيجة مستهدفة.',(select id from public.categories where slug='marketing-tools'),'formula','{"submitLabel":"احسب","fields":[{"key":"marketing_spend","label":"الإنفاق التسويقي","type":"number","required":true,"step":0.01,"min":0},{"key":"converted_leads","label":"العملاء المحتملون المتحوّلون","type":"number","required":true,"step":1,"min":1}]}'::jsonb,'{"type":"number","format":"auto"}'::jsonb,'{"expression":"marketing_spend / converted_leads"}'::jsonb,'free',0,0,false,false,true,28406,'حاسبة تكلفة التسويق لكل عميل محتمل متحوّل','احسب متوسط الإنفاق التسويقي لكل عميل محتمل تحوّل إلى نتيجة مستهدفة.')
on conflict(slug) do nothing;

-- Restore translations for the original sales tool.
update public.tool_translations tt
set title=case when l.code='ar' then 'حاسبة تكلفة العميل المحتمل المؤهل' else 'Cost per Qualified Lead Calculator' end,
    short_description=case when l.code='ar' then 'احسب تكلفة الحصول على عميل محتمل مؤهل.' else 'Calculate cost per qualified lead.' end,
    seo_title=case when l.code='ar' then 'حاسبة تكلفة العميل المحتمل المؤهل' else 'Cost per Qualified Lead Calculator' end,
    seo_description=case when l.code='ar' then 'احسب تكلفة الحصول على عميل محتمل مؤهل.' else 'Calculate cost per qualified lead.' end,
    updated_at=now()
from public.tools t, public.locales l
where tt.tool_id=t.id and tt.locale_id=l.id and t.slug='cost-per-qualified-lead-calculator' and l.code in('ar','en');

insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
select t.id,l.id,
case when l.code='ar' then 'حاسبة تكلفة التسويق لكل عميل محتمل متحوّل' else 'Marketing Cost per Converted Lead Calculator' end,
case when l.code='ar' then 'احسب متوسط الإنفاق التسويقي لكل عميل محتمل تحوّل إلى نتيجة مستهدفة.' else 'Calculate average marketing spend per lead that converted to the target outcome.' end,
case when l.code='ar' then 'حاسبة تكلفة التسويق لكل عميل محتمل متحوّل' else 'Marketing Cost per Converted Lead Calculator' end,
case when l.code='ar' then 'احسب متوسط الإنفاق التسويقي لكل عميل محتمل تحوّل إلى نتيجة مستهدفة.' else 'Calculate average marketing spend per lead that converted to the target outcome.' end,null
from public.tools t join public.locales l on l.code in('ar','en') where t.slug='marketing-cost-per-converted-lead-calculator'
on conflict(tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();

-- Field translations for both the restored and replacement tools.
insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,x.field_key,case when l.code='ar' then x.ar_label else x.en_label end,null,null,null
from (values
('cost-per-qualified-lead-calculator','campaign_cost','تكلفة الحملة','Campaign cost'),
('cost-per-qualified-lead-calculator','qualified_leads','العملاء المحتملون المؤهلون','Qualified leads'),
('cost-per-qualified-lead-calculator','__submit__','احسب','Calculate'),
('marketing-cost-per-converted-lead-calculator','marketing_spend','الإنفاق التسويقي','Marketing spend'),
('marketing-cost-per-converted-lead-calculator','converted_leads','العملاء المحتملون المتحوّلون','Converted leads'),
('marketing-cost-per-converted-lead-calculator','__submit__','احسب','Calculate')
) x(slug,field_key,ar_label,en_label)
join public.tools t on t.slug=x.slug join public.locales l on l.code in('ar','en')
on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();

commit;
