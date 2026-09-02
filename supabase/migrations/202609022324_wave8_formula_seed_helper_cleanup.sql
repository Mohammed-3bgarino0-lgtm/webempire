-- Remove temporary Wave 8 staging helper after all Wave 8 inserts and fixes.
drop function if exists public._wave8_upsert_formula_tools(text,jsonb);
