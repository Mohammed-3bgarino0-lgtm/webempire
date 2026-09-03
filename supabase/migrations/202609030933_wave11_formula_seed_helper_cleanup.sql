-- Remove temporary Wave 11 helper after staged tools are seeded.
drop function if exists public._wave11_upsert_formula_tools(text,jsonb);
