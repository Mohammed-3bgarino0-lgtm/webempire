-- Web Empire wave 15 helper for deterministic bilingual formula tools.
-- GitHub staging only. Removed by the wave15 cleanup migration.
create or replace function public._wave15_upsert_formula_tools(p_category_slug text,p_tools jsonb)
returns void language plpgsql as $$
begin
  insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,pricing_mode,fixed_points,minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
  select s.slug,s.title_ar,s.title_en,
    'احسب ' || s.title_ar || ' بسرعة باستخدام مدخلات واضحة.',
    c.id,'formula',
    jsonb_build_object('submitLabel','احسب','fields',(
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'key',f.value->>'key','label',f.value->>'ar','type','number','required',true,
        'min',case when f.value ? 'min' then (f.value->>'min')::numeric else null end,
        'max',case when f.value ? 'max' then (f.value->>'max')::numeric else null end,
        'step',case when f.value ? 'step' then (f.value->>'step')::numeric else 0.01 end
      ))) from jsonb_array_elements(s.fields) f(value)
    )),
    jsonb_build_object('type','number','format','auto'),
    jsonb_build_object('expression',s.expression),
    'free',0,0,false,false,true,s.sort_order,s.title_ar,
    'احسب ' || s.title_ar || ' بسرعة باستخدام مدخلات واضحة.'
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,expression text,fields jsonb,sort_order integer)
  join public.categories c on c.slug=p_category_slug
  on conflict(slug) do update set
    title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,
    category_id=excluded.category_id,engine_type=excluded.engine_type,input_schema=excluded.input_schema,
    output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,pricing_mode='free',
    fixed_points=0,minimum_points=0,requires_auth=false,is_featured=false,is_active=true,
    sort_order=excluded.sort_order,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();

  insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
  select t.id,l.id,
    case when l.code='ar' then s.title_ar else s.title_en end,
    case when l.code='ar' then 'احسب ' || s.title_ar || ' بسرعة باستخدام مدخلات واضحة.' else 'Calculate ' || s.title_en || ' quickly with clear inputs.' end,
    case when l.code='ar' then s.title_ar else s.title_en end,
    case when l.code='ar' then 'احسب ' || s.title_ar || ' بسرعة باستخدام مدخلات واضحة.' else 'Calculate ' || s.title_en || ' quickly with clear inputs.' end,
    null
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,expression text,fields jsonb,sort_order integer)
  join public.tools t on t.slug=s.slug
  join public.locales l on l.code in('ar','en')
  on conflict(tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();

  insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
  select t.id,l.id,f.value->>'key',case when l.code='ar' then f.value->>'ar' else f.value->>'en' end,null,null,null
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,expression text,fields jsonb,sort_order integer)
  join public.tools t on t.slug=s.slug
  join public.locales l on l.code in('ar','en')
  cross join lateral jsonb_array_elements(s.fields) f(value)
  on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();

  insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
  select t.id,l.id,'__submit__',case when l.code='ar' then 'احسب' else 'Calculate' end,null,null,null
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,expression text,fields jsonb,sort_order integer)
  join public.tools t on t.slug=s.slug
  join public.locales l on l.code in('ar','en')
  on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();
end;$$;
