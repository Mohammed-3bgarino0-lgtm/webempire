import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SECRET_KEY?.trim();

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const OUT_DIR = path.resolve("reports/v6-00-2");
await mkdir(OUT_DIR, { recursive: true });

const tableCandidates = {
  skills: [
    "id", "name", "slug", "description", "risk_level", "status",
    "current_version_id", "category", "category_slug", "capability_key",
    "engine_group", "created_at", "updated_at"
  ],
  skill_versions: [
    "id", "skill_id", "version_number", "instructions",
    "input_requirements", "output_contract", "created_at", "updated_at"
  ],
  tool_skills: [
    "id", "tool_id", "skill_id", "sort_order", "created_at", "updated_at"
  ],
  workflows: [
    "id", "name", "slug", "description", "is_active", "version",
    "category", "category_slug", "input_schema", "output_schema",
    "created_at", "updated_at"
  ],
  workflow_steps: [
    "id", "workflow_id", "step_key", "name", "step_type", "sort_order",
    "config", "continue_on_error", "input_source", "output_key",
    "is_required", "created_at", "updated_at"
  ],
  workflow_tools: [
    "id", "workflow_id", "tool_id", "is_primary", "sort_order",
    "created_at", "updated_at"
  ],
  tool_workflows: [
    "id", "tool_id", "workflow_id", "is_primary", "sort_order",
    "created_at", "updated_at"
  ],
  workflow_skills: [
    "id", "workflow_id", "skill_id", "sort_order",
    "created_at", "updated_at"
  ],
  ai_providers: [
    "id", "name", "slug", "adapter_type", "base_url", "secret_id",
    "config", "priority", "is_active", "created_at", "updated_at"
  ],
  ai_models: [
    "id", "provider_id", "name", "model_key", "alias", "capabilities",
    "input_cost_per_million_usd", "output_cost_per_million_usd",
    "cached_input_cost_per_million_usd", "max_output_tokens",
    "priority", "is_active", "created_at", "updated_at"
  ]
};

async function probeTable(table, columns) {
  const result = {
    table,
    exists: false,
    existing_columns: [],
    missing_columns: [],
    errors: [],
  };

  // نفحص وجود الجدول باستخدام أول عمود مرشح، ثم نفحص الأعمدة واحدًا واحدًا.
  let tableDetected = false;
  for (const column of columns) {
    const { error } = await supabase.from(table).select(column).limit(1);

    if (!error) {
      tableDetected = true;
      result.exists = true;
      result.existing_columns.push(column);
      continue;
    }

    const message = String(error.message ?? "");
    const tableMissing =
      message.includes(`Could not find the table 'public.${table}'`) ||
      message.includes(`relation "public.${table}" does not exist`) ||
      message.includes(`relation "${table}" does not exist`);

    if (tableMissing) {
      result.exists = false;
      result.errors.push(message);
      return result;
    }

    // خطأ العمود يعني أن الجدول موجود لكن العمود غير موجود.
    if (
      message.includes(`Could not find the '${column}' column`) ||
      message.includes(`column ${table}.${column} does not exist`) ||
      message.includes(`column "${column}" does not exist`)
    ) {
      tableDetected = true;
      result.exists = true;
      result.missing_columns.push(column);
      continue;
    }

    result.errors.push(`${column}: ${message}`);
  }

  result.exists = tableDetected;
  return result;
}

const schema = {};
for (const [table, columns] of Object.entries(tableCandidates)) {
  schema[table] = await probeTable(table, columns);
  const item = schema[table];
  console.log(
    `${item.exists ? "OK" : "MISSING"} ${table}: ` +
      `${item.existing_columns.length} columns detected`,
  );
}

async function walk(dir) {
  const files = [];
  try {
    for (const name of await readdir(dir)) {
      const full = path.join(dir, name);
      const info = await stat(full);
      if (info.isDirectory()) files.push(...(await walk(full)));
      else files.push(full);
    }
  } catch {
    return [];
  }
  return files;
}

const migrationDir = path.resolve("supabase/migrations");
const migrationFiles = (await walk(migrationDir))
  .filter((file) => file.endsWith(".sql"))
  .sort();

const needles = [
  "skills",
  "skill_versions",
  "tool_skills",
  "workflows",
  "workflow_steps",
  "workflow_tools",
  "tool_workflows",
  "workflow_skills",
  "ai_providers",
  "ai_models",
];

