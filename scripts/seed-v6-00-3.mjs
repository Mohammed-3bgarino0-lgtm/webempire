#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "reports", "v6-00-3");
const CHUNK_SIZE = 400;

function fail(message, details) {
  console.error(`ERROR: ${message}`);
  if (details) console.error(details);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function walkJsonFiles(dir, depth = 0) {
  if (!fs.existsSync(dir) || depth > 5) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(full, depth + 1));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function collectArrays(value, aliases, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectArrays(item, aliases, found);
    return found;
  }
  if (!value || typeof value !== "object") return found;

  for (const [key, child] of Object.entries(value)) {
    if (aliases.includes(key) && Array.isArray(child)) found.push(...child);
    collectArrays(child, aliases, found);
  }
  return found;
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
}

function pick(obj, names, fallback = undefined) {
  for (const name of names) {
    if (obj?.[name] !== undefined && obj?.[name] !== null && obj?.[name] !== "") {
      return obj[name];
    }
  }
  return fallback;
}

function asSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06ff-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueBy(rows, keyFn) {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (key) map.set(key, row);
  }
  return [...map.values()];
}

function locateBlueprint() {
  const explicit = process.env.V6_BLUEPRINT_PATH;
  if (explicit) {
    const resolved = path.resolve(ROOT, explicit);
    if (!fs.existsSync(resolved)) fail(`V6_BLUEPRINT_PATH not found: ${resolved}`);
    return [resolved];
  }

  const candidates = [
    path.join(ROOT, "reports", "v6-00-1"),
    path.join(ROOT, "reports", "v6-00"),
    path.join(ROOT, "reports"),
  ];

  const files = uniqueBy(
    candidates.flatMap((dir) => walkJsonFiles(dir)),
    (item) => item,
  ).filter((file) => {
    const normalized = file.toLowerCase();
    return (
      normalized.includes("blueprint") ||
      normalized.includes("v6-00-1") ||
      normalized.includes("v6_00_1")
    );
  });

  if (!files.length) {
    fail(
      "No V6 blueprint JSON was found.",
      "Set V6_BLUEPRINT_PATH to the generated blueprint JSON file.",
    );
  }

  return files;
}

function loadBlueprint() {
  const files = locateBlueprint();
  const docs = files.map((file) => ({ file, data: readJson(file) }));

  const definitions = {
    skills: ["proposed_skills", "skills"],
    toolSkillLinks: [
      "proposed_tool_skill_links",
      "tool_skill_links",
      "tool_skills",
    ],
    workflows: ["proposed_workflows", "workflows"],
    workflowSteps: [
      "proposed_workflow_steps",
      "workflow_steps",
      "steps",
    ],
    workflowToolLinks: [
      "proposed_tool_workflow_links",
      "workflow_tool_links",
      "tool_workflow_links",
      "workflow_tools",
      "tool_workflows",
    ],
    workflowSkillLinks: [
      "proposed_workflow_skill_links",
      "workflow_skill_links",
      "workflow_skills",
    ],
  };

  const result = { sourceFiles: files };
  for (const [name, aliases] of Object.entries(definitions)) {
    result[name] = docs.flatMap(({ data }) => collectArrays(data, aliases));
  }

  const required = Object.entries(definitions)
    .filter(([name]) => !result[name]?.length)
    .map(([name]) => name);

  if (required.length) {
    fail(
      `Blueprint arrays missing: ${required.join(", ")}`,
      `Searched files:\n${files.map((file) => `- ${path.relative(ROOT, file)}`).join("\n")}`,
    );
  }

  return result;
}

