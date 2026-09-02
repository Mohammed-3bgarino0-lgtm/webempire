-- Web Empire wave 4 helper for staging deterministic formula tools.
-- Temporary migration helper: later removed by the wave4 cleanup migration.

create or replace function public._wave4_upsert_formula_tools(
  p_category_slug text,
  p_tools jsonb
)
returns void
language plpgsql
as $$
begin
  insert into public.tools(
    slug,title_ar,title_en,short_description,category_id,engine_type,
    input_schema,output_schema,runtime_config,pricing_mode,fixed_points,
    minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description
  )
  select
    seed.slug,
    seed.title_ar,
    seed.title_en,
    seed.description_ar,
    category.id,
    'formula',
    jsonb_build_object('submitLabel',coalesce(seed.submit_ar,'احسب'),'fields',seed.input_fields),
    jsonb_build_object('type','number','format','auto'),
    jsonb_build_object('expression',seed.expression),
    'free',0,0,false,false,true,seed.sort_order,seed.title_ar,seed.description_ar
  from jsonb_to_recordset(p_tools) as seed(
    slug text,
    title_ar text,
    title_en text,
    description_ar text,
    description_en text,
    expression text,
    input_fields jsonb,
    english_fields jsonb,
    submit_ar text,
    submit_en text,
    sort_order integer
  )
  join public.categories category on category.slug = p_category_slug
  on conflict(slug) do update set
    title_ar=excluded.title_ar,
    title_en=excluded.title_en,
    short_description=excluded.short_description,
    category_id=excluded.category_id,
    engine_type=excluded.engine_type,
    input_schema=excluded.input_schema,
    output_schema=excluded.output_schema,
    runtime_config=excluded.runtime_config,
    pricing_mode=excluded.pricing_mode,
    fixed_points=0,
    minimum_points=0,
    requires_auth=false,
    is_featured=false,
    is_active=true,
    sort_order=excluded.sort_order,
    seo_title=excluded.seo_title,
    seo_description=excluded.seo_description,
    updated_at=now();

  insert into public.tool_translations(
    tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override
  )
  select
    tool.id,
    locale.id,
    case when locale.code='ar' then seed.title_ar else seed.title_en end,
    case when locale.code='ar' then seed.description_ar else seed.description_en end,
    case when locale.code='ar' then seed.title_ar else seed.title_en end,
    case when locale.code='ar' then seed.description_ar else seed.description_en end,
    null
  from jsonb_to_recordset(p_tools) as seed(
    slug text,title_ar text,title_en text,description_ar text,description_en text,
    expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer
  )
  join public.tools tool on tool.slug=seed.slug
  join public.locales locale on locale.code in ('ar','en')
  on conflict(tool_id,locale_id) do update set
    title=excluded.title,
    short_description=excluded.short_description,
    seo_title=excluded.seo_title,
    seo_description=excluded.seo_description,
    prompt_template_override=null,
    updated_at=now();

  insert into public.tool_field_translations(
    tool_id,locale_id,field_key,label,placeholder,help_text,options
  )
  select
    tool.id,
    locale.id,
    field.value->>'key',
    field.value->>'label',
    nullif(field.value->>'placeholder',''),
    nullif(field.value->>'helpText',''),
    field.value->'options'
  from jsonb_to_recordset(p_tools) as seed(
    slug text,title_ar text,title_en text,description_ar text,description_en text,
    expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer
  )
  join public.tools tool on tool.slug=seed.slug
  join public.locales locale on locale.code in ('ar','en')
  cross join lateral jsonb_array_elements(
    case when locale.code='ar' then seed.input_fields else seed.english_fields end
  ) field(value)
  on conflict(tool_id,locale_id,field_key) do update set
    label=excluded.label,
    placeholder=excluded.placeholder,
    help_text=excluded.help_text,
    options=excluded.options,
    updated_at=now();

  insert into public.tool_field_translations(
    tool_id,locale_id,field_key,label,placeholder,help_text,options
  )
  select
    tool.id,
    locale.id,
    '__submit__',
    case when locale.code='ar' then coalesce(seed.submit_ar,'احسب') else coalesce(seed.submit_en,'Calculate') end,
    null,null,null
  from jsonb_to_recordset(p_tools) as seed(
    slug text,title_ar text,title_en text,description_ar text,description_en text,
    expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer
  )
  join public.tools tool on tool.slug=seed.slug
  join public.locales locale on locale.code in ('ar','en')
  on conflict(tool_id,locale_id,field_key) do update set
    label=excluded.label,
    placeholder=null,
    help_text=null,
    options=null,
    updated_at=now();
end;
$$;
