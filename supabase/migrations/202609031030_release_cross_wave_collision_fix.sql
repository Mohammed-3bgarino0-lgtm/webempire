-- Release fix for two cross-wave slug collisions between Wave 5 and Wave 7.
-- Restore the original Wave 5 tools to their original categories and add
-- distinct Wave 7 replacements so the coordinated release adds 800 unique tools.

begin;

update public.tools
set category_id=(select id from public.categories where slug='creator-tools'), sort_order=11507, updated_at=now()
where slug='newsletter-revenue-per-subscriber-calculator';

update public.tools
set category_id=(select id from public.categories where slug='design-tools'), sort_order=11803, updated_at=now()
where slug='image-megapixels-calculator';

insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,pricing_mode,fixed_points,minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
values
('online-income-revenue-per-transaction-calculator','حاسبة دخل الإنترنت لكل معاملة','Online Income Revenue per Transaction Calculator','احسب متوسط دخل الإنترنت الناتج عن كل معاملة مكتملة.',(select id from public.categories where slug='online-income-tools'),'formula','{"submitLabel":"احسب","fields":[{"key":"online_revenue","label":"إجمالي دخل الإنترنت","type":"number","required":true,"step":0.01,"min":0},{"key":"transactions","label":"عدد المعاملات","type":"number","required":true,"step":1,"min":1}]}'::jsonb,'{"type":"number","format":"auto"}'::jsonb,'{"expression":"online_revenue / transactions"}'::jsonb,'free',0,0,false,false,true,15001,'حاسبة دخل الإنترنت لكل معاملة','احسب متوسط دخل الإنترنت الناتج عن كل معاملة مكتملة.'),
('photo-file-size-per-megapixel-calculator','حاسبة حجم ملف الصورة لكل ميجابكسل','Photo File Size per Megapixel Calculator','احسب متوسط حجم ملف الصورة بالميجابايت لكل ميجابكسل.',(select id from public.categories where slug='photography-tools'),'formula','{"submitLabel":"احسب","fields":[{"key":"file_size_mb","label":"حجم الملف MB","type":"number","required":true,"step":0.01,"min":0},{"key":"megapixels","label":"الميجابكسل","type":"number","required":true,"step":0.01,"min":0.000001}]}'::jsonb,'{"type":"number","format":"auto"}'::jsonb,'{"expression":"file_size_mb / megapixels"}'::jsonb,'free',0,0,false,false,true,15041,'حاسبة حجم ملف الصورة لكل ميجابكسل','احسب متوسط حجم ملف الصورة بالميجابايت لكل ميجابكسل.')
on conflict(slug) do nothing;

insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
select t.id,l.id,
case when l.code='ar' then x.title_ar else x.title_en end,
case when l.code='ar' then x.desc_ar else x.desc_en end,
case when l.code='ar' then x.title_ar else x.title_en end,
case when l.code='ar' then x.desc_ar else x.desc_en end,null
from (values
('online-income-revenue-per-transaction-calculator','حاسبة دخل الإنترنت لكل معاملة','Online Income Revenue per Transaction Calculator','احسب متوسط دخل الإنترنت الناتج عن كل معاملة مكتملة.','Calculate average online income revenue generated per completed transaction.'),
('photo-file-size-per-megapixel-calculator','حاسبة حجم ملف الصورة لكل ميجابكسل','Photo File Size per Megapixel Calculator','احسب متوسط حجم ملف الصورة بالميجابايت لكل ميجابكسل.','Calculate average photo file size in megabytes per megapixel.')
) x(slug,title_ar,title_en,desc_ar,desc_en)
join public.tools t on t.slug=x.slug
join public.locales l on l.code in('ar','en')
on conflict(tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,x.field_key,case when l.code='ar' then x.ar_label else x.en_label end,null,null,null
from (values
('online-income-revenue-per-transaction-calculator','online_revenue','إجمالي دخل الإنترنت','Online revenue'),
('online-income-revenue-per-transaction-calculator','transactions','عدد المعاملات','Transactions'),
('online-income-revenue-per-transaction-calculator','__submit__','احسب','Calculate'),
('photo-file-size-per-megapixel-calculator','file_size_mb','حجم الملف MB','File size MB'),
('photo-file-size-per-megapixel-calculator','megapixels','الميجابكسل','Megapixels'),
('photo-file-size-per-megapixel-calculator','__submit__','احسب','Calculate')
) x(slug,field_key,ar_label,en_label)
join public.tools t on t.slug=x.slug
join public.locales l on l.code in('ar','en')
on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();

commit;
