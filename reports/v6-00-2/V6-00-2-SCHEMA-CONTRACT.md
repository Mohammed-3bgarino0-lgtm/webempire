# V6-00.2 — فحص عقد قاعدة البيانات

> فحص للقراءة فقط، ولم ينفذ أي INSERT أو UPDATE أو DELETE أو DDL.

## الملخص

- الجداول المكتشفة: **7**
- الجداول غير الموجودة: **3**
- الجداول غير الموجودة: **workflow_tools, tool_workflows, workflow_skills**
- ملفات Migration المفحوصة: **18**
- المقاطع المطابقة: **54**
- دالة إنشاء Workflow موجودة: **نعم**

## الأعمدة المكتشفة

| الجدول | الحالة | أعمدة موجودة | أعمدة مرشحة غير موجودة |
|---|---|---|---|
| skills | موجود | id, name, slug, description, risk_level, status, current_version_id, created_at | category, category_slug, capability_key, engine_group, updated_at |
| skill_versions | موجود | id, skill_id, version_number, instructions, created_at | input_requirements, output_contract, updated_at |
| tool_skills | موجود | tool_id, skill_id, sort_order | id, created_at, updated_at |
| workflows | موجود | id, name, slug, description, is_active, created_at, updated_at | version, category, category_slug, input_schema, output_schema |
| workflow_steps | موجود | id, workflow_id, step_key, name, step_type, sort_order, config, continue_on_error, created_at | input_source, output_key, is_required, updated_at |
| workflow_tools | غير موجود | — | — |
| tool_workflows | غير موجود | — | — |
| workflow_skills | غير موجود | — | — |
| ai_providers | موجود | id, name, slug, adapter_type, base_url, secret_id, config, priority, is_active, created_at, updated_at | — |
| ai_models | موجود | id, provider_id, name, model_key, alias, capabilities, input_cost_per_million_usd, output_cost_per_million_usd, cached_input_cost_per_million_usd, max_output_tokens, priority, is_active, created_at | updated_at |

## الملفات

- `schema-contract.json`: النتيجة الكاملة.
- `migration-excerpts.txt`: تعريفات الجداول والمراجع من المهاجرات المحلية.
- `create-workflow-action.txt`: دالة إنشاء مسار العمل الحالية.

## الخطوة التالية

بناء Migration لجداول الربط المفقودة فقط، ثم Seed قابل لإعادة التشغيل ومتوافق مع الأعمدة الموجودة.
