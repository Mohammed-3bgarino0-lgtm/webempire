-- Remove the temporary wave6 staging helper after all wave6 seed migrations run.
drop function if exists public._wave6_upsert_formula_tools(text,jsonb);
