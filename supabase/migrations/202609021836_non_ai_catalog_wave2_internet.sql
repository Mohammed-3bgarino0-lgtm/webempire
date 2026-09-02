-- Web Empire — Non-AI catalog growth wave 2 (internet-tools)
begin;

create temporary table internet_tools_w2 (
  slug text primary key, title_ar text not null, title_en text not null,
  description_ar text not null, description_en text not null, operations jsonb not null,
  schema_kind text not null check (schema_kind in ('one','aux','case','style')),
  input_ar text not null, input_en text not null, submit_ar text not null, submit_en text not null,
  max_length integer not null, aux_key text, aux_ar text, aux_en text, aux_ph_ar text, aux_ph_en text,
  sort_order integer not null
) on commit drop;

insert into internet_tools_w2 values
  ('domain-https-prefixer', 'إضافة HTTPS للنطاقات', 'HTTPS Domain Prefixer', 'أضف https:// إلى كل نطاق في قائمة جاهزة.', 'Add https:// to every domain in a prepared list.', '[{"type":"line_prefix","value":"https://"}]'::jsonb, 'one', 'النطاقات', 'Domains', 'أضف HTTPS', 'Add HTTPS', 10000, null, null, null, null, null, 7201),
  ('domain-www-prefixer', 'إضافة WWW للنطاقات', 'WWW Domain Prefixer', 'أضف www. إلى كل نطاق في قائمة.', 'Add www. to every domain in a list.', '[{"type":"line_prefix","value":"www."}]'::jsonb, 'one', 'النطاقات', 'Domains', 'أضف WWW', 'Add WWW', 10000, null, null, null, null, null, 7202),
  ('domain-list-descending-sorter', 'ترتيب النطاقات تنازليًا', 'Descending Domain Sorter', 'رتب قائمة النطاقات تنازليًا.', 'Sort a domain list in descending order.', '[{"type":"sort_lines","direction":"desc"}]'::jsonb, 'one', 'النطاقات', 'Domains', 'رتب تنازليًا', 'Sort descending', 10000, null, null, null, null, null, 7203),
  ('domain-list-counter', 'عداد قائمة النطاقات', 'Domain List Counter', 'احسب عدد الأسطر والكلمات والأحرف في قائمة نطاقات.', 'Count lines, words, and characters in a domain list.', '[{"type":"stats"}]'::jsonb, 'one', 'قائمة النطاقات', 'Domain list', 'احسب', 'Count', 10000, null, null, null, null, null, 7204),
  ('url-list-reverser', 'عكس قائمة الروابط', 'URL List Reverser', 'اعكس ترتيب أسطر قائمة الروابط.', 'Reverse the line order of a URL list.', '[{"type":"reverse","mode":"lines"}]'::jsonb, 'one', 'الروابط', 'URLs', 'اعكس القائمة', 'Reverse list', 10000, null, null, null, null, null, 7205),
  ('url-list-lowercase', 'تحويل الروابط إلى أحرف صغيرة', 'URL Lowercase Converter', 'حوّل نص الروابط إلى أحرف إنجليزية صغيرة.', 'Convert URL text to lowercase.', '[{"type":"lowercase"}]'::jsonb, 'one', 'الروابط', 'URLs', 'حوّل لأحرف صغيرة', 'Convert to lowercase', 10000, null, null, null, null, null, 7206),
  ('web-keyword-cleaner', 'منظف الكلمات المفتاحية', 'Web Keyword Cleaner', 'نظف قائمة الكلمات المفتاحية من التكرار ورتبها أبجديًا.', 'Remove duplicate keywords and sort the list alphabetically.', '[{"type":"unique_lines"},{"type":"sort_lines","direction":"asc"}]'::jsonb, 'one', 'الكلمات المفتاحية', 'Keywords', 'نظف الكلمات', 'Clean keywords', 10000, null, null, null, null, null, 7207),
  ('web-keyword-hashtag-maker', 'تحويل الكلمات المفتاحية إلى هاشتاقات', 'Keyword to Hashtag Converter', 'حوّل كلمات أو عبارات إلى هاشتاقات قابلة للنسخ.', 'Convert keywords or phrases into copy-ready hashtags.', '[{"type":"trim"},{"type":"hashtags"}]'::jsonb, 'one', 'الكلمات المفتاحية', 'Keywords', 'أنشئ الهاشتاقات', 'Create hashtags', 10000, null, null, null, null, null, 7208),
  ('web-copy-line-collapser', 'دمج أسطر النص المنسوخ من الويب', 'Web Copy Line Collapser', 'حوّل النص متعدد الأسطر المنسوخ من الويب إلى فقرة نظيفة.', 'Turn multi-line copied web text into one clean paragraph.', '[{"type":"collapse_lines"}]'::jsonb, 'one', 'النص المنسوخ', 'Copied text', 'ادمج الأسطر', 'Collapse lines', 10000, null, null, null, null, null, 7209),
  ('url-list-bullet-formatter', 'تنسيق قائمة الروابط بنقاط', 'URL List Bullet Formatter', 'أضف تعدادًا نقطيًا إلى كل رابط في القائمة.', 'Add bullet formatting to every URL in a list.', '[{"type":"line_prefix","value":"• "}]'::jsonb, 'one', 'الروابط', 'URLs', 'نسق الروابط', 'Format URLs', 10000, null, null, null, null, null, 7210);