function normalizeBlueprint(raw) {
  const skills = uniqueBy(
    raw.skills.map((item) => {
      const slug = asSlug(pick(item, ["slug", "skill_slug", "key"]));
      const name = String(
        pick(item, ["name", "skill_name", "title", "name_ar"], slug),
      ).trim();
      return {
        slug,
        name,
        description: String(pick(item, ["description", "summary"], "")),
        risk_level: String(pick(item, ["risk_level", "risk"], "low")),
        status: String(pick(item, ["status"], "active")),
        version_number: Number(pick(item, ["version_number", "version"], 1)),
        instructions: String(
          pick(item, ["instructions", "prompt", "system_prompt"], ""),
        ),
      };
    }).filter((item) => item.slug && item.name),
    (item) => item.slug,
  );

  const workflows = uniqueBy(
    raw.workflows.map((item) => {
      const slug = asSlug(pick(item, ["slug", "workflow_slug", "key"]));
      return {
        slug,
        name: String(
          pick(item, ["name", "workflow_name", "title", "name_ar"], slug),
        ).trim(),
        description: String(pick(item, ["description", "summary"], "")),
        is_active: Boolean(pick(item, ["is_active", "active"], true)),
      };
    }).filter((item) => item.slug && item.name),
    (item) => item.slug,
  );

  const toolSkillLinks = uniqueBy(
    raw.toolSkillLinks.map((item, index) => ({
      tool_id: pick(item, ["tool_id"]),
      tool_slug: asSlug(pick(item, ["tool_slug", "tool", "tool_key"])),
      skill_id: pick(item, ["skill_id"]),
      skill_slug: asSlug(pick(item, ["skill_slug", "skill", "skill_key"])),
      sort_order: Number(pick(item, ["sort_order", "order"], index * 10)),
    })),
    (item) =>
      `${item.tool_id ?? item.tool_slug}|${item.skill_id ?? item.skill_slug}`,
  );

  const workflowSteps = uniqueBy(
    raw.workflowSteps.map((item, index) => {
      const workflowSlug = asSlug(
        pick(item, ["workflow_slug", "workflow", "workflow_key"]),
      );
      const stepKey = asSlug(
        pick(item, ["step_key", "key", "slug"], `step-${index + 1}`),
      );
      return {
        workflow_id: pick(item, ["workflow_id"]),
        workflow_slug: workflowSlug,
        step_key: stepKey,
        name: String(pick(item, ["name", "title"], stepKey)),
        original_step_type: String(
          pick(item, ["step_type", "type"], "transform"),
        ).trim(),
        sort_order: Number(pick(item, ["sort_order", "order"], (index + 1) * 10)),
        config: pick(item, ["config"], {}),
        continue_on_error: Boolean(
          pick(item, ["continue_on_error"], false),
        ),
      };
    }),
    (item) =>
      `${item.workflow_id ?? item.workflow_slug}|${item.step_key}`,
  );

  const workflowToolLinks = uniqueBy(
    raw.workflowToolLinks.map((item, index) => ({
      workflow_id: pick(item, ["workflow_id"]),
      workflow_slug: asSlug(
        pick(item, ["workflow_slug", "workflow", "workflow_key"]),
      ),
      tool_id: pick(item, ["tool_id"]),
      tool_slug: asSlug(pick(item, ["tool_slug", "tool", "tool_key"])),
      sort_order: Number(pick(item, ["sort_order", "order"], index * 10)),
    })),
    (item) =>
      `${item.workflow_id ?? item.workflow_slug}|${item.tool_id ?? item.tool_slug}`,
  );

  const workflowSkillLinks = uniqueBy(
    raw.workflowSkillLinks.map((item, index) => ({
      workflow_id: pick(item, ["workflow_id"]),
      workflow_slug: asSlug(
        pick(item, ["workflow_slug", "workflow", "workflow_key"]),
      ),
      skill_id: pick(item, ["skill_id"]),
      skill_slug: asSlug(pick(item, ["skill_slug", "skill", "skill_key"])),
      sort_order: Number(pick(item, ["sort_order", "order"], index * 10)),
    })),
    (item) =>
      `${item.workflow_id ?? item.workflow_slug}|${item.skill_id ?? item.skill_slug}`,
  );

  return {
    sourceFiles: raw.sourceFiles,
    skills,
    toolSkillLinks,
    workflows,
    workflowSteps,
    workflowToolLinks,
    workflowSkillLinks,
  };
}

function makeClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    fail(
      "Supabase admin environment variables are missing.",
      "Required: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function upsertChunks(supabase, table, rows, onConflict) {
  let written = 0;
  for (let index = 0; index < rows.length; index += CHUNK_SIZE) {
    const chunk = rows.slice(index, index + CHUNK_SIZE);
    const { error } = await supabase
      .from(table)
      .upsert(chunk, { onConflict, ignoreDuplicates: false });

    if (error) fail(`Upsert failed for ${table}`, error.message);
    written += chunk.length;
  }
  return written;
}

async function fetchMap(supabase, table, keyColumn = "slug") {
  const { data, error } = await supabase
    .from(table)
    .select(`id,${keyColumn}`)
    .limit(10000);

  if (error) fail(`Failed reading ${table}`, error.message);
  return new Map(data.map((row) => [String(row[keyColumn]), row.id]));
}

function resolveId(row, idKey, slugKey, map, label) {
  if (row[idKey]) return row[idKey];
  const id = map.get(row[slugKey]);
  if (!id) fail(`Unresolved ${label}: ${row[slugKey] || "(empty)"}`);
  return id;
}

function normalizeDatabaseStepType(originalType, config = {}) {
  const type = String(originalType ?? "").trim().toLowerCase();

  const directTypes = new Set([
    "template",
    "formula",
    "http_api",
    "webhook",
    "ai_text",
    "ai_structured",
  ]);

  if (directTypes.has(type)) return type;

  if (type === "validation") return "formula";

  if (
    type === "transform" ||
    type === "text_transform"
  ) {
    return "template";
  }

  if (
    type === "prompt" ||
    type === "ai" ||
    type === "analysis"
  ) {
    const structuredKeys = [
      "json_schema",
      "output_schema",
      "response_schema",
      "structured_output",
      "response_format",
    ];

    const structured = structuredKeys.some(
      (key) => config && typeof config === "object" && config[key],
    );

    return structured ? "ai_structured" : "ai_text";
  }

  throw new Error(`UNSUPPORTED_WORKFLOW_STEP_TYPE: ${originalType}`);
}

