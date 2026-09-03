-- Web Empire release fix — Wave 11 cross-wave collision.
-- Restore the original Wave 6 franchise tool and add a distinct Wave 11 replacement.

begin;

create temporary table wave11_collision_fix_seed(
  category_slug text not null, slug text primary key, title_ar text not null, title_en text not null,
  description_ar text not null, description_en text not null, expression text not null,
  input_fields jsonb not null, english_fields jsonb not null, sort_order integer not null
) on commit drop;

insert into wave11_collision_fix_seed values
('franchise-tools','franchise-sales-per-sqm-calculator','حاسبة مبيعات الامتياز لكل متر²','Franchise Sales per m² Calculator','احسب متوسط المبيعات لكل متر مربع من مساحة الفرع.','Calculate franchise sales per square meter.','sales / area_sqm','[{"key":"sales","label":"المبيعات","type":"number","required":true,"min":0},{"key":"area_sqm","label":"المساحة م²","type":"number","required":true,"min":0.000001}]','[{"key":"sales","label":"Sales","type":"number","required":true,"min":0},{"key":"area_sqm","label":"Area (m²)","type":"number","required":true,"min":0.000001}]',13007),
('franchise-tools','franchise-sales-per-labor-hour-calculator','حاسبة مبيعات الامتياز لكل ساعة عمل','Franchise Sales per Labor Hour Calculator','احسب متوسط مبيعات فرع الامتياز لكل ساعة عمل.','Calculate franchise sales per labor hour.','sales / labor_hours','[{"key":"sales","label":"المبيعات","type":"number","required":true,"min":0},{"key":"labor_hours","label":"ساعات العمل","type":"number","required":true,"min":0.000001}]','[{"key":"sales","label":"Sales","type":"number","required":true,"min":0},{"key":"labor_hours","label":"Labor hours","type":"number","required":true,"min":0.000001}]',32011);

insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,pricing_mode,fixed_points,minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
select s.slug,s.title_ar,s.title_en,s.description_ar,c.id,'formula',jsonb_build_object('submitLabel','احسب','fields',s.input_fields),jsonb_build_object('type','number','format','auto'),jsonb_build_object('expression',s.expression),'free',0,0,false,false,true,s.sort_order,s.title_ar,s.description_ar
from wave11_collision_fix_seed s join public.categories c on c.slug=s.category_slug
on conflict(slug) do update set title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,category_id=excluded.category_id,engine_type=excluded.engine_type,input_schema=excluded.input_schema,output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,pricing_mode='free',fixed_points=0,minimum_points=0,requires_auth=false,is_featured=false,is_active=true,sort_order=excluded.sort_order,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();

insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
select t.id,l.id,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,null
from wave11_collision_fix_seed s join public.tools t on t.slug=s.slug join public.locales l on l.code in('ar','en')
on conflict(tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,f.value->>'key',f.value->>'label',null,null,f.value->'options'
from wave11_collision_fix_seed s join public.tools t on t.slug=s.slug join public.locales l on l.code in('ar','en')
cross join lateral jsonb_array_elements(case when l.code='ar' then s.input_fields else s.english_fields end) f(value)
on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=excluded.options,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,'__submit__',case when l.code='ar' then 'احسب' else 'Calculate' end,null,null,null
from wave11_collision_fix_seed s join public.tools t on t.slug=s.slug join public.locales l on l.code in('ar','en')
on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();

commit;
