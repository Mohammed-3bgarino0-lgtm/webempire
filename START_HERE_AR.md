# بدء مشروع Web Empire داخل VS Code

هذه الحزمة هي النسخة الموحدة من فرع الإنتاج، وتشمل تحديثات الأدوات حتى Wave 5.

## التشغيل على Windows

1. فك ضغط الملف في مسار قصير، مثل:
   `C:\Projects\WEB-EMPIRE-V5`
2. افتح الملف:
   `WEB-EMPIRE.code-workspace`
3. افتح Terminal داخل VS Code ونفذ:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run typecheck
npm run lint
npm run dev
```

4. افتح:
   `http://localhost:3000`

## متغيرات البيئة

ضع بيانات Supabase داخل `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

لا ترفع ملف `.env.local` إلى GitHub.

## تحديث المشروع من GitHub

هذه الحزمة لا تحتوي مجلد `.git`. لربطها بالمستودع الحالي نفذ من داخل المجلد:

```powershell
git init
git remote add origin https://github.com/3abGrino0-dev/web-empire.git
git fetch origin
git checkout -B web-empire-v3-production origin/web-empire-v3-production
```

الأفضل عادةً استخدام `git clone` للمزامنة المستمرة، واستخدام هذه الحزمة كنسخة موحدة احتياطية أو بداية جاهزة.
