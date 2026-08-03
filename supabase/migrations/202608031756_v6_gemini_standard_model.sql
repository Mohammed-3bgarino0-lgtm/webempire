-- V6-00.5: register the stable Gemini 2.5 Flash model.
do $$
declare
  v_provider_id uuid;
begin
  update public.ai_providers
  set base_url = 'https://generativelanguage.googleapis.com/v1beta'
  where adapter_type = 'gemini_generate_content'
    and is_active = true;

  select id
    into v_provider_id
  from public.ai_providers
  where adapter_type = 'gemini_generate_content'
    and is_active = true
  order by priority asc, created_at asc
  limit 1;

  if v_provider_id is null then
    raise exception 'ACTIVE_GEMINI_PROVIDER_NOT_FOUND';
  end if;

  insert into public.ai_models (
    provider_id,
    name,
    model_key,
    alias,
    capabilities,
    input_cost_per_million_usd,
    output_cost_per_million_usd,
    cached_input_cost_per_million_usd,
    max_output_tokens,
    priority,
    is_active,
    pricing_effective_from
  )
  values (
    v_provider_id,
    'Gemini 2.5 Flash',
    'gemini-2.5-flash',
    'standard',
    array['text']::text[],
    0.30,
    2.50,
    0.03,
    65536,
    100,
    true,
    timestamptz '2026-08-03 00:00:00+00'
  )
  on conflict (provider_id, model_key, alias)
  do update set
    name = excluded.name,
    capabilities = excluded.capabilities,
    input_cost_per_million_usd =
      excluded.input_cost_per_million_usd,
    output_cost_per_million_usd =
      excluded.output_cost_per_million_usd,
    cached_input_cost_per_million_usd =
      excluded.cached_input_cost_per_million_usd,
    max_output_tokens = excluded.max_output_tokens,
    priority = excluded.priority,
    is_active = excluded.is_active,
    pricing_effective_from =
      excluded.pricing_effective_from;
end
$$;
