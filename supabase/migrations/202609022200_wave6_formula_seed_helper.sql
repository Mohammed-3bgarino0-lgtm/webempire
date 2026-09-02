-- Web Empire wave 6 helper for staged deterministic formula tools.
-- GitHub staging only. Removed by the wave6 cleanup migration.
create or replace function public._wave6_upsert_formula_tools(p_category_slug text,p_tools jsonb)
returns void language plpgsql as $$
begin
  insert into public.tools(slug,title_ar,title_en,short_description,category_id,engine_type,input_schema,output_schema,runtime_config,pricing_mode,fixed_points,minimum_points,requires_auth,is_featured,is_active,sort_order,seo_title,seo_description)
  select s.slug,s.title_ar,s.title_en,s.description_ar,c.id,'formula',jsonb_build_object('submitLabel',coalesce(s.submit_ar,'احسب'),'fields',s.input_fields),jsonb_build_object('type','number','format','auto'),jsonb_build_object('expression',s.expression),'free',0,0,false,false,true,s.sort_order,s.title_ar,s.description_ar
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,description_ar text,description_en text,expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer)
  join public.categories c on c.slug=p_category_slug
  on conflict(slug) do update set title_ar=excluded.title_ar,title_en=excluded.title_en,short_description=excluded.short_description,category_id=excluded.category_id,engine_type=excluded.engine_type,input_schema=excluded.input_schema,output_schema=excluded.output_schema,runtime_config=excluded.runtime_config,pricing_mode=excluded.pricing_mode,fixed_points=0,minimum_points=0,requires_auth=false,is_featured=false,is_active=true,sort_order=excluded.sort_order,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=now();
  insert into public.tool_translations(tool_id,locale_id,title,short_description,seo_title,seo_description,prompt_template_override)
  select t.id,l.id,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,case when l.code='ar' then s.title_ar else s.title_en end,case when l.code='ar' then s.description_ar else s.description_en end,null
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,description_ar text,description_en text,expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer)
  join public.tools t on t.slug=s.slug join public.locales l on l.code in('ar','en')
  on conflict(tool_id,locale_id) do update set title=excluded.title,short_description=excluded.short_description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,prompt_template_override=null,updated_at=now();
  insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
  select t.id,l.id,f.value->>'key',f.value->>'label',nullif(f.value->>'placeholder',''),nullif(f.value->>'helpText',''),f.value->'options'
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,description_ar text,description_en text,expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer)
  join public.tools t on t.slug=s.slug join public.locales l on l.code in('ar','en')
  cross join lateral jsonb_array_elements(case when l.code='ar' then s.input_fields else s.english_fields end) f(value)
  on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=excluded.placeholder,help_text=excluded.help_text,options=excluded.options,updated_at=now();
  insert into public.tool_field_translations(tool_id,locale_id,field_key,label,placeholder,help_text,options)
  select t.id,l.id,'__submit__',case when l.code='ar' then coalesce(s.submit_ar,'احسب') else coalesce(s.submit_en,'Calculate') end,null,null,null
  from jsonb_to_recordset(p_tools) as s(slug text,title_ar text,title_en text,description_ar text,description_en text,expression text,input_fields jsonb,english_fields jsonb,submit_ar text,submit_en text,sort_order integer)
  join public.tools t on t.slug=s.slug join public.locales l on l.code in('ar','en')
  on conflict(tool_id,locale_id,field_key) do update set label=excluded.label,placeholder=null,help_text=null,options=null,updated_at=now();
end;$$;
