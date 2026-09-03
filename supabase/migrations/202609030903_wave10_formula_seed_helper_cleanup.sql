-- Cleanup temporary wave10 staging helper after the sector seeds run.
drop function if exists public._wave10_upsert_formula_tools(text,jsonb);
