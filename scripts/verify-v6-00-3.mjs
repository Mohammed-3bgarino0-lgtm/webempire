#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, "reports", "v6-00-3");

function fail(message, details) {
  console.error(`ERROR: ${message}`);
  if (details) console.error(details);
  process.exit(1);
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

async function exactCount(supabase, table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) fail(`Count failed for ${table}`, error.message);
  return count ?? 0;
}

async function duplicateCount(supabase, table, columns) {
  // PostgREST cannot group directly here. Fetch compact key columns with pagination.
  const pageSize = 1000;
  const rows = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(columns.join(","))
      .range(from, from + pageSize - 1);
    if (error) fail(`Duplicate scan failed for ${table}`, error.message);
    rows.push(...data);
    if (data.length < pageSize) break;
  }
  const seen = new Set();
  let duplicates = 0;
  for (const row of rows) {
    const key = columns.map((column) => row[column]).join("|");
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  }
  return duplicates;
}

async function main() {
  const supabase = makeClient();

  const counts = {
    skills: await exactCount(supabase, "skills"),
    skill_versions: await exactCount(supabase, "skill_versions"),
    tool_skills: await exactCount(supabase, "tool_skills"),
    workflows: await exactCount(supabase, "workflows"),
    workflow_steps: await exactCount(supabase, "workflow_steps"),
    workflow_tools: await exactCount(supabase, "workflow_tools"),
    tool_workflows_compatibility: await exactCount(supabase, "tool_workflows"),
    workflow_skills: await exactCount(supabase, "workflow_skills"),
  };

  const minimums = {
    skills: 79,
    tool_skills: 1198,
    workflows: 629,
    workflow_steps: 2007,
    workflow_tools: 629,
    tool_workflows_compatibility: 629,
    workflow_skills: 1258,
  };

  const duplicateChecks = {
    skills_slug: await duplicateCount(supabase, "skills", ["slug"]),
    workflows_slug: await duplicateCount(supabase, "workflows", ["slug"]),
    workflow_steps_key: await duplicateCount(
      supabase,
      "workflow_steps",
      ["workflow_id", "step_key"],
    ),
    workflow_tools_key: await duplicateCount(
      supabase,
      "workflow_tools",
      ["workflow_id", "tool_id"],
    ),
    workflow_skills_key: await duplicateCount(
      supabase,
      "workflow_skills",
      ["workflow_id", "skill_id"],
    ),
  };

  const failures = [];
  for (const [key, minimum] of Object.entries(minimums)) {
    if ((counts[key] ?? 0) < minimum) {
      failures.push(`${key}: expected at least ${minimum}, found ${counts[key] ?? 0}`);
    }
  }
  for (const [key, duplicates] of Object.entries(duplicateChecks)) {
    if (duplicates !== 0) failures.push(`${key}: ${duplicates} duplicate rows`);
  }
  if (counts.workflow_tools !== counts.tool_workflows_compatibility) {
    failures.push(
      `compatibility view mismatch: workflow_tools=${counts.workflow_tools}, tool_workflows=${counts.tool_workflows_compatibility}`,
    );
  }

  const report = {
    version: "V6-00.3",
    generated_at: new Date().toISOString(),
    status: failures.length ? "FAIL" : "PASS",
    counts,
    duplicate_checks: duplicateChecks,
    failures,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(REPORT_DIR, "verification.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  const markdown = [
    "# V6-00.3 — Relationship Seed Verification",
    "",
    `- Status: **${report.status}**`,
    `- Generated: ${report.generated_at}`,
    "",
    "## Counts",
    "",
    "| Entity | Count |",
    "|---|---:|",
    ...Object.entries(counts).map(([key, value]) => `| ${key} | ${value} |`),
    "",
    "## Duplicate checks",
    "",
    "| Key | Duplicates |",
    "|---|---:|",
    ...Object.entries(duplicateChecks).map(
      ([key, value]) => `| ${key} | ${value} |`,
    ),
    "",
    ...(failures.length
      ? ["## Failures", "", ...failures.map((item) => `- ${item}`), ""]
      : []),
  ].join("\n");

  fs.writeFileSync(
    path.join(REPORT_DIR, "V6-00-3-VERIFICATION.md"),
    `${markdown}\n`,
  );

  console.table(counts);
  console.table(duplicateChecks);

  if (failures.length) {
    fail("V6-00.3 verification: FAIL", failures.join("\n"));
  }

  console.log("V6-00.3 verification: PASS");
  console.log(`Reports written to: ${path.relative(ROOT, REPORT_DIR)}`);
}

main().catch((error) => fail("Unexpected verification failure", error?.stack ?? error));
