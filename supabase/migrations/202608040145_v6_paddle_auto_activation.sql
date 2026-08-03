do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.billing_providers'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%adapter_type%'
  loop
    execute format(
      'alter table public.billing_providers drop constraint %I',
      constraint_row.conname
    );
  end loop;
end
$$;

alter table public.billing_providers
  add constraint billing_providers_adapter_type_check
  check (
    adapter_type in (
      'stripe_checkout',
      'paddle_checkout'
    )
  );

insert into public.billing_providers (
  name,
  slug,
  adapter_type,
  config,
  priority,
  is_active
)
values (
  'Paddle Sandbox',
  'paddle-sandbox',
  'paddle_checkout',
  '{"environment":"sandbox"}'::jsonb,
  50,
  false
)
on conflict (slug) do update
set
  name = excluded.name,
  adapter_type = excluded.adapter_type,
  config = excluded.config,
  priority = excluded.priority;

create or replace function
  public.process_paddle_transaction_event(
    p_event_id text
  )
returns bigint
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  v_event public.paddle_webhook_events%rowtype;
  v_data jsonb;
  v_custom jsonb;

  v_user_id uuid;
  v_plan_id uuid;
  v_plan_slug text;
  v_source text;

  v_transaction_id text;
  v_subscription_id text;
  v_customer_id text;

  v_period_start timestamptz;
  v_period_end timestamptz;

  v_provider_id uuid;
  v_balance bigint;
begin
  select *
  into v_event
  from public.paddle_webhook_events
  where event_id = p_event_id
  for update;

  if not found then
    raise exception 'PADDLE_EVENT_NOT_FOUND';
  end if;

  if v_event.event_type <> 'transaction.completed' then
    raise exception 'PADDLE_EVENT_TYPE_NOT_SUPPORTED';
  end if;

  v_data :=
    coalesce(
      v_event.payload -> 'data',
      '{}'::jsonb
    );

  v_custom :=
    coalesce(
      v_data -> 'customData',
      v_data -> 'custom_data',
      '{}'::jsonb
    );

  v_user_id :=
    nullif(
      v_custom ->> 'web_empire_user_id',
      ''
    )::uuid;

  /*
   * الأحداث المعالجة أو المتجاهلة لا تمنح رصيدًا مرة أخرى.
   */
  if v_event.status in ('processed', 'ignored') then
    select balance
    into v_balance
    from public.credit_wallets
    where user_id = v_user_id;

    return coalesce(v_balance, 0);
  end if;

  v_plan_id :=
    nullif(
      v_custom ->> 'web_empire_plan_id',
      ''
    )::uuid;

  v_plan_slug :=
    nullif(
      v_custom ->> 'web_empire_plan_slug',
      ''
    );

  v_source :=
    nullif(
      v_custom ->> 'source',
      ''
    );

  if v_source <> 'webempire_authenticated_checkout' then
    raise exception 'PADDLE_CHECKOUT_SOURCE_INVALID';
  end if;

  if v_user_id is null
    or v_plan_id is null
    or v_plan_slug is null
  then
    raise exception 'PADDLE_CHECKOUT_METADATA_MISSING';
  end if;

  if not exists (
    select 1
    from public.plans
    where id = v_plan_id
      and slug = v_plan_slug
      and slug in ('pro', 'business')
      and is_active = true
  ) then
    raise exception 'PADDLE_PLAN_METADATA_INVALID';
  end if;

  v_transaction_id :=
    coalesce(
      nullif(v_data ->> 'id', ''),
      nullif(v_data ->> 'transaction_id', '')
    );

  v_subscription_id :=
    coalesce(
      nullif(v_data ->> 'subscriptionId', ''),
      nullif(v_data ->> 'subscription_id', '')
    );

  v_customer_id :=
    coalesce(
      nullif(v_data ->> 'customerId', ''),
      nullif(v_data ->> 'customer_id', ''),
      ''
    );

  if v_transaction_id is null
    or v_subscription_id is null
  then
    raise exception 'PADDLE_TRANSACTION_METADATA_MISSING';
  end if;

  v_period_start :=
    coalesce(
      nullif(
        v_data #>> '{billingPeriod,startsAt}',
        ''
      )::timestamptz,
      nullif(
        v_data #>> '{billing_period,starts_at}',
        ''
      )::timestamptz,
      now()
    );

  v_period_end :=
    coalesce(
      nullif(
        v_data #>> '{billingPeriod,endsAt}',
        ''
      )::timestamptz,
      nullif(
        v_data #>> '{billing_period,ends_at}',
        ''
      )::timestamptz,
      v_period_start + interval '1 month'
    );

  select id
  into v_provider_id
  from public.billing_providers
  where slug = 'paddle-sandbox'
  limit 1;

  if v_provider_id is null then
    raise exception 'PADDLE_PROVIDER_NOT_FOUND';
  end if;

  perform public.activate_billing_subscription(
    p_user_id => v_user_id,
    p_plan_id => v_plan_id,
    p_provider_id => v_provider_id,
    p_customer_id => v_customer_id,
    p_subscription_id => v_subscription_id,
    p_status => 'active',
    p_period_start => v_period_start,
    p_period_end => v_period_end,
    p_cancel_at_period_end => false
  );

  v_balance :=
    public.grant_subscription_credits(
      p_user_id => v_user_id,
      p_plan_id => v_plan_id,
      p_grant_key =>
        'paddle:transaction:' || v_transaction_id,
      p_description =>
        'Paddle subscription credits: ' ||
        v_transaction_id
    );

  update public.paddle_webhook_events
  set
    status = 'processed',
    processed_at = now(),
    error_message = null,
    updated_at = now()
  where event_id = p_event_id;

  return v_balance;
end;
$function$;

revoke all
on function
  public.process_paddle_transaction_event(text)
from public;

grant execute
on function
  public.process_paddle_transaction_event(text)
to service_role;
