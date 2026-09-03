-- Web Empire release fix — Wave 9 cross-wave collisions.
-- Restore three earlier tools overwritten by Wave 9 slug reuse and add three unique replacements.

begin;

create temporary table wave9_collision_fix_seed (
  category_slug text not null,
  slug text primary key,
  title_ar text not null,
  title_en text not null,
  description_ar text not null,
  description_en text not null,
  expression text not null,
  input_fields jsonb not null,
  english_fields jsonb not null,
  sort_order integer not null
) on commit drop;

insert into wave9_collision_fix_seed(category_slug,slug,title_ar,title_en,description_ar,description_en,expression,input_fields,english_fields,sort_order) values
('retail-tools','retail-markdown-rate-calculator','حاسبة نسبة تخفيض السعر','Retail Markdown Rate Calculator','احسب نسبة التخفيض من السعر الأصلي إلى سعر البيع.','Calculate markdown percentage from original to selling price.','(original_price - selling_price) / original_price * 100','[{"key":"original_price","label":"السعر الأصلي","type":"number","required":true,"step":0.01,"min":0.01},{"key":"selling_price","label":"سعر البيع","type":"number","required":true,"step":0.01,"min":0}]'::jsonb,'[{"key":"original_price","label":"Original price","type":"number","required":true,"step":0.01,"min":0.01},{"key":"selling_price","label":"Selling price","type":"number","required":true,"step":0.01,"min":0}]'::jsonb,8101),
('logistics-tools','logistics-damage-rate-calculator','حاسبة نسبة تلف الشحنات','Logistics Damage Rate Calculator','احسب الشحنات التالفة كنسبة من إجمالي الشحنات.','Calculate damaged shipments as a percentage of total shipments.','damaged_shipments / total_shipments * 100','[{"key":"damaged_shipments","label":"الشحنات التالفة","type":"number","required":true,"step":1,"min":0},{"key":"total_shipments","label":"إجمالي الشحنات","type":"number","required":true,"step":1,"min":1}]'::jsonb,'[{"key":"damaged_shipments","label":"Damaged shipments","type":"number","required":true,"step":1,"min":0},{"key":"total_shipments","label":"Total shipments","type":"number","required":true,"step":1,"min":1}]'::jsonb,8108),
('construction-tools','construction-cost-per-sqm-calculator','حاسبة تكلفة البناء لكل متر²','Construction Cost per m² Calculator','احسب متوسط تكلفة المشروع لكل متر مربع مبني.','Calculate average project cost per built square meter.','project_cost / built_area_sqm','[{"key":"project_cost","label":"تكلفة المشروع","type":"number","required":true,"min":0},{"key":"built_area_sqm","label":"المساحة المبنية م²","type":"number","required":true,"min":0.000001}]'::jsonb,'[{"key":"project_cost","label":"Project cost","type":"number","required":true,"min":0},{"key":"built_area_sqm","label":"Built area (m²)","type":"number","required":true,"min":0.000001}]'::jsonb,11407),
('retail-tools','retail-full-price-sales-rate-calculator','حاسبة نسبة المبيعات بالسعر الكامل','Full-price Sales Rate Calculator','احسب نسبة الوحدات المباعة بالسعر الكامل من إجمالي الوحدات المباعة.','Calculate full-price units as a percentage of total units sold.','full_price_units / units_sold * 100','[{"key":"full_price_units","label":"الوحدات بالسعر الكامل","type":"number","required":true,"min":0},{"key":"units_sold","label":"إجمالي الوحدات المباعة","type":"number","required":true,"min":1}]'::jsonb,'[{"key":"full_price_units","label":"Full-price units","type":"number","required":true,"min":0},{"key":"units_sold","label":"Units sold","type":"number","required":true,"min":1}]'::jsonb,29101),
('logistics-tools','logistics-lost-shipment-rate-calculator','حاسبة نسبة الشحنات المفقودة','Lost Shipment Rate Calculator','احسب نسبة الشحنات المفقودة من إجمالي الشحنات.','Calculate lost shipments as a percentage of total shipments.','lost_shipments / shipments * 100','[{"key":"lost_shipments","label":"الشحنات المفقودة","type":"number","required":true,"min":0},{"key":"shipments","label":"إجمالي الشحنات","type":"number","required":true,"min":1}]'::jsonb,'[{"key":"lost_shipments","label":"Lost shipments","type":"number","required":true,"min":0},{"key":"shipments","label":"Total shipments","type":"number","required":true,"min":1}]'::jsonb,29102),
('construction-tools','construction-change-order-cost-rate-calculator','حاسبة نسبة تكلفة أوامر التغيير','Change Order Cost Rate Calculator','احسب تكلفة أوامر التغيير كنسبة من قيمة العقد الأصلية.','Calculate change-order cost as a percentage of original contract value.','change_order_cost / contract_value * 100','[{"key":"change_order_cost","label":"تكلفة أوامر التغيير","type":"number","required":true,"min":0},{"key":"contract_value","label":"قيمة العقد الأصلية","type":"number","required":true,"min":0.000001}]'::jsonb,'[{"key":"change_order_cost","label":"Change order cost","type":"number","required":true,"min":0},{"key":"contract_value","label":"Original contract value","type":"number","required":true,"min":0.000001}]'::jsonb,29103);

insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,pricing_mode,fixed_points,minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
select s.slug,s.title_ar,s.title_en,s.description_ar,c.id,'formula',jsonb_build_object('submitLabel','احسب','fields',s.input_fields),jsonb_build_object('type','number','format','auto'),jsonb_build_object('expression',s.expression),'free',0,0,false,false,true,s.sort_order,s.title_ar,s.description_ar
from wave9_collision_fix_seed s join public.categories c on c.slug=s.category_slug
on conflict(slug) do update set title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,category_id=excluded.category_id,engine_type=excluded.engine_type,input_schema=excluded.input_schema,output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,pricing_mode='free',fixed_points=0,minimum_points=0,requires_auth=false,is_featured=false,is_active=true,sort_order=excluded.sort_order,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();

insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
select t.id,l.id,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,null
from wave9_collision_fix_seed s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
on conflict(tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,f.value->>'key',f.value->>'label',null,null,f.value->'options'
from wave9_collision_fix_seed s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
cross join lateral jsonb_array_elements(case when l.code='ar' then s.input_fields else s.english_fields end) f(value)
on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=excluded.options,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,'__submit__',case when l.code='ar' then 'احسب' else 'Calculate' end,null,null,null
from wave9_collision_fix_seed s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();

commit;
