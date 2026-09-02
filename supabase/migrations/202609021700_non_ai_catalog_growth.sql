-- Web Empire: non-AI catalog growth baseline.
--
-- Product direction:
--   * AI-backed tools and provider connections are disabled.
--   * Existing historical migrations/data are preserved for auditability.
--   * Formula, text-transform, converter, media, HTTP and other non-AI tools remain available.
--   * The long-term catalog target is 9,000 useful tools; public indexing remains gated
--     by the existing reviewed-tool/AdSense quality policy.

begin;

insert into public.platform_settings(key, value)
values
  ('ai_tools_enabled', 'false'::jsonb),
  ('tool_catalog_target', '9000'::jsonb),
  ('monetization_primary', '"adsense"'::jsonb)
on conflict (key) do update
set value = excluded.value;

-- Disable direct AI-backed tools without deleting historical definitions.
update public.tools
set is_active = false,
    updated_at = now()
where engine_type in ('ai_text', 'ai_structured')
  and is_active = true;

-- A workflow can hide AI calls behind a generic workflow tool. Disable any
-- workflow that contains an AI step so no indirect provider call can run.
update public.workflows w
set is_active = false,
    updated_at = now()
where w.is_active = true
  and exists (
    select 1
    from public.workflow_steps ws
    where ws.workflow_id = w.id
      and ws.step_type in ('ai_text', 'ai_structured')
  );

-- If a tool itself is a workflow wrapper around one of those AI workflows,
-- keep it out of the active catalog instead of leaving a visible broken tool.
update public.tools t
set is_active = false,
    updated_at = now()
where t.engine_type = 'workflow'
  and t.is_active = true
  and exists (
    select 1
    from public.workflow_steps ws
    where ws.workflow_id::text = t.runtime_config->>'workflow_id'
      and ws.step_type in ('ai_text', 'ai_structured')
  );

-- Disable AI provider/model records. Secrets are intentionally not deleted by
-- this migration; secret lifecycle can be handled separately in the provider
-- vault without making this migration destructive.
update public.ai_models
set is_active = false
where is_active = true;

update public.ai_providers
set is_active = false,
    updated_at = now()
where is_active = true;

commit;
