-- Web Empire — Non-AI catalog growth wave 2 (file-tools)
begin;

create temporary table file_tools_w2 (
  slug text primary key, title_ar text not null, title_en text not null,
  description_ar text not null, description_en text not null, operations jsonb not null,
  schema_kind text not null check (schema_kind in ('one','aux','case','style')),
  input_ar text not null, input_en text not null, submit_ar text not null, submit_en text not null,
  max_length integer not null, aux_key text, aux_ar text, aux_en text, aux_ph_ar text, aux_ph_en text,
  sort_order integer not null
) on commit drop;

insert into file_tools_w2 values
  ('file-list-descending-sorter', 'ترتيب قائمة الملفات تنازليًا', 'Descending File List Sorter', 'رتب أسماء الملفات من الأخير إلى الأول أبجديًا.', 'Sort filenames in descending alphabetical order.', '[{"type":"sort_lines","direction":"desc"}]'::jsonb, 'one', 'أسماء الملفات', 'Filenames', 'رتب تنازليًا', 'Sort descending', 10000, null, null, null, null, null, 7101),
  ('filename-suffix-adder', 'إضافة لاحقة لأسماء الملفات', 'Filename Suffix Adder', 'أضف لاحقة ثابتة إلى كل اسم ملف في القائمة.', 'Add a fixed suffix to every filename in a list.', '[{"type":"line_suffix","value_key":"suffix"}]'::jsonb, 'aux', 'أسماء الملفات', 'Filenames', 'أضف اللاحقة', 'Add suffix', 10000, 'suffix', 'اللاحقة', 'Suffix', '-final', '-final', 7102),
  ('filename-case-converter', 'محول حالة أسماء الملفات', 'Filename Case Converter', 'حوّل حالة الأحرف في أسماء الملفات بين كبيرة وصغيرة وحالة العنوان.', 'Convert filename letter case between upper, lower, title, and sentence case.', '[{"type":"case","mode_key":"mode"}]'::jsonb, 'case', 'أسماء الملفات', 'Filenames', 'حوّل الحالة', 'Convert case', 10000, null, null, null, null, null, 7103),
  ('file-list-reverser', 'عكس ترتيب قائمة الملفات', 'File List Reverser', 'اعكس ترتيب أسطر قائمة الملفات بسرعة.', 'Reverse the line order of a file list.', '[{"type":"reverse","mode":"lines"}]'::jsonb, 'one', 'قائمة الملفات', 'File list', 'اعكس الترتيب', 'Reverse order', 10000, null, null, null, null, null, 7104),
  ('filename-space-remover', 'حذف المسافات من اسم الملف', 'Filename Space Remover', 'احذف جميع المسافات من اسم ملف أو نص قصير.', 'Remove all whitespace from a filename or short text.', '[{"type":"remove_whitespace"}]'::jsonb, 'one', 'اسم الملف', 'Filename', 'احذف المسافات', 'Remove spaces', 10000, null, null, null, null, null, 7105),
  ('filename-punctuation-cleaner', 'منظف رموز اسم الملف', 'Filename Punctuation Cleaner', 'أزل علامات الترقيم والرموز غير الضرورية من اسم الملف.', 'Remove punctuation and unnecessary symbols from a filename.', '[{"type":"remove_punctuation"},{"type":"collapse_whitespace"}]'::jsonb, 'one', 'اسم الملف', 'Filename', 'نظف الاسم', 'Clean filename', 10000, null, null, null, null, null, 7106),
  ('file-list-clean-sort', 'تنظيف وترتيب قائمة الملفات', 'Clean & Sort File List', 'احذف التكرار ثم رتب قائمة الملفات أبجديًا.', 'Remove duplicates and then sort a filename list alphabetically.', '[{"type":"unique_lines"},{"type":"sort_lines","direction":"asc"}]'::jsonb, 'one', 'أسماء الملفات', 'Filenames', 'نظف ورتب', 'Clean and sort', 10000, null, null, null, null, null, 7107),
  ('file-list-bullet-formatter', 'تنسيق قائمة الملفات بنقاط', 'File List Bullet Formatter', 'أضف نقطة تعداد إلى كل اسم ملف لعرض القائمة بشكل منظم.', 'Add a bullet to every filename for a cleaner list.', '[{"type":"line_prefix","value":"• "}]'::jsonb, 'one', 'أسماء الملفات', 'Filenames', 'نسق القائمة', 'Format list', 10000, null, null, null, null, null, 7108),
  ('filename-stats', 'إحصاءات اسم الملف', 'Filename Stats', 'احسب عدد الكلمات والأحرف في اسم ملف أو مسار نصي.', 'Count words and characters in a filename or text path.', '[{"type":"stats"}]'::jsonb, 'one', 'اسم الملف أو المسار', 'Filename or path', 'احسب الإحصاءات', 'Calculate stats', 10000, null, null, null, null, null, 7109),
  ('file-inventory-normalizer', 'منظف جرد الملفات', 'File Inventory Normalizer', 'نظف قائمة جرد الملفات من الأسطر المكررة ورتبها لسهولة المراجعة.', 'Clean a file inventory by removing duplicate lines and sorting it.', '[{"type":"unique_lines"},{"type":"sort_lines","direction":"asc"}]'::jsonb, 'one', 'قائمة جرد الملفات', 'File inventory', 'نظف الجرد', 'Clean inventory', 10000, null, null, null, null, null, 7110);

