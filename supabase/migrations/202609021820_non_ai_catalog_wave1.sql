-- Web Empire — Non-AI catalog growth wave 1
-- Adds 20 deterministic local text utilities to previously empty categories.
-- No AI providers, external APIs, scraping, or network calls.

begin;

create temporary table non_ai_wave1_seed (
  category_slug text not null,
  slug text primary key,
  title_ar text not null,
  title_en text not null,
  description_ar text not null,
  description_en text not null,
  operations jsonb not null,
  schema_ar jsonb not null,
  schema_en jsonb not null,
  sort_order integer not null,
  is_featured boolean not null
) on commit drop;

insert into non_ai_wave1_seed(
  category_slug, slug, title_ar, title_en, description_ar, description_en,
  operations, schema_ar, schema_en, sort_order, is_featured
)
values
  ('file-tools', 'filename-slug-generator', 'مولد اسم ملف آمن', 'Safe Filename Slug Generator', 'حوّل اسم الملف أو العنوان إلى صيغة نظيفة مناسبة لأسماء الملفات والروابط.', 'Turn a filename or title into a clean slug suitable for files and URLs.', '[{"type":"trim"},{"type":"slugify"}]'::jsonb, '{"fields":[{"key":"text","label":"اسم الملف أو العنوان","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"حوّل الاسم"}'::jsonb, '{"fields":[{"key":"text","label":"Filename or title","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Generate slug"}'::jsonb, 7001, false),
  ('file-tools', 'file-list-sorter', 'مرتب قائمة الملفات', 'File List Sorter', 'رتب قائمة أسماء الملفات أبجديًا سطرًا بسطر.', 'Sort a list of filenames alphabetically, one per line.', '[{"type":"sort_lines","direction":"asc"}]'::jsonb, '{"fields":[{"key":"text","label":"أسماء الملفات","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"رتب الملفات"}'::jsonb, '{"fields":[{"key":"text","label":"Filenames","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Sort files"}'::jsonb, 7002, false),
  ('file-tools', 'duplicate-file-list-remover', 'حذف أسماء الملفات المكررة', 'Duplicate Filename Remover', 'احذف أسماء الملفات المكررة من قائمة نصية مع الحفاظ على أول ظهور.', 'Remove duplicate filenames from a text list while keeping the first occurrence.', '[{"type":"unique_lines"}]'::jsonb, '{"fields":[{"key":"text","label":"أسماء الملفات","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"احذف التكرار"}'::jsonb, '{"fields":[{"key":"text","label":"Filenames","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Remove duplicates"}'::jsonb, 7003, false),
  ('file-tools', 'file-list-counter', 'عداد قائمة الملفات', 'File List Counter', 'احسب عدد الأسطر والكلمات والأحرف في قائمة الملفات.', 'Count lines, words, and characters in a file list.', '[{"type":"stats"}]'::jsonb, '{"fields":[{"key":"text","label":"قائمة الملفات","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"احسب"}'::jsonb, '{"fields":[{"key":"text","label":"File list","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Count"}'::jsonb, 7004, false),
  ('file-tools', 'file-list-prefixer', 'إضافة بادئة لأسماء الملفات', 'Filename Prefix Adder', 'أضف بادئة ثابتة إلى كل اسم ملف في القائمة.', 'Add a fixed prefix to every filename in a list.', '[{"type":"line_prefix","value_key":"prefix"}]'::jsonb, '{"fields":[{"key":"text","label":"أسماء الملفات","type":"textarea","required":true,"placeholder":"ضع اسمًا واحدًا في كل سطر","maxLength":10000},{"key":"prefix","label":"البادئة","type":"text","required":true,"placeholder":"مثال: project-","maxLength":100}],"submitLabel":"أضف البادئة"}'::jsonb, '{"fields":[{"key":"text","label":"Filenames","type":"textarea","required":true,"placeholder":"Put one filename per line","maxLength":10000},{"key":"prefix","label":"Prefix","type":"text","required":true,"placeholder":"Example: project-","maxLength":100}],"submitLabel":"Add prefix"}'::jsonb, 7005, false),
  ('internet-tools', 'url-slug-generator', 'مولد Slug للرابط', 'URL Slug Generator', 'حوّل عنوان صفحة أو عبارة إلى مسار URL نظيف.', 'Turn a page title or phrase into a clean URL slug.', '[{"type":"trim"},{"type":"slugify"}]'::jsonb, '{"fields":[{"key":"text","label":"العنوان أو العبارة","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"أنشئ الرابط"}'::jsonb, '{"fields":[{"key":"text","label":"Title or phrase","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Generate slug"}'::jsonb, 7006, false),
  ('internet-tools', 'html-text-cleaner', 'منظف النص من HTML', 'HTML Text Cleaner', 'استخرج النص المقروء من مقطع HTML وأزل الوسوم.', 'Extract readable text from an HTML snippet by stripping tags.', '[{"type":"strip_html"},{"type":"collapse_whitespace"}]'::jsonb, '{"fields":[{"key":"text","label":"كود HTML","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نظف النص"}'::jsonb, '{"fields":[{"key":"text","label":"HTML code","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Clean text"}'::jsonb, 7007, false),
  ('internet-tools', 'web-text-whitespace-cleaner', 'منظف مسافات النص للويب', 'Web Text Whitespace Cleaner', 'وحّد المسافات الزائدة في النصوص المنسوخة من الويب.', 'Normalize excessive whitespace in text copied from the web.', '[{"type":"trim"},{"type":"collapse_whitespace"}]'::jsonb, '{"fields":[{"key":"text","label":"النص","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نظف المسافات"}'::jsonb, '{"fields":[{"key":"text","label":"Text","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Clean whitespace"}'::jsonb, 7008, false),
  ('internet-tools', 'web-lines-sorter', 'مرتب قوائم الويب', 'Web List Sorter', 'رتب قائمة نطاقات أو روابط أو كلمات مفتاحية أبجديًا.', 'Sort a list of domains, URLs, or keywords alphabetically.', '[{"type":"sort_lines","direction":"asc"}]'::jsonb, '{"fields":[{"key":"text","label":"القائمة","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"رتب القائمة"}'::jsonb, '{"fields":[{"key":"text","label":"List","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Sort list"}'::jsonb, 7009, false),
  ('internet-tools', 'web-list-deduplicator', 'حذف تكرار قوائم الويب', 'Web List Deduplicator', 'احذف العناصر المكررة من قائمة روابط أو نطاقات أو كلمات.', 'Remove duplicates from a list of URLs, domains, or keywords.', '[{"type":"unique_lines"}]'::jsonb, '{"fields":[{"key":"text","label":"القائمة","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"احذف التكرار"}'::jsonb, '{"fields":[{"key":"text","label":"List","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Remove duplicates"}'::jsonb, 7010, false),
  ('social-media-tools', 'social-hashtag-generator', 'مولد هاشتاقات', 'Social Hashtag Generator', 'حوّل الكلمات والعبارات إلى هاشتاقات مرتبة قابلة للنسخ.', 'Turn words and phrases into copy-ready social hashtags.', '[{"type":"trim"},{"type":"hashtags"}]'::jsonb, '{"fields":[{"key":"text","label":"الكلمات أو العبارات","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"أنشئ الهاشتاقات"}'::jsonb, '{"fields":[{"key":"text","label":"Words or phrases","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Generate hashtags"}'::jsonb, 7011, false),
  ('social-media-tools', 'caption-cleaner', 'منظف الكابشن', 'Caption Cleaner', 'نظف الكابشن من المسافات والأسطر غير الضرورية.', 'Clean captions by normalizing unnecessary spaces and lines.', '[{"type":"trim"},{"type":"collapse_whitespace"}]'::jsonb, '{"fields":[{"key":"text","label":"الكابشن","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نظف الكابشن"}'::jsonb, '{"fields":[{"key":"text","label":"Caption","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Clean caption"}'::jsonb, 7012, false),
  ('social-media-tools', 'social-bio-counter', 'عداد البايو', 'Social Bio Counter', 'احسب الكلمات والأحرف والأسطر في البايو أو الوصف.', 'Count words, characters, and lines in a social bio or description.', '[{"type":"stats"}]'::jsonb, '{"fields":[{"key":"text","label":"البايو أو الوصف","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"احسب الطول"}'::jsonb, '{"fields":[{"key":"text","label":"Bio or description","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Count length"}'::jsonb, 7013, false),
  ('social-media-tools', 'social-username-slug', 'منظف اسم المستخدم', 'Social Username Cleaner', 'حوّل الاسم إلى صيغة نظيفة سهلة الاستخدام كاسم مستخدم أو معرف.', 'Convert a name into a clean form suitable for a username or handle.', '[{"type":"trim"},{"type":"slugify"}]'::jsonb, '{"fields":[{"key":"text","label":"الاسم","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نظف الاسم"}'::jsonb, '{"fields":[{"key":"text","label":"Name","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Clean username"}'::jsonb, 7014, false),
  ('social-media-tools', 'social-bullet-list-formatter', 'منسق قائمة للمنشورات', 'Social Bullet List Formatter', 'أضف علامة نقطية إلى كل سطر لإنشاء قائمة جاهزة للمنشورات.', 'Add a bullet to each line for a social-post-ready list.', '[{"type":"line_prefix","value":"• "}]'::jsonb, '{"fields":[{"key":"text","label":"الأسطر","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نسق القائمة"}'::jsonb, '{"fields":[{"key":"text","label":"Lines","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Format list"}'::jsonb, 7015, false),
  ('whatsapp-tools', 'whatsapp-message-cleaner', 'منظف رسالة واتساب', 'WhatsApp Message Cleaner', 'نظف الرسالة من المسافات الزائدة قبل إرسالها.', 'Clean excessive whitespace from a WhatsApp message before sending.', '[{"type":"trim"},{"type":"collapse_whitespace"}]'::jsonb, '{"fields":[{"key":"text","label":"الرسالة","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نظف الرسالة"}'::jsonb, '{"fields":[{"key":"text","label":"Message","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Clean message"}'::jsonb, 7016, false),
  ('whatsapp-tools', 'whatsapp-broadcast-list-cleaner', 'منظف قائمة البث', 'WhatsApp Broadcast List Cleaner', 'احذف التكرار ورتب قائمة أسماء أو أرقام البث سطرًا بسطر.', 'Remove duplicates and sort a broadcast list of names or numbers.', '[{"type":"unique_lines"},{"type":"sort_lines","direction":"asc"}]'::jsonb, '{"fields":[{"key":"text","label":"قائمة البث","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نظف القائمة"}'::jsonb, '{"fields":[{"key":"text","label":"Broadcast list","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Clean list"}'::jsonb, 7017, false),
  ('whatsapp-tools', 'whatsapp-bold-text', 'تنسيق واتساب عريض', 'WhatsApp Bold Text Formatter', 'ضع النص بين علامتي النجمة ليظهر عريضًا في واتساب.', 'Wrap text in asterisks so it appears bold in WhatsApp.', '[{"type":"trim"},{"type":"prefix","value":"*"},{"type":"suffix","value":"*"}]'::jsonb, '{"fields":[{"key":"text","label":"النص","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نسق النص"}'::jsonb, '{"fields":[{"key":"text","label":"Text","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Format text"}'::jsonb, 7018, false),
  ('whatsapp-tools', 'whatsapp-quote-formatter', 'منسق اقتباس واتساب', 'WhatsApp Quote Formatter', 'أضف علامة الاقتباس إلى بداية كل سطر لنسخه في واتساب.', 'Add a quote marker to each line for use in WhatsApp.', '[{"type":"line_prefix","value":"> "}]'::jsonb, '{"fields":[{"key":"text","label":"النص أو الأسطر","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نسق الاقتباس"}'::jsonb, '{"fields":[{"key":"text","label":"Text or lines","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Format quote"}'::jsonb, 7019, false),
  ('whatsapp-tools', 'whatsapp-list-formatter', 'منسق قائمة واتساب', 'WhatsApp List Formatter', 'حوّل الأسطر إلى قائمة نقطية جاهزة للإرسال في واتساب.', 'Turn lines into a bullet list ready to send in WhatsApp.', '[{"type":"line_prefix","value":"• "}]'::jsonb, '{"fields":[{"key":"text","label":"العناصر","type":"textarea","required":true,"placeholder":"أدخل النص هنا...","maxLength":10000}],"submitLabel":"نسق القائمة"}'::jsonb, '{"fields":[{"key":"text","label":"Items","type":"textarea","required":true,"placeholder":"Enter text here...","maxLength":10000}],"submitLabel":"Format list"}'::jsonb, 7020, false);

