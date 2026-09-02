-- Remove temporary wave7 staging helpers.
drop function if exists public._wave7_upsert_formula_tools(text,jsonb);
drop function if exists public._wave7_ar_label(text);
