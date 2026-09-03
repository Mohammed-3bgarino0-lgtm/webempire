-- Remove temporary wave 9 helper after all wave 9 seed migrations run.
drop function if exists public._wave9_upsert_formula_tools(text,jsonb);
