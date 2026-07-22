# تشغيل وصيانة تطبيق إمبراطورية الويب

## بيانات التطبيق الثابتة

- حساب Expo: `mohammedsk`
- مشروع Expo: `@mohammedsk/web-empire`
- Android package: `site.webempire.app`
- iOS bundle ID: `site.webempire.app`
- سياسة الخصوصية: `https://webempire.site/ar/privacy`
- الدعم: `https://webempire.site/ar/support`

## أنواع التحديث

### تحديث سريع دون انتظار المتجر

يستخدم لإصلاحات JavaScript والمحتوى والتصميم التي لا تضيف مكتبات أصلية جديدة:

```bash
npm run update:production -- "وصف التحديث"
```

يصل التحديث للمستخدمين عبر قناة `production`، ويتحقق التطبيق منه عند التشغيل.

### نسخة متجر جديدة

تلزم عند تغيير إصدار Expo أو إضافة مكتبة أصلية أو صلاحية نظام أو تغيير أيقونة التطبيق:

```bash
npm run build:android:production
npm run build:ios:production
```

ثم الإرسال:

```bash
npm run submit:android
npm run submit:ios
```

## مسار آمن لكل إصدار

1. نفّذ `npm run typecheck` و`npm run lint` و`npm run doctor`.
2. انشر أولًا على قناة `preview` واختبر تسجيل الدخول والأدوات والمحفظة والدفع.
3. انشر تحديث `production` إن كان التغيير برمجيًا فقط.
4. ابنِ نسخة متجر عند وجود تغيير أصلي.
5. احتفظ بملاحظات الإصدار ورقم التذكرة في رسالة التحديث.

## ما يجب الحفاظ عليه

- لا تغيّر `bundleIdentifier` أو `package` بعد أول نشر.
- لا تحذف مشروع Expo أو مفاتيح توقيع Android من حساب `mohammedsk`.
- احتفظ بعضوية Apple Developer وحساب Google Play Console نشطين.
- أضف `EXPO_TOKEN` إلى أسرار GitHub عند تفعيل النشر الآلي مستقبلًا.
