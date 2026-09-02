-- Remove the temporary wave5 staging helper after all wave5 seed migrations run.
drop function if exists public._wave5_upsert_formula_tools(text,jsonb);
