import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckStatus = "healthy" | "unhealthy";

function releaseMetadata() {
  return {
    environment:
      process.env.VERCEL_ENV ??
      process.env.NODE_ENV ??
      "unknown",
    commit:
      process.env.VERCEL_GIT_COMMIT_SHA
        ?.slice(0, 7) ??
      "local",
  };
}

export async function GET() {
  const startedAt = performance.now();

  let databaseStatus: CheckStatus =
    "healthy";

  try {
    const supabase =
      createSupabaseAdminClient();

    const { error } = await supabase
      .from("tools")
      .select("id", {
        count: "exact",
        head: true,
      });

    if (error) {
      throw error;
    }
  } catch {
    databaseStatus = "unhealthy";
  }

  const latencyMs = Math.max(
    0,
    Math.round(
      performance.now() - startedAt,
    ),
  );

  const healthy =
    databaseStatus === "healthy";

  const response = {
    status: healthy
      ? "ok"
      : "degraded",
    service: "webempire",
    timestamp:
      new Date().toISOString(),
    release: releaseMetadata(),
    checks: {
      application: {
        status: "healthy",
      },
      database: {
        status: databaseStatus,
        latency_ms: latencyMs,
      },
    },
  };

  return NextResponse.json(response, {
    status: healthy ? 200 : 503,
    headers: {
      "Cache-Control":
        "no-store, max-age=0",
      "Content-Type":
        "application/json; charset=utf-8",
      "X-Content-Type-Options":
        "nosniff",
    },
  });
}
