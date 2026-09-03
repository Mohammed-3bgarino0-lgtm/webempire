# Wave 13 Catalog Growth

GitHub staging only — do not apply to Supabase until an explicit release request.

## Scope
100 deterministic bilingual formula tools, 10 per category:
- insurance-tools
- personal-finance-tools
- seo-tools
- employment-tools
- general-tools
- marketing-tools
- business-tools
- saudi-tools
- date-time-tools
- math-tools

## Release constraints
- AI: disabled / none
- External APIs: none
- Pricing: free
- Authentication: not required
- Arabic + English tool translations
- Arabic + English field translations
- Existing reviewed/indexable allowlist unchanged

## Collision check
The initial candidate set had 12 exact collisions with production. All 12 were replaced and the final 100 slugs are exact-conflict free against the current production catalog.

## Notes
Saudi VAT calculators take the VAT rate as an input instead of hard-coding a rate, so they do not depend on a changing statutory percentage.
