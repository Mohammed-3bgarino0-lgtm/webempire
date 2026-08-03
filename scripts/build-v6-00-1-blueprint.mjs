import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const AUDIT_PATH = path.resolve("reports/v6-00/audit.json");
const OUT_DIR = path.resolve("reports/v6-00-1");
await mkdir(OUT_DIR, { recursive: true });

let audit;
try {
  audit = JSON.parse(await readFile(AUDIT_PATH, "utf8"));
} catch (error) {
  console.error(`Unable to read ${AUDIT_PATH}`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const tools = Array.isArray(audit.tools) ? audit.tools : [];
if (!tools.length) {
  console.error("No tools found in V6-00 audit.");
  process.exit(1);
}

function categorySlug(tool) {
  const label = String(tool.category_label ?? "").trim();
  return label.split(/\s+/)[0]?.toLowerCase() || "uncategorized";
}

function isCanonicalMediaTool(tool) {
  const category = categorySlug(tool);
  const engine = String(tool.engine_type ?? "").toLowerCase();
  const slug = String(tool.slug ?? "").toLowerCase();

  // نستبعد أدوات معالجة ملفات الوسائط الفعلية فقط.
  if (category === "media-tools") return true;

  // احتياط لأدوات وسائط فعلية قد تكون خارج الفئة المعتمدة.
  const runtimeMediaActions = [
    "image-resizer",
    "image-compressor",
    "image-converter",
    "audio-converter",
    "audio-compressor",
    "audio-trimmer",
    "video-trimmer",
    "video-compressor",
    "video-format-converter",
    "direct-video-downloader",
  ];

  return (
    engine === "media" ||
    engine === "image" ||
    engine === "video" ||
    engine === "audio" ||
    runtimeMediaActions.includes(slug)
  );
}

const actionRules = [
  ["calculator", "calculation", "الحساب والتحقق"],
  ["converter", "conversion", "التحويل والتحقق"],
  ["generator", "generation", "التوليد المنظم"],
  ["writer", "writing", "الكتابة الموجّهة"],
  ["rewriter", "rewriting", "إعادة الصياغة"],
  ["summarizer", "summarization", "التلخيص"],
  ["checker", "checking", "الفحص والتحقق"],
  ["analyzer", "analysis", "التحليل"],
  ["counter", "counting", "العد والإحصاء"],
  ["remover", "removal", "الإزالة والتنظيف"],
  ["cleaner", "cleaning", "التنظيف والتوحيد"],
  ["sorter", "sorting", "الترتيب"],
  ["normalizer", "normalization", "التوحيد القياسي"],
  ["decorator", "decoration", "الزخرفة والتنسيق"],
  ["formatter", "formatting", "التنسيق"],
  ["validator", "validation", "التحقق"],
  ["trimmer", "trimming", "القص"],
  ["compressor", "compression", "الضغط"],
  ["downloader", "download", "التنزيل"],
  ["optimizer", "optimization", "التحسين"],
  ["planner", "planning", "التخطيط"],
  ["estimator", "estimation", "التقدير"],
  ["creator", "creation", "الإنشاء"],
];

function actionFamily(tool) {
  const slug = String(tool.slug ?? "").toLowerCase();
  for (const [token, key, ar] of actionRules) {
    if (slug.includes(token)) return { key, ar };
  }

  const engine = String(tool.engine_type ?? "").toLowerCase();
  if (engine === "formula") return { key: "calculation", ar: "الحساب والتحقق" };
  if (engine === "text_transform") return { key: "text-transformation", ar: "تحويل النصوص" };
  if (engine === "ai_text") return { key: "ai-assistance", ar: "المعالجة بالذكاء الاصطناعي" };
  if (engine === "custom_runtime") return { key: "runtime-execution", ar: "التشغيل المتخصص" };
  return { key: "tool-execution", ar: "تشغيل الأداة" };
}

function engineGroup(tool) {
  const engine = String(tool.engine_type ?? "").toLowerCase();
  if (engine === "formula") return "formula";
  if (engine === "text_transform") return "text";
  if (engine === "ai_text") return "ai";
  if (engine === "custom_runtime") return "runtime";
  return engine || "generic";
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function title(tool) {
  return String(tool.title_ar || tool.title_en || tool.slug || "أداة");
}

function riskLevel(tool) {
  const category = categorySlug(tool);
  if (["health-tools", "legal-tools", "finance-tools"].includes(category)) return "medium";
  if (engineGroup(tool) === "ai") return "medium";
  return "low";
}

const activeTools = tools.filter((tool) => tool.is_active !== false);
const excludedMedia = activeTools.filter(isCanonicalMediaTool);
const eligibleTools = activeTools.filter((tool) => !isCanonicalMediaTool(tool));
const falsePositiveRestored = activeTools.filter(
  (tool) => tool.media_candidate && !isCanonicalMediaTool(tool),
);

const skillMap = new Map();
const toolSkillLinks = [];

function ensureSkill(skill) {
  if (!skillMap.has(skill.slug)) skillMap.set(skill.slug, skill);
  return skillMap.get(skill.slug);
}

for (const tool of eligibleTools) {
  const category = categorySlug(tool);
  const action = actionFamily(tool);
  const engine = engineGroup(tool);

  const familySkill = ensureSkill({
    slug: slugify(`skill-${category}-${action.key}`),
    name_ar: `${action.ar} — ${String(tool.category_label ?? category).replace(category, "").trim() || category}`,
    name_en: `${action.key.replaceAll("-", " ")} — ${category}`,
    category_slug: category,
    capability_key: action.key,
    engine_group: engine,
    risk_level: riskLevel(tool),
    description: `قدرة مشتركة لأدوات ${category} التي تنفذ ${action.key}.`,
    instructions: [
      "تحقق من اكتمال المدخلات وصحتها.",
      "نفّذ منطق الأداة المحدد دون تغيير المعنى أو الوحدات.",
      "أظهر النتيجة بصيغة واضحة وقابلة للاستخدام.",
      "لا تختلق قيمًا غير موجودة في المدخلات.",
    ].join("\n"),
  });

  toolSkillLinks.push({
    tool_id: tool.id,
    tool_slug: tool.slug,
    tool_title_ar: title(tool),
    skill_slug: familySkill.slug,
    link_type: "family",
    sort_order: 10,
  });

  const engineSkill = ensureSkill({
    slug: slugify(`skill-engine-${engine}`),
    name_ar:
      engine === "ai"
        ? "تشغيل أدوات الذكاء الاصطناعي"
        : engine === "formula"
          ? "تنفيذ المعادلات والتحقق من النتائج"
          : engine === "text"
            ? "تحويل النصوص مع الحفاظ على المحتوى"
            : engine === "runtime"
              ? "تشغيل المحركات المتخصصة بأمان"
              : "تشغيل الأدوات العامة",
    name_en: `${engine} engine execution`,
    category_slug: "platform-core",
    capability_key: `engine-${engine}`,
    engine_group: engine,
    risk_level: engine === "ai" ? "medium" : "low",
    description: `قدرة تشغيل مشتركة لمحرك ${engine}.`,
    instructions:
      engine === "ai"
        ? "تحقق من المزود والنموذج وAlias، ابنِ الطلب، نفّذ الاستدعاء، تحقّق من المخرجات وسجل الاستخدام."
        : "تحقق من المدخلات، نفّذ المحرك الصحيح، تحقّق من المخرجات وأعد نتيجة منظمة.",
  });

  toolSkillLinks.push({
    tool_id: tool.id,
    tool_slug: tool.slug,
    tool_title_ar: title(tool),
    skill_slug: engineSkill.slug,
    link_type: "engine",
    sort_order: 20,
  });
}

const workflows = [];
const workflowSteps = [];
const toolWorkflowLinks = [];
const workflowSkillLinks = [];

function addWorkflow(tool, variant, nameSuffix, steps, relatedSkillSlugs) {
  const workflowSlug = slugify(`workflow-${tool.slug}-${variant}`);
  workflows.push({
    slug: workflowSlug,
    name_ar: `${title(tool)} — ${nameSuffix}`,
    name_en: `${tool.title_en || tool.slug} — ${variant}`,
    description: `مسار ${nameSuffix} لأداة ${title(tool)}.`,
    category_slug: categorySlug(tool),
    engine_group: engineGroup(tool),
    is_active: true,
    version: 1,
  });

  toolWorkflowLinks.push({
    tool_id: tool.id,
    tool_slug: tool.slug,
    workflow_slug: workflowSlug,
    is_primary: variant === "standard",
  });

  relatedSkillSlugs.forEach((skillSlug, index) => {
    workflowSkillLinks.push({
      workflow_slug: workflowSlug,
      skill_slug: skillSlug,
      sort_order: (index + 1) * 10,
    });
  });

  steps.forEach((step, index) => {
    workflowSteps.push({
      workflow_slug: workflowSlug,
      step_order: index + 1,
      step_key: step.key,
      step_name_ar: step.name,
      step_type: step.type,
      input_source: step.input,
      output_key: step.output,
      is_required: true,
    });
  });
}

for (const tool of eligibleTools) {
  const links = toolSkillLinks
    .filter((link) => link.tool_id === tool.id)
    .map((link) => link.skill_slug);
  const engine = engineGroup(tool);

  if (engine === "ai") {
    addWorkflow(
      tool,
      "quick",
      "المسار السريع",
      [
        { key: "validate", name: "التحقق من المدخلات", type: "validation", input: "user_input", output: "validated_input" },
        { key: "prompt", name: "بناء طلب الذكاء الاصطناعي", type: "prompt", input: "validated_input", output: "prompt" },
        { key: "ai_run", name: "تشغيل النموذج", type: "ai", input: "prompt", output: "ai_output" },
        { key: "format", name: "تنسيق النتيجة", type: "transform", input: "ai_output", output: "final_output" },
      ],
      links,
    );

    addWorkflow(
      tool,
      "professional",
      "المسار الاحترافي",
      [
        { key: "validate", name: "التحقق المتقدم من المدخلات", type: "validation", input: "user_input", output: "validated_input" },
        { key: "context", name: "تحليل الهدف والسياق", type: "analysis", input: "validated_input", output: "context" },
        { key: "prompt", name: "بناء طلب احترافي", type: "prompt", input: "context", output: "prompt" },
        { key: "ai_run", name: "تشغيل النموذج", type: "ai", input: "prompt", output: "draft_output" },
        { key: "quality", name: "مراجعة الجودة", type: "validation", input: "draft_output", output: "quality_output" },
        { key: "format", name: "إخراج النتيجة النهائية", type: "transform", input: "quality_output", output: "final_output" },
      ],
      links,
    );
  } else if (engine === "formula") {
    addWorkflow(
      tool,
      "standard",
      "مسار الحساب",
      [
        { key: "validate", name: "التحقق من القيم والوحدات", type: "validation", input: "user_input", output: "validated_input" },
        { key: "calculate", name: "تنفيذ المعادلة", type: "formula", input: "validated_input", output: "calculation_result" },
        { key: "format", name: "تقريب وتنسيق النتيجة", type: "transform", input: "calculation_result", output: "final_output" },
      ],
      links,
    );
  } else if (engine === "text") {
    addWorkflow(
      tool,
      "standard",
      "مسار معالجة النص",
      [
        { key: "validate", name: "التحقق من النص", type: "validation", input: "user_input", output: "validated_text" },
        { key: "transform", name: "تنفيذ التحويل", type: "text_transform", input: "validated_text", output: "transformed_text" },
        { key: "preview", name: "تجهيز النتيجة للنسخ", type: "transform", input: "transformed_text", output: "final_output" },
      ],
      links,
    );
  } else {
    addWorkflow(
      tool,
      "standard",
      "مسار التشغيل",
      [
        { key: "validate", name: "التحقق من المدخلات", type: "validation", input: "user_input", output: "validated_input" },
        { key: "run", name: "تشغيل الأداة", type: "runtime", input: "validated_input", output: "runtime_output" },
        { key: "verify", name: "التحقق من المخرجات", type: "validation", input: "runtime_output", output: "verified_output" },
        { key: "deliver", name: "تسليم النتيجة", type: "transform", input: "verified_output", output: "final_output" },
      ],
      links,
    );
  }
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
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

const categorySummaryMap = new Map();
for (const tool of eligibleTools) {
  const key = `${categorySlug(tool)}|${engineGroup(tool)}`;
  const row = categorySummaryMap.get(key) ?? {
    category_slug: categorySlug(tool),
    engine_group: engineGroup(tool),
    tool_count: 0,
  };
  row.tool_count += 1;
  categorySummaryMap.set(key, row);
}

const summary = {
  generated_at: new Date().toISOString(),
  read_only: true,
  active_tools_total: activeTools.length,
  excluded_media_tools: excludedMedia.length,
  restored_false_positive_media_candidates: falsePositiveRestored.length,
  eligible_tools_final: eligibleTools.length,
  proposed_skills: skillMap.size,
  proposed_tool_skill_links: toolSkillLinks.length,
  proposed_workflows: workflows.length,
  proposed_workflow_steps: workflowSteps.length,
  proposed_tool_workflow_links: toolWorkflowLinks.length,
  proposed_workflow_skill_links: workflowSkillLinks.length,
  eligible_tools_without_skill_plan:
    eligibleTools.filter((tool) => !toolSkillLinks.some((link) => link.tool_id === tool.id)).length,
  eligible_tools_without_workflow_plan:
    eligibleTools.filter((tool) => !toolWorkflowLinks.some((link) => link.tool_id === tool.id)).length,
};

const outputs = {
  "eligible-tools-final.csv": eligibleTools,
  "excluded-media-tools-final.csv": excludedMedia,
  "restored-false-positive-media-candidates.csv": falsePositiveRestored,
  "category-engine-summary.csv": [...categorySummaryMap.values()],
  "skills-plan.csv": [...skillMap.values()],
  "tool-skill-links-plan.csv": toolSkillLinks,
  "workflows-plan.csv": workflows,
  "workflow-steps-plan.csv": workflowSteps,
  "tool-workflow-links-plan.csv": toolWorkflowLinks,
  "workflow-skill-links-plan.csv": workflowSkillLinks,
};

for (const [name, rows] of Object.entries(outputs)) {
  await writeFile(path.join(OUT_DIR, name), toCsv(rows), "utf8");
}

await writeFile(
  path.join(OUT_DIR, "blueprint.json"),
  JSON.stringify(
    {
      summary,
      excluded_media: excludedMedia,
      eligible_tools: eligibleTools,
      skills: [...skillMap.values()],
      tool_skill_links: toolSkillLinks,
      workflows,
      workflow_steps: workflowSteps,
      tool_workflow_links: toolWorkflowLinks,
      workflow_skill_links: workflowSkillLinks,
    },
    null,
    2,
  ),
  "utf8",
);

const md = `# V6-00.1 — مخطط المهارات ومسارات العمل

> هذا المخطط للقراءة فقط ولم يغيّر Supabase.

## التصنيف النهائي المقترح

- الأدوات النشطة: **${summary.active_tools_total}**
- أدوات الميديا الفعلية المستبعدة: **${summary.excluded_media_tools}**
- مرشحو ميديا أعيدوا لأنهم أدوات نصية/حسابية: **${summary.restored_false_positive_media_candidates}**
- الأدوات المؤهلة النهائية: **${summary.eligible_tools_final}**

## مخطط الربط

- المهارات المقترحة: **${summary.proposed_skills}**
- روابط الأدوات بالمهارات: **${summary.proposed_tool_skill_links}**
- مسارات العمل المقترحة: **${summary.proposed_workflows}**
- خطوات المسارات: **${summary.proposed_workflow_steps}**
- روابط الأدوات بالمسارات: **${summary.proposed_tool_workflow_links}**
- روابط المسارات بالمهارات: **${summary.proposed_workflow_skill_links}**

## اختبارات التغطية

- أدوات مؤهلة بلا Skill مخطط: **${summary.eligible_tools_without_skill_plan}**
- أدوات مؤهلة بلا Workflow مخطط: **${summary.eligible_tools_without_workflow_plan}**

## قاعدة التوليد

- أدوات AI: مساران، سريع واحترافي.
- الحاسبات: مسار تحقق وحساب وتنسيق.
- أدوات النصوص: مسار تحقق وتحويل وتجهيز.
- المحركات الأخرى: مسار تحقق وتشغيل وفحص وتسليم.
- كل أداة ترتبط بمهارة عائلية ومهارة محرك مشتركة.
- أدوات الميديا المستبعدة لا تدخل في المهارات أو المسارات.

## قبل التطبيق

راجع:
- \`excluded-media-tools-final.csv\`
- \`skills-plan.csv\`
- \`workflows-plan.csv\`
- \`category-engine-summary.csv\`

بعد الاعتماد تُنشأ Migration لجداول الربط المفقودة ثم Seed آمن قابل لإعادة التشغيل.
`;

await writeFile(path.join(OUT_DIR, "V6-00-1-BLUEPRINT.md"), md, "utf8");

console.log("\nV6-00.1 blueprint complete.");
console.table(summary);
console.log(`Reports written to: ${OUT_DIR}`);