create temporary table internet_tools_w2_ready as
select seed.*,
  jsonb_build_object('fields',
    case seed.schema_kind
      when 'one' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length))
      when 'aux' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length),jsonb_build_object('key',seed.aux_key,'label',seed.aux_ar,'type','text','required',true,'placeholder',coalesce(seed.aux_ph_ar,''),'maxLength',100))
      when 'case' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length),jsonb_build_object('key','mode','label','الحالة','type','select','required',true,'defaultValue','lowercase','options','[{"value":"uppercase","label":"أحرف كبيرة"},{"value":"lowercase","label":"أحرف صغيرة"},{"value":"title","label":"حالة العنوان"},{"value":"sentence","label":"حالة الجملة"}]'::jsonb))
      else jsonb_build_array(jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length),jsonb_build_object('key','style','label','النمط','type','select','required',true,'defaultValue','sparkles','options','[{"value":"stars","label":"نجوم"},{"value":"sparkles","label":"لمعان"},{"value":"hearts","label":"قلوب"},{"value":"brackets","label":"أقواس"},{"value":"quotes","label":"اقتباس"},{"value":"arrows","label":"أسهم"}]'::jsonb))
    end,'submitLabel',seed.submit_ar) as schema_ar,
  jsonb_build_object('fields',
    case seed.schema_kind
      when 'one' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length))
      when 'aux' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length),jsonb_build_object('key',seed.aux_key,'label',seed.aux_en,'type','text','required',true,'placeholder',coalesce(seed.aux_ph_en,''),'maxLength',100))
      when 'case' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length),jsonb_build_object('key','mode','label','Case','type','select','required',true,'defaultValue','lowercase','options','[{"value":"uppercase","label":"UPPERCASE"},{"value":"lowercase","label":"lowercase"},{"value":"title","label":"Title Case"},{"value":"sentence","label":"Sentence case"}]'::jsonb))
      else jsonb_build_array(jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length),jsonb_build_object('key','style','label','Style','type','select','required',true,'defaultValue','sparkles','options','[{"value":"stars","label":"Stars"},{"value":"sparkles","label":"Sparkles"},{"value":"hearts","label":"Hearts"},{"value":"brackets","label":"Brackets"},{"value":"quotes","label":"Quotes"},{"value":"arrows","label":"Arrows"}]'::jsonb))
    end,'submitLabel',seed.submit_en) as schema_en
from internet_tools_w2 seed;

insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,provider_strategy,model_alias,prompt_template,pricing_mode,fixed_points,minimum_points,cost_multiplier,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
select seed.slug,seed.title_ar,seed.title_en,seed.description_ar,c.id,'text_transform'::public.tool_engine_type,seed.schema_ar,'{}'::jsonb,jsonb_build_object('input_key','text','operations',seed.operations),'primary_with_fallback'::public.provider_strategy_type,null,null,'free'::public.pricing_mode_type,0,0,1,false,false,true,seed.sort_order,seed.title_ar,seed.description_ar
from internet_tools_w2_ready seed join public.categories c on c.slug='internet-tools'
on conflict (slug) do update set title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,category_id=excluded.category_id,engine_type=excluded.engine_type,input_schema=excluded.input_schema,output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,model_alias=null,prompt_template=null,pricing_mode='free'::public.pricing_mode_type,fixed_points=0,minimum_points=0,cost_multiplier=1,requires_auth=false,is_featured=false,is_active=true,sort_order=excluded.sort_order,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();

insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
select t.id,l.id,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,null
from internet_tools_w2_ready s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
on conflict (tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,f->>'key',f->>'label',nullif(f->>'placeholder',''),nullif(f->>'helpText',''),f->'options'
from internet_tools_w2_ready s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en') cross join lateral jsonb_array_elements(case when l.code='ar' then s.schema_ar->'fields' else s.schema_en->'fields' end) f
on conflict (tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=excluded.placeholder,help_text=excluded.help_text,options=excluded.options,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,'__submit__',case when l.code='ar' then s.submit_ar else s.submit_en end,null,null,null from internet_tools_w2_ready s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
on conflict (tool_id,locale_id,field_key) do update set label=excluded.label,updated_at=now();

commit;
