-- Web Empire V6-00.3
-- Canonical workflow relationships + idempotent seed support.
-- Safe to re-run: all DDL is guarded.

begin;

-- Workflows must remain uniquely addressable by slug for idempotent upserts.
create unique index if not exists workflows_slug_unique_idx
  on public.workflows (slug);

-- A workflow step is stable inside its workflow by step_key.
create unique index if not exists workflow_steps_workflow_step_key_unique_idx
  on public.workflow_steps (workflow_id, step_key);

-- Canonical relation: workflow -> tool.
create table if not exists public.workflow_tools (
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (workflow_id, tool_id)
);

create index if not exists workflow_tools_tool_id_idx
  on public.workflow_tools (tool_id);

create index if not exists workflow_tools_workflow_sort_idx
  on public.workflow_tools (workflow_id, sort_order);

-- Canonical relation: workflow -> skill.
create table if not exists public.workflow_skills (
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (workflow_id, skill_id)
);

create index if not exists workflow_skills_skill_id_idx
  on public.workflow_skills (skill_id);

create index if not exists workflow_skills_workflow_sort_idx
  on public.workflow_skills (workflow_id, sort_order);

-- Compatibility name only. Do not duplicate the same relationship in two tables.
-- A simple PostgreSQL view remains automatically updatable for normal inserts/updates.
do $$
declare
  relation_kind "char";
begin
  select c.relkind
    into relation_kind
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'tool_workflows'
  limit 1;

  if relation_kind is null then
    execute $view$
      create view public.tool_workflows as
      select
        tool_id,
        workflow_id,
        sort_order,
        created_at
      from public.workflow_tools
    $view$;
  end if;
end
$$;

comment on table public.workflow_tools is
  'Canonical workflow-to-tool relation for Web Empire V6.';

comment on table public.workflow_skills is
  'Canonical workflow-to-skill relation for Web Empire V6.';

comment on view public.tool_workflows is
  'Compatibility view over workflow_tools; no duplicate relationship storage.';

commit;