const migrationMatches = [];
for (const file of migrationFiles) {
  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const normalized = line.toLowerCase();
    if (!needles.some((needle) => normalized.includes(needle))) return;

    const start = Math.max(0, index - 6);
    const end = Math.min(lines.length, index + 12);
    migrationMatches.push({
      file: path.relative(process.cwd(), file),
      line: index + 1,
      excerpt: lines.slice(start, end).join("\n"),
    });
  });
}

let workflowActionExcerpt = "";
try {
  const adminActionsPath = path.resolve("src/actions/admin.ts");
  const text = await readFile(adminActionsPath, "utf8");
  const startToken = "export async function createWorkflowAction";
  const start = text.indexOf(startToken);
  if (start >= 0) {
    const nextExport = text.indexOf("\nexport async function ", start + startToken.length);
    workflowActionExcerpt = text.slice(start, nextExport >= 0 ? nextExport : undefined).trim();
  }
} catch (error) {
  workflowActionExcerpt = `Unable to read createWorkflowAction: ${
    error instanceof Error ? error.message : String(error)
  }`;
}

const blueprintPath = path.resolve("reports/v6-00-1/blueprint.json");
let blueprintSummary = null;
try {
  const blueprint = JSON.parse(await readFile(blueprintPath, "utf8"));
  blueprintSummary = blueprint.summary ?? null;
} catch {
  blueprintSummary = null;
}

const summary = {
  generated_at: new Date().toISOString(),
  read_only: true,
  tables_existing: Object.values(schema).filter((item) => item.exists).length,
  tables_missing: Object.values(schema).filter((item) => !item.exists).length,
  missing_tables: Object.values(schema)
    .filter((item) => !item.exists)
    .map((item) => item.table),
  migration_files_scanned: migrationFiles.length,
  migration_matches: migrationMatches.length,
  workflow_action_found:
    workflowActionExcerpt.startsWith("export async function createWorkflowAction"),
  blueprint_summary: blueprintSummary,
};

const output = {
  summary,
  schema,
  migration_matches: migrationMatches,
  workflow_action_excerpt: workflowActionExcerpt,
};

await writeFile(
  path.join(OUT_DIR, "schema-contract.json"),
  JSON.stringify(output, null, 2),
  "utf8",
);

const excerptsText = migrationMatches
  .map(
    (match) =>
      `===== ${match.file}:${match.line} =====\n${match.excerpt}\n`,
  )
  .join("\n");

await writeFile(
  path.join(OUT_DIR, "migration-excerpts.txt"),
  excerptsText || "No relevant migration excerpts found.\n",
  "utf8",
);

await writeFile(
  path.join(OUT_DIR, "create-workflow-action.txt"),
  workflowActionExcerpt || "createWorkflowAction was not found.\n",
  "utf8",
);

const tableRows = Object.values(schema)
  .map(
    (item) =>
      `| ${item.table} | ${item.exists ? "موجود" : "غير موجود"} | ${
        item.existing_columns.join(", ") || "—"
      } | ${item.missing_columns.join(", ") || "—"} |`,
  )
  .join("\n");

const md = `# V6-00.2 — فحص عقد قاعدة البيانات

> فحص للقراءة فقط، ولم ينفذ أي INSERT أو UPDATE أو DELETE أو DDL.

## الملخص

- الجداول المكتشفة: **${summary.tables_existing}**
- الجداول غير الموجودة: **${summary.tables_missing}**
- الجداول غير الموجودة: **${summary.missing_tables.join(", ") || "لا يوجد"}**
- ملفات Migration المفحوصة: **${summary.migration_files_scanned}**
- المقاطع المطابقة: **${summary.migration_matches}**
- دالة إنشاء Workflow موجودة: **${summary.workflow_action_found ? "نعم" : "لا"}**

## الأعمدة المكتشفة

| الجدول | الحالة | أعمدة موجودة | أعمدة مرشحة غير موجودة |
|---|---|---|---|
${tableRows}

## الملفات

- \`schema-contract.json\`: النتيجة الكاملة.
- \`migration-excerpts.txt\`: تعريفات الجداول والمراجع من المهاجرات المحلية.
- \`create-workflow-action.txt\`: دالة إنشاء مسار العمل الحالية.

## الخطوة التالية

بناء Migration لجداول الربط المفقودة فقط، ثم Seed قابل لإعادة التشغيل ومتوافق مع الأعمدة الموجودة.
`;

await writeFile(path.join(OUT_DIR, "V6-00-2-SCHEMA-CONTRACT.md"), md, "utf8");

console.log("\nV6-00.2 schema probe complete.");
console.table(summary);
console.log(`Reports written to: ${OUT_DIR}`);
