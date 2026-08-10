-- AdSense public-scope hardening.
-- Keep only fully translated locales public until the remaining locale libraries
-- have complete UI + tool translations. This prevents English-fallback pages
-- from being published under fr/tr/ur URLs as near-duplicates.

update public.locales
set is_active = false
where code in ('fr', 'tr', 'ur');

-- Improve homepage search intent for the two currently complete locales.
update public.site_identity_translations sit
set home_seo_title = case l.code
      when 'ar' then 'إمبراطورية الويب | حاسبات وأدوات تحويل وإنتاجية'
      when 'en' then 'Web Empire | Calculators, Converters & Productivity Tools'
      else sit.home_seo_title
    end,
    home_seo_description = case l.code
      when 'ar' then 'حاسبات مالية ونسب وخصومات وتحويل وحدات وأدوات إنتاجية متعددة اللغات، مع شروحات للمدخلات وأمثلة تساعدك على التحقق من النتائج.'
      when 'en' then 'Use multilingual calculators, unit converters, and productivity tools with clear input guidance, checkable examples, and result-validation notes.'
      else sit.home_seo_description
    end,
    updated_at = now()
from public.locales l
where l.id = sit.locale_id
  and l.code in ('ar', 'en');

-- The Next.js title template already appends the site name, so remove legacy
-- database suffixes that produced titles such as "... | Web Empire | Web Empire".
update public.tool_translations
set seo_title = btrim(
      regexp_replace(
        seo_title,
        '\s*\|\s*(Web Empire|أمبراطورية الويب|إمبراطورية الويب)\s*$',
        '',
        'i'
      )
    ),
    updated_at = now()
where seo_title ~* '\|\s*(Web Empire|أمبراطورية الويب|إمبراطورية الويب)\s*$';
