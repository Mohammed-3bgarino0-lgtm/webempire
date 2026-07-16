WEB EMPIRE — إصلاح TypeError: fetch failed

السبب:
ملف src/repositories/catalog.ts كان يرسل جميع معرفات الأدوات في طلب Supabase واحد.
مع توسع المكتبة إلى مئات الأدوات، أصبح عنوان طلب PostgREST طويلًا جدًا، فكان Node.js يعرض:
TypeError: fetch failed

طريقة التطبيق:
1) فك ضغط هذا الملف.
2) انسخ مجلد الإصلاح كاملًا إلى جذر مشروع Web Empire، أو افتح PowerShell داخل جذر المشروع.
3) نفّذ:

Set-ExecutionPolicy -Scope Process Bypass
& "المسار-إلى-APPLY_FIX.ps1"

الطريقة الأسهل:
- فك محتويات ZIP داخل جذر المشروع.
- من Terminal المشروع نفّذ:

Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_FIX.ps1

بعد نجاح الفحص:
npm run dev

ثم افتح:
http://localhost:3000/en

الإصلاح:
- يقسم معرفات الأدوات إلى دفعات من 100.
- يمنع روابط Supabase الضخمة.
- ينشئ نسخة احتياطية باسم:
  src\repositories\catalog.ts.before-hotfix
- يحذف كاش .next.
- يشغل npm run typecheck.

تم التحقق:
npm run typecheck: ناجح
npm run lint: لا توجد أخطاء، توجد تحذيرات قديمة فقط.
