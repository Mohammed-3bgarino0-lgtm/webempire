-- Web Empire wave 4 cleanup.
-- Remove the temporary catalog seeding helper after all wave4 sector migrations run.
drop function if exists public._wave4_upsert_formula_tools(text, jsonb);
