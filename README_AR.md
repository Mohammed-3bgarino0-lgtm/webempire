# حزمة أدوات الفيديو والوسائط — Web Empire

تضيف الحزمة أربع أدوات إنتاجية:

1. تحميل فيديو من رابط ملف مباشر.
2. تحويل الفيديو إلى MP4 أو WebM أو MOV.
3. استخراج الصوت بصيغة MP3 أو WAV.
4. ضغط الفيديو وتغيير الدقة.
5. قص الفيديو بتحديد وقت البداية والنهاية.

> التحميل مخصص للملفات التي يملكها المستخدم أو المصرح له بها فقط. لا توجد آلية لتجاوز DRM أو حماية YouTube أو TikTok أو Instagram.

## طريقة التثبيت

1. فك ضغط الحزمة.
2. انسخ مجلد الحزمة كاملًا إلى مكان معروف.
3. افتح PowerShell داخل **جذر مشروع Web Empire**، وهو المجلد الذي يحتوي `package.json`.
4. نفّذ، مع تعديل مسار السكربت حسب مكان فك الضغط:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
& "C:\Path\To\WEB-EMPIRE-MEDIA-TOOLS-PACK\APPLY_MEDIA_TOOLS.ps1"
```

بديل أسهل: انسخ محتويات الحزمة إلى جذر المشروع ثم نفّذ:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_MEDIA_TOOLS.ps1
```

## تطبيق قاعدة البيانات

بعد نجاح السكربت، افتح Supabase Dashboard ثم:

```text
SQL Editor → New query
```

الصق محتوى:

```text
MEDIA_TOOLS_SQL.sql
```

ثم اضغط **Run**.

إذا كان Supabase CLI مربوطًا بالمشروع، يمكن بدلًا من ذلك تنفيذ:

```powershell
supabase db push --linked
```

## التشغيل

```powershell
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
```

ثم افتح:

```text
http://localhost:3000/ar/tools
```

## المسارات الجديدة

```text
/ar/tools/direct-video-downloader
/ar/tools/video-format-converter
/ar/tools/video-compressor
/ar/tools/video-trimmer
```

واستبدل `ar` بـ `en` للإنجليزية.

## التقنية والخصوصية

- التحويل والضغط والقص تتم داخل المتصفح باستخدام FFmpeg WebAssembly.
- الملف لا يُرفع إلى خادم Web Empire.
- عند أول استخدام يُحمّل المتصفح محرك FFmpeg بحجم يقارب 30 MB من CDN بإصدار مثبت.
- الحد الافتراضي للتحويل 250 MB، وللتحميل المباشر 500 MB.
- بعض روابط التحميل المباشر قد تفشل بسبب CORS من الخادم المصدر؛ لا تستخدم الحزمة بروكسي لتجاوز ذلك.

## الفحوصات

تم تنفيذ بنجاح:

```text
npm run typecheck
eslint على الملفات الجديدة والمعدلة
```

فحص `next build` توقف في بيئة الإنشاء فقط لأن الاتصال بـ Google Fonts غير متاح، وليس بسبب ملفات أدوات الوسائط.