function validateExpectedCounts(data) {
  const expected = {
    skills: 79,
    toolSkillLinks: 1198,
    workflows: 629,
    workflowSteps: 2007,
    workflowToolLinks: 629,
    workflowSkillLinks: 1258,
  };

  const mismatches = Object.entries(expected)
    .filter(([key, value]) => data[key].length !== value)
    .map(([key, value]) => `${key}: expected ${value}, found ${data[key].length}`);

  if (mismatches.length && process.env.V6_ALLOW_COUNT_MISMATCH !== "1") {
    fail(
      "Blueprint counts differ from the approved V6-00.2 contract.",
      `${mismatches.join("\n")}\nSet V6_ALLOW_COUNT_MISMATCH=1 only after reviewing the blueprint.`,
    );
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  const blueprint = normalizeBlueprint(loadBlueprint());
  validateExpectedCounts(blueprint);
  const supabase = makeClient();

  const skillRows = blueprint.skills.map((item) =>
    compactObject({
      slug: item.slug,
      name: item.name,
      description: item.description,
      risk_level: item.risk_level,
      status: item.status,
    }),
  );
  await upsertChunks(supabase, "skills", skillRows, "slug");

  let skillMap = await fetchMap(supabase, "skills");
  const versionRows = blueprint.skills.map((item) => ({
    skill_id: skillMap.get(item.slug),
    version_number: item.version_number,
    instructions: item.instructions,
  }));
  await upsertChunks(
    supabase,
    "skill_versions",
    versionRows,
    "skill_id,version_number",
  );

  const { data: versions, error: versionsError } = await supabase
    .from("skill_versions")
    .select("id,skill_id,version_number")
    .in("skill_id", [...skillMap.values()])
    .limit(10000);
  if (versionsError) fail("Failed reading skill_versions", versionsError.message);

  const versionBySkill = new Map(
    versions.map((row) => [`${row.skill_id}|${row.version_number}`, row.id]),
  );

  for (const item of blueprint.skills) {
    const skillId = skillMap.get(item.slug);
    const versionId = versionBySkill.get(`${skillId}|${item.version_number}`);
    const { error } = await supabase
      .from("skills")
      .update({ current_version_id: versionId })
      .eq("id", skillId);
    if (error) fail(`Failed setting current version for ${item.slug}`, error.message);
  }

  const workflowRows = blueprint.workflows.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    is_active: item.is_active,
  }));
  await upsertChunks(supabase, "workflows", workflowRows, "slug");

  const [toolMap, workflowMap] = await Promise.all([
    fetchMap(supabase, "tools"),
    fetchMap(supabase, "workflows"),
  ]);
  skillMap = await fetchMap(supabase, "skills");

  const toolSkillRows = blueprint.toolSkillLinks.map((item) => ({
    tool_id: resolveId(item, "tool_id", "tool_slug", toolMap, "tool"),
    skill_id: resolveId(item, "skill_id", "skill_slug", skillMap, "skill"),
    sort_order: item.sort_order,
  }));
  await upsertChunks(supabase, "tool_skills", toolSkillRows, "tool_id,skill_id");

  const workflowStepRows = blueprint.workflowSteps.map((item) => ({
    workflow_id: resolveId(
      item,
      "workflow_id",
      "workflow_slug",
      workflowMap,
      "workflow",
    ),
    step_key: item.step_key,
    name: item.name,
    step_type: normalizeDatabaseStepType(
      item.original_step_type,
      item.config,
    ),
    sort_order: item.sort_order,
    config: {
      ...(item.config && typeof item.config === "object" ? item.config : {}),
      v6_original_step_type: item.original_step_type,
    },
    continue_on_error: item.continue_on_error,
  }));
  await upsertChunks(
    supabase,
    "workflow_steps",
    workflowStepRows,
    "workflow_id,step_key",
  );

  const workflowToolRows = blueprint.workflowToolLinks.map((item) => ({
    workflow_id: resolveId(
      item,
      "workflow_id",
      "workflow_slug",
      workflowMap,
      "workflow",
    ),
    tool_id: resolveId(item, "tool_id", "tool_slug", toolMap, "tool"),
    sort_order: item.sort_order,
  }));
  await upsertChunks(
    supabase,
    "workflow_tools",
    workflowToolRows,
    "workflow_id,tool_id",
  );

  const workflowSkillRows = blueprint.workflowSkillLinks.map((item) => ({
    workflow_id: resolveId(
      item,
      "workflow_id",
      "workflow_slug",
      workflowMap,
      "workflow",
    ),
    skill_id: resolveId(item, "skill_id", "skill_slug", skillMap, "skill"),
    sort_order: item.sort_order,
  }));
  await upsertChunks(
    supabase,
    "workflow_skills",
    workflowSkillRows,
    "workflow_id,skill_id",
  );

  const summary = {
    version: "V6-00.3",
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    idempotent: true,
    source_files: blueprint.sourceFiles.map((file) => path.relative(ROOT, file)),
    written: {
      skills: skillRows.length,
      skill_versions: versionRows.length,
      tool_skills: toolSkillRows.length,
      workflows: workflowRows.length,
      workflow_steps: workflowStepRows.length,
      workflow_tools: workflowToolRows.length,
      workflow_skills: workflowSkillRows.length,
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(REPORT_DIR, "seed-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );

  console.table(summary.written);
  console.log(`V6-00.3 seed complete. Report: ${path.relative(ROOT, REPORT_DIR)}`);
}

main().catch((error) => fail("Unexpected seed failure", error?.stack ?? error));
