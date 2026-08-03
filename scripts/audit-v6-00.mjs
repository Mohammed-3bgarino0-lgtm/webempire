import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
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

const OUT_DIR = path.resolve("reports/v6-00");
await mkdir(OUT_DIR, { recursive: true });

async function fetchAll(table, orderColumn = null) {
  const pageSize = 1000;
  const rows = [];
  let from = 0;

  while (true) {
    let query = supabase.from(table).select("*", { count: "exact" });
    if (orderColumn) query = query.order(orderColumn, { ascending: true });
    const { data, error, count } = await query.range(from, from + pageSize - 1);

    if (error) {
      return { table, ok: false, error: error.message, count: null, rows: [] };
    }

    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) {
      return { table, ok: true, error: null, count: count ?? rows.length, rows };
    }
    from += pageSize;
  }
}

const tableSpecs = [
  ["tools", "created_at"],
  ["tool_categories", "created_at"],
  ["categories", "created_at"],
  ["skills", "created_at"],
  ["skill_versions", "created_at"],
  ["tool_skills", null],
  ["workflows", "created_at"],
  ["workflow_steps", null],
  ["workflow_tools", null],
  ["tool_workflows", null],
  ["workflow_skills", null],
  ["ai_providers", "priority"],
  ["ai_models", "priority"],
];

const results = {};
for (const [table, order] of tableSpecs) {
  const result = await fetchAll(table, order);
  results[table] = result;
  console.log(
    `${result.ok ? "OK" : "SKIP"} ${table}: ${
      result.ok ? result.rows.length : result.error
    }`,
  );
}

function pick(row, keys) {
  const out = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) out[key] = row[key];
  }
  return out;
}

const tools = results.tools?.rows ?? [];
const categoryRows = [
  ...(results.tool_categories?.rows ?? []),
  ...(results.categories?.rows ?? []),
];

const categoryMap = new Map(
  categoryRows.map((row) => [
    String(row.id ?? ""),
    [
      row.slug,
      row.name,
      row.name_ar,
      row.name_en,
      row.title,
      row.title_ar,
      row.title_en,
    ]
      .filter(Boolean)
      .join(" "),
  ]),
);

const mediaEngineTokens = [
  "media",
  "image",
  "video",
  "audio",
  "speech",
  "voice",
  "ocr",
  "pdf",
  "file",
  "document_convert",
  "ffmpeg",
  "transcode",
];

const mediaTextTokens = [
  "image",
  "video",
  "audio",
  "media",
  "photo",
  "picture",
  "voice",
  "speech",
  "podcast",
  "thumbnail",
  "youtube",
  "instagram",
  "tiktok",
  "صورة",
  "صور",
  "فيديو",
  "صوت",
  "صوتي",
  "وسائط",
  "يوتيوب",
  "انستقرام",
  "تيك توك",
  "بودكاست",
  "مصغرة",
];

function classifyMediaCandidate(tool) {
  const engine = String(tool.engine_type ?? "").toLowerCase();
  const category = String(categoryMap.get(String(tool.category_id ?? "")) ?? "").toLowerCase();
  const text = [
    tool.slug,
    tool.title_ar,
    tool.title_en,
    tool.short_description,
    category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const reasons = [];
  const engineMatches = mediaEngineTokens.filter((token) => engine.includes(token));
  const textMatches = mediaTextTokens.filter((token) => text.includes(token));

  if (engineMatches.length) reasons.push(`engine_type:${engineMatches.join("|")}`);
  if (textMatches.length) reasons.push(`text:${textMatches.join("|")}`);
  return { isCandidate: reasons.length > 0, reasons };
}

const toolCatalog = tools.map((tool) => {
  const media = classifyMediaCandidate(tool);
  return {
    ...pick(tool, [
      "id",
      "slug",
      "title_ar",
      "title_en",
      "short_description",
      "category_id",
      "engine_type",
      "is_active",
      "model_alias",
      "provider_strategy",
      "requires_auth",
      "created_at",
      "updated_at",
    ]),
    category_label: categoryMap.get(String(tool.category_id ?? "")) ?? "",
    media_candidate: media.isCandidate,
    media_reasons: media.reasons.join("; "),
  };
});

const activeTools = toolCatalog.filter((tool) => tool.is_active !== false);
const mediaCandidates = activeTools.filter((tool) => tool.media_candidate);
const eligibleCandidates = activeTools.filter((tool) => !tool.media_candidate);

const toolSkills = results.tool_skills?.rows ?? [];
const skillIdsByTool = new Map();
for (const link of toolSkills) {
  const toolId = String(link.tool_id ?? "");
  if (!skillIdsByTool.has(toolId)) skillIdsByTool.set(toolId, new Set());
  if (link.skill_id) skillIdsByTool.get(toolId).add(String(link.skill_id));
}

const workflowSteps = results.workflow_steps?.rows ?? [];
const stepCountByWorkflow = new Map();
for (const step of workflowSteps) {
  const id = String(step.workflow_id ?? "");
  stepCountByWorkflow.set(id, (stepCountByWorkflow.get(id) ?? 0) + 1);
}

const workflowLinkTable =
  ["workflow_tools", "tool_workflows"].find((name) => results[name]?.ok) ?? null;
const workflowLinks = workflowLinkTable ? results[workflowLinkTable].rows : [];
const workflowCountByTool = new Map();
for (const link of workflowLinks) {
  const toolId = String(link.tool_id ?? "");
  if (!toolId) continue;
  workflowCountByTool.set(toolId, (workflowCountByTool.get(toolId) ?? 0) + 1);
}

const coverage = eligibleCandidates.map((tool) => ({
  ...tool,
  skill_count: skillIdsByTool.get(String(tool.id))?.size ?? 0,
  workflow_count: workflowCountByTool.get(String(tool.id)) ?? 0,
}));

const workflows = (results.workflows?.rows ?? []).map((workflow) => ({
  ...pick(workflow, [
    "id",
    "name",
    "slug",
    "description",
    "is_active",
    "created_at",
    "updated_at",
  ]),
  step_count: stepCountByWorkflow.get(String(workflow.id)) ?? 0,
}));

const skills = (results.skills?.rows ?? []).map((skill) =>
  pick(skill, [
    "id",
    "name",
    "slug",
    "description",
    "risk_level",
    "status",
    "current_version_id",
    "created_at",
    "updated_at",
  ]),
);

const summary = {
  generated_at: new Date().toISOString(),
  read_only: true,
  tools_total: toolCatalog.length,
  tools_active: activeTools.length,
  media_candidates_active: mediaCandidates.length,
  eligible_candidates_active: eligibleCandidates.length,
  skills_total: skills.length,
  tool_skill_links: toolSkills.length,
  eligible_tools_without_skills: coverage.filter((row) => row.skill_count === 0).length,
  workflows_total: workflows.length,
  workflow_steps_total: workflowSteps.length,
  workflows_without_steps: workflows.filter((row) => row.step_count === 0).length,
  workflow_tool_link_table: workflowLinkTable,
  workflow_tool_links: workflowLinks.length,
  eligible_tools_without_workflows:
    workflowLinkTable === null
      ? null
      : coverage.filter((row) => row.workflow_count === 0).length,
  ai_providers_total: results.ai_providers?.rows?.length ?? 0,
  ai_models_total: results.ai_models?.rows?.length ?? 0,
};

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(",")),
  ].join("\n");
}