insert into public.tools(
  slug, title_ar, title_en, short_description, category_id, engine_type,
  input_schema, output_schema, runtime_config, provider_strategy, model_alias,
  prompt_template, pricing_mode, fixed_points, minimum_points, cost_multiplier,
  requires_auth, is_featured, is_active, sort_order, seo_title, seo_description
)
select
  seed.slug,
  seed.title_ar,
  seed.title_en,
  seed.description_ar,
  category.id,
  'text_transform'::public.tool_engine_type,
  seed.schema_ar,
  '{}'::jsonb,
  jsonb_build_object('input_key','text','operations',seed.operations),
  'primary_with_fallback'::public.provider_strategy_type,
  null,
  null,
  'free'::public.pricing_mode_type,
  0,
  0,
  1,
  false,
  seed.is_featured,
  true,
  seed.sort_order,
  seed.title_ar,
  seed.description_ar
from non_ai_wave1_seed seed
join public.categories category on category.slug = seed.category_slug
on conflict (slug) do update set
  title_ar = excluded.title_ar,
  title_en = excluded.title_en,
  short_description = excluded.short_description,
  category_id = excluded.category_id,
  engine_type = excluded.engine_type,
  input_schema = excluded.input_schema,
  output_schema = excluded.output_schema,
  runtime_config = excluded.runtime_config,
  model_alias = null,
  prompt_template = null,
  pricing_mode = 'free'::public.pricing_mode_type,
  fixed_points = 0,
  minimum_points = 0,
  cost_multiplier = 1,
  requires_auth = false,
  is_featured = excluded.is_featured,
  is_active = true,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();

