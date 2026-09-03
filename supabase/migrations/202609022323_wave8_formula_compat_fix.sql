-- Keep Wave 8 expressions compatible with the current arithmetic-only formula engine.
update public.tools
set runtime_config = jsonb_set(
  runtime_config,
  '{expression}',
  to_jsonb('(first_value - second_value) / ((first_value + second_value) / 2) * 100'::text)
),
input_schema = jsonb_set(input_schema,'{fields,0,min}','0.000001'::jsonb),
updated_at = now()
where slug = 'percent-difference-calculator';