const tableStatus = Object.fromEntries(
  Object.entries(results).map(([name, result]) => [
    name,
    {
      ok: result.ok,
      count: result.ok ? result.rows.length : null,
      error: result.error,
      columns:
        result.ok && result.rows[0] ? Object.keys(result.rows[0]).sort() : [],
    },
  ]),
);

const reportJson = {
  summary,
  table_status: tableStatus,
  tools: toolCatalog,
  eligible_tool_candidates: coverage,
  media_candidates: mediaCandidates,
  skills,
  workflows,
};

await writeFile(
  path.join(OUT_DIR, "audit.json"),
  JSON.stringify(reportJson, null, 2),
  "utf8",
);
await writeFile(
  path.join(OUT_DIR, "tools.csv"),
  toCsv(toolCatalog),
  "utf8",
);
await writeFile(
  path.join(OUT_DIR, "eligible-tool-candidates.csv"),
  toCsv(coverage),
  "utf8",
);
await writeFile(
  path.join(OUT_DIR, "media-candidates.csv"),
  toCsv(mediaCandidates),
  "utf8",
);
await writeFile(
  path.join(OUT_DIR, "skills.csv"),
  toCsv(skills),
  "utf8",
);
await writeFile(
  path.join(OUT_DIR, "workflows.csv"),
  toCsv(workflows),
  "utf8",
);

const md = `# V6-00 — جرد الأدوات والربط الحالي

> هذا التقرير للقراءة فقط ولم يغيّر قاعدة البيانات.

## الملخص

- إجمالي الأدوات: **${summary.tools_total}**
- الأدوات النشطة: **${summary.tools_active}**
- مرشحو أدوات الميديا النشطة: **${summary.media_candidates_active}**
- الأدوات المؤهلة مبدئيًا: **${summary.eligible_candidates_active}**
- إجمالي المهارات الحالية: **${summary.skills_total}**
- روابط الأدوات بالمهارات: **${summary.tool_skill_links}**
- الأدوات المؤهلة دون مهارات: **${summary.eligible_tools_without_skills}**
- إجمالي مسارات العمل الحالية: **${summary.workflows_total}**
- إجمالي خطوات المسارات: **${summary.workflow_steps_total}**
- مسارات بلا خطوات: **${summary.workflows_without_steps}**
- جدول ربط الأدوات بالمسارات: **${summary.workflow_tool_link_table ?? "غير موجود/غير مكتشف"}**
- الأدوات المؤهلة دون مسارات: **${summary.eligible_tools_without_workflows ?? "غير قابل للحساب قبل إنشاء جدول الربط"}**
- مزودو الذكاء الاصطناعي: **${summary.ai_providers_total}**
- نماذج الذكاء الاصطناعي: **${summary.ai_models_total}**

## الملفات

- \`audit.json\`: التقرير الكامل.
- \`tools.csv\`: جميع الأدوات.
- \`eligible-tool-candidates.csv\`: الأدوات المؤهلة مبدئيًا مع التغطية الحالية.
- \`media-candidates.csv\`: مرشحو الميديا مع سبب التصنيف.
- \`skills.csv\`: المهارات الحالية.
- \`workflows.csv\`: المسارات الحالية وعدد خطوات كل مسار.

## الخطوة التالية

مراجعة \`media-candidates.csv\` واعتماد قائمة الاستبعاد نهائيًا، ثم بناء خريطة:
\`أداة → قدرات فريدة → Skills → Workflows\`.
`;

await writeFile(path.join(OUT_DIR, "V6-00-AUDIT.md"), md, "utf8");

console.log("\nV6-00 audit complete.");
console.table(summary);
console.log(`Reports written to: ${OUT_DIR}`);
