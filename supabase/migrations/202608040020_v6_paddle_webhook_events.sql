create table if not exists public.paddle_webhook_events (
  id uuid primary key default gen_random_uuid(),

  event_id text not null unique,
  notification_id text,
  event_type text not null,
  occurred_at timestamptz,

  status text not null default 'received'
    check (
      status in (
        'received',
        'processed',
        'ignored',
        'failed'
      )
    ),

  payload jsonb not null,
  error_message text,
  processed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists
  paddle_webhook_events_type_created_idx
on public.paddle_webhook_events (
  event_type,
  created_at desc
);

alter table public.paddle_webhook_events
  enable row level security;

revoke all
  on table public.paddle_webhook_events
  from anon, authenticated;

grant all
  on table public.paddle_webhook_events
  to service_role;

comment on table public.paddle_webhook_events is
  'Verified Paddle webhook events with idempotent event IDs.';
