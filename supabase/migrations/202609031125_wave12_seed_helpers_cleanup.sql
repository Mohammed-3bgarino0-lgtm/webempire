-- Remove temporary Wave 12 seed helpers after all Wave 12 tool migrations run.
drop function if exists public._wave12_upsert_text_tools(text,jsonb);
drop function if exists public._wave12_upsert_formula_tools(text,jsonb);
