import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL;

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function fetchAll(table, columns, orderColumn = "id") {
  const rows = [];
  const pageSize = 1000;

  for (let start = 0; ; start += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order(orderColumn, { ascending: true })
      .range(start, start + pageSize - 1);

    if (error) {
      throw new Error(`${table}: ${error.message}`);
    }

    rows.push(...(data ?? []));

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return rows;
}

function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const [
  tools,
  workflows,
  relations,
  steps,
] = await Promise.all([
  fetchAll(
    "tools",
    [
      "id",
      "slug",
      "engine_type",
      "runtime_config",
      "prompt_template",
      "input_schema",
      "output_schema",
      "model_alias",
      "provider_strategy",
      "is_active",
    ].join(","),
  ),
  fetchAll(
    "workflows",
    "id, slug, name, is_active",
  ),
  fetchAll(
    "workflow_tools",
    "workflow_id, tool_id, sort_order",
    "workflow_id",
  ),
  fetchAll(
    "workflow_steps",
    [
      "id",
      "workflow_id",
      "step_key",
      "step_type",
      "sort_order",
      "config",
      "continue_on_error",
    ].join(","),
  ),
]);

const toolsById = new Map(
  tools.map((tool) => [String(tool.id), tool]),
);

const workflowsById = new Map(
  workflows.map((workflow) => [String(workflow.id), workflow]),
);

const relationsByTool = new Map();

for (const relation of relations) {
  const toolId = String(relation.tool_id);
  const current = relationsByTool.get(toolId) ?? [];

  current.push({
    ...relation,
    workflow: workflowsById.get(String(relation.workflow_id)) ?? null,
  });

  relationsByTool.set(toolId, current);
}

for (const rows of relationsByTool.values()) {
  rows.sort((left, right) => {
    const orderDifference =
      Number(left.sort_order ?? 0) -
      Number(right.sort_order ?? 0);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return String(left.workflow?.slug ?? "").localeCompare(
      String(right.workflow?.slug ?? ""),
    );
  });
}

const linkedToolIds = [...relationsByTool.keys()];
const linkedTools = linkedToolIds
  .map((id) => toolsById.get(id))
  .filter(Boolean);

const engineCounts = {};
const readinessCounts = {};
const issues = [];
const readyTools = [];
const selectedWorkflows = [];
const multipleWorkflowTools = [];

function addCount(target, key) {
  target[key] = (target[key] ?? 0) + 1;
}

for (const tool of linkedTools) {
  const engine = String(tool.engine_type ?? "unknown");
  const runtime = objectValue(tool.runtime_config);
  const toolRelations = relationsByTool.get(String(tool.id)) ?? [];
  const selected = toolRelations[0];

  addCount(engineCounts, engine);

  if (toolRelations.length > 1) {
    multipleWorkflowTools.push({
      tool_id: tool.id,
      tool_slug: tool.slug,
      engine_type: engine,
      workflow_count: toolRelations.length,
      workflow_slugs: toolRelations.map(
        (relation) => relation.workflow?.slug ?? null,
      ),
    });
  }

  selectedWorkflows.push({
    tool_id: tool.id,
    tool_slug: tool.slug,
    engine_type: engine,
    workflow_id: selected?.workflow_id ?? null,
    workflow_slug: selected?.workflow?.slug ?? null,
    relation_sort_order: selected?.sort_order ?? null,
  });

  const missing = [];

  if (engine === "formula") {
    if (!nonEmptyString(runtime.expression)) {
      missing.push("runtime_config.expression");
    }
  } else if (
    engine === "ai_text" ||
    engine === "ai_structured"
  ) {
    if (!nonEmptyString(tool.prompt_template)) {
      missing.push("prompt_template");
    }

    if (!nonEmptyString(tool.model_alias)) {
      missing.push("model_alias");
    }
  } else if (engine === "text_transform") {
    if (!nonEmptyString(runtime.input_key)) {
      missing.push("runtime_config.input_key");
    }

    if (
      !Array.isArray(runtime.operations) ||
      runtime.operations.length === 0
    ) {
      missing.push("runtime_config.operations");
    }
  } else if (
    engine === "http_api" ||
    engine === "webhook"
  ) {
    if (!nonEmptyString(runtime.connection_id)) {
      missing.push("runtime_config.connection_id");
    }

    if (!nonEmptyString(runtime.path)) {
      missing.push("runtime_config.path");
    }
  } else {
    missing.push(`unsupported_engine:${engine}`);
  }

  if (missing.length) {
    addCount(readinessCounts, "not_ready");

    issues.push({
      tool_id: tool.id,
      tool_slug: tool.slug,
      engine_type: engine,
      selected_workflow_slug:
        selected?.workflow?.slug ?? null,
      missing,
      runtime_config_keys: Object.keys(runtime).sort(),
      has_prompt_template:
        nonEmptyString(tool.prompt_template),
    });
  } else {
    addCount(readinessCounts, "ready");

    readyTools.push({
      tool_id: tool.id,
      tool_slug: tool.slug,
      engine_type: engine,
      selected_workflow_slug:
        selected?.workflow?.slug ?? null,
    });
  }
}

const stepsByOriginalType = {};
const sequenceCounts = {};

const stepsByWorkflow = new Map();

for (const step of steps) {
  const workflowId = String(step.workflow_id);
  const current = stepsByWorkflow.get(workflowId) ?? [];

  current.push(step);
  stepsByWorkflow.set(workflowId, current);

  const originalType = String(
    objectValue(step.config).v6_original_step_type ??
    "(missing)",
  );

  addCount(stepsByOriginalType, originalType);
}

for (const workflowSteps of stepsByWorkflow.values()) {
  const ordered = [...workflowSteps].sort(
    (left, right) =>
      Number(left.sort_order) -
      Number(right.sort_order),
  );

  const sequence = ordered
    .map((step) =>
      String(
        objectValue(step.config).v6_original_step_type ??
        step.step_type,
      ),
    )
    .join(" > ");

  addCount(sequenceCounts, sequence);
}

const summary = {
  active_tools_total:
    tools.filter((tool) => tool.is_active).length,
  linked_tools_total: linkedTools.length,
  workflow_relations_total: relations.length,
  workflows_total: workflows.length,
  workflow_steps_total: steps.length,
  source_ready_tools: readyTools.length,
  source_not_ready_tools: issues.length,
  tools_with_multiple_workflows:
    multipleWorkflowTools.length,
  selected_workflows_total:
    selectedWorkflows.length,
};

const report = {
  generated_at: new Date().toISOString(),
  summary,
  engine_counts: engineCounts,
  readiness_counts: readinessCounts,
  original_step_type_counts: stepsByOriginalType,
  workflow_sequence_counts: sequenceCounts,
  source_issues: issues,
  ready_tools: readyTools,
  selected_workflows: selectedWorkflows,
  multiple_workflow_tools: multipleWorkflowTools,
};

const outputDirectory = path.resolve(
  "reports/v6-00-4",
);

fs.mkdirSync(outputDirectory, {
  recursive: true,
});

fs.writeFileSync(
  path.join(
    outputDirectory,
    "source-readiness.json",
  ),
  `${JSON.stringify(report, null, 2)}\n`,
);

const markdown = `# V6-00.4 Source Readiness

Generated: ${report.generated_at}

| Metric | Count |
|---|---:|
${Object.entries(summary)
  .map(([name, value]) => `| ${name} | ${value} |`)
  .join("\n")}

## Engine counts

${Object.entries(engineCounts)
  .map(([name, value]) => `- ${name}: ${value}`)
  .join("\n")}

## Workflow sequences

${Object.entries(sequenceCounts)
  .map(([name, value]) => `- ${name}: ${value}`)
  .join("\n")}
`;

fs.writeFileSync(
  path.join(
    outputDirectory,
    "V6-00-4-SOURCE-READINESS.md",
  ),
  `${markdown}\n`,
);

console.log("\n===== SUMMARY =====");
console.table(summary);

console.log("\n===== ENGINE COUNTS =====");
console.table(engineCounts);

console.log("\n===== READINESS =====");
console.table(readinessCounts);

console.log("\n===== WORKFLOW SEQUENCES =====");
console.table(sequenceCounts);

console.log(
  `\nReport: ${outputDirectory}`,
);