insert into public.tool_translations(
  tool_id, locale_id, title, short_description, seo_title, seo_description,
  prompt_template_override
)
select
  tool.id,
  locale.id,
  case when locale.code='ar' then seed.title_ar else seed.title_en end,
  case when locale.code='ar' then seed.description_ar else seed.description_en end,
  case when locale.code='ar' then seed.title_ar else seed.title_en end,
  case when locale.code='ar' then seed.description_ar else seed.description_en end,
  null
from non_ai_wave1_seed seed
join public.tools tool on tool.slug=seed.slug
join public.locales locale on locale.code in ('ar','en')
on conflict (tool_id, locale_id) do update set
  title=excluded.title,
  short_description=excluded.short_description,
  seo_title=excluded.seo_title,
  seo_description=excluded.seo_description,
  prompt_template_override=null,
  updated_at=now();

insert into public.tool_field_translations(
  tool_id, locale_id, field_key, label, placeholder, help_text, options
)
select
  tool.id,
  locale.id,
  field->>'key',
  field->>'label',
  nullif(field->>'placeholder',''),
  null,
  coalesce(field->'options','[]'::jsonb)
from non_ai_wave1_seed seed
join public.tools tool on tool.slug=seed.slug
join public.locales locale on locale.code in ('ar','en')
cross join lateral jsonb_array_elements(
  case when locale.code='ar' then seed.schema_ar->'fields' else seed.schema_en->'fields' end
) field
on conflict (tool_id, locale_id, field_key) do update set
  label=excluded.label,
  placeholder=excluded.placeholder,
  help_text=excluded.help_text,
  options=excluded.options,
  updated_at=now();

insert into public.tool_field_translations(
  tool_id, locale_id, field_key, label, placeholder, help_text, options
)
select
  tool.id,
  locale.id,
  '__submit__',
  case when locale.code='ar' then seed.schema_ar->>'submitLabel' else seed.schema_en->>'submitLabel' end,
  null,
  null,
  '[]'::jsonb
from non_ai_wave1_seed seed
join public.tools tool on tool.slug=seed.slug
join public.locales locale on locale.code in ('ar','en')
on conflict (tool_id, locale_id, field_key) do update set
  label=excluded.label,
  placeholder=null,
  help_text=null,
  options='[]'::jsonb,
  updated_at=now();

commit;