create temporary table file_tools_w2_ready as
select seed.*,
  jsonb_build_object('fields',
    case seed.schema_kind
      when 'one' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length))
      when 'aux' then jsonb_build_array(
        jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length),
        jsonb_build_object('key',seed.aux_key,'label',seed.aux_ar,'type','text','required',true,'placeholder',coalesce(seed.aux_ph_ar,''),'maxLength',100))
      when 'case' then jsonb_build_array(
        jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length),
        jsonb_build_object('key','mode','label','الحالة','type','select','required',true,'defaultValue','lowercase','options','[{"value":"uppercase","label":"أحرف كبيرة"},{"value":"lowercase","label":"أحرف صغيرة"},{"value":"title","label":"حالة العنوان"},{"value":"sentence","label":"حالة الجملة"}]'::jsonb))
      else jsonb_build_array(
        jsonb_build_object('key','text','label',seed.input_ar,'type','textarea','required',true,'placeholder','أدخل النص هنا...','maxLength',seed.max_length),
        jsonb_build_object('key','style','label','النمط','type','select','required',true,'defaultValue','sparkles','options','[{"value":"stars","label":"نجوم"},{"value":"sparkles","label":"لمعان"},{"value":"hearts","label":"قلوب"},{"value":"brackets","label":"أقواس"},{"value":"quotes","label":"اقتباس"},{"value":"arrows","label":"أسهم"}]'::jsonb))
    end,'submitLabel',seed.submit_ar) as schema_ar,
  jsonb_build_object('fields',
    case seed.schema_kind
      when 'one' then jsonb_build_array(jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length))
      when 'aux' then jsonb_build_array(
        jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length),
        jsonb_build_object('key',seed.aux_key,'label',seed.aux_en,'type','text','required',true,'placeholder',coalesce(seed.aux_ph_en,''),'maxLength',100))
      when 'case' then jsonb_build_array(
        jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length),
        jsonb_build_object('key','mode','label','Case','type','select','required',true,'defaultValue','lowercase','options','[{"value":"uppercase","label":"UPPERCASE"},{"value":"lowercase","label":"lowercase"},{"value":"title","label":"Title Case"},{"value":"sentence","label":"Sentence case"}]'::jsonb))
      else jsonb_build_array(
        jsonb_build_object('key','text','label',seed.input_en,'type','textarea','required',true,'placeholder','Enter text here...','maxLength',seed.max_length),
        jsonb_build_object('key','style','label','Style','type','select','required',true,'defaultValue','sparkles','options','[{"value":"stars","label":"Stars"},{"value":"sparkles","label":"Sparkles"},{"value":"hearts","label":"Hearts"},{"value":"brackets","label":"Brackets"},{"value":"quotes","label":"Quotes"},{"value":"arrows","label":"Arrows"}]'::jsonb))
    end,'submitLabel',seed.submit_en) as schema_en
from file_tools_w2 seed;

insert into public.tools(
  slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,
  provider_strategy,model_alias,prompt_template,pricing_mode,fixed_points,minimum_points,cost_multiplier,
  requires_auth,is_featured,is_active,sort_order,seo_title,seo_description
)
select seed.slug,seed.title_ar,seed.title_en,seed.description_ar,c.id,'text_transform'::public.tool_engine_type,
 seed.schema_ar,'{}'::jsonb,jsonb_build_object('input_key','text','operations',seed.operations),
 'primary_with_fallback'::public.provider_strategy_type,null,null,'free'::public.pricing_mode_type,0,0,1,false,false,true,
 seed.sort_order,seed.title_ar,seed.description_ar
from file_tools_w2_ready seed join public.categories c on c.slug='file-tools'
on conflict (slug) do update set
 title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,category_id=excluded.category_id,
 engine_type=excluded.engine_type,input_schema=excluded.input_schema,output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,
 model_alias=null,prompt_template=null,pricing_mode='free'::public.pricing_mode_type,fixed_points=0,minimum_points=0,cost_multiplier=1,
 requires_auth=false,is_featured=false,is_active=true,sort_order=excluded.sort_order,seo_title=excluded.seo_title,
 seo_description=excluded.seo_description,updated_at=now();

insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
select t.id,l.id,case when l.code='ar' then s.title_ar else s.title_en end,
 case when l.code='ar' then s.description_ar else s.description_en end,
 case when l.code='ar' then s.title_ar else s.title_en end,
 case when l.code='ar' then s.description_ar else s.description_en end,null
from file_tools_w2_ready s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
on conflict (tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,
 seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,f->>'key',f->>'label',nullif(f->>'placeholder',''),nullif(f->>'helpText',''),f->'options'
from file_tools_w2_ready s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
cross join lateral jsonb_array_elements(case when l.code='ar' then s.schema_ar->'fields' else s.schema_en->'fields' end) f
on conflict (tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=excluded.placeholder,
 help_text=excluded.help_text,options=excluded.options,updated_at=now();

insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
select t.id,l.id,'__submit__',case when l.code='ar' then s.submit_ar else s.submit_en end,null,null,null
from file_tools_w2_ready s join public.tools t on t.slug=s.slug join public.locales l on l.code in ('ar','en')
on conflict (tool_id,locale_id,field_key) do update set label=excluded.label,updated_at=now();

commit;
