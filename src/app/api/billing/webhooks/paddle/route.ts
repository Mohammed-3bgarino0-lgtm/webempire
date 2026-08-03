import {
  Environment,
  Paddle,
} from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaddleEventMetadata = {
  eventId?: unknown;
  eventType?: unknown;
  notificationId?: unknown;
  occurredAt?: unknown;
};

let paddleClient: Paddle | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name}_MISSING`);
  }

  return value;
}

function getPaddleClient(): Paddle {
  if (paddleClient) {
    return paddleClient;
  }

  const environment =
    requiredEnv("PADDLE_ENV");

  if (environment !== "sandbox") {
    throw new Error(
      "PADDLE_SANDBOX_ENVIRONMENT_REQUIRED",
    );
  }

  paddleClient = new Paddle(
    requiredEnv("PADDLE_API_KEY"),
    {
      environment: Environment.sandbox,
    },
  );

  return paddleClient;
}

function text(value: unknown): string | null {
  return typeof value === "string" &&
    value.length > 0
    ? value
    : null;
}

function dateText(
  value: unknown,
): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" &&
    value.length > 0
  ) {
    return value;
  }

  return null;
}

export async function POST(
  request: Request,
) {
  const signature =
    request.headers.get(
      "paddle-signature",
    );

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "PADDLE_SIGNATURE_MISSING",
      },
      {
        status: 400,
      },
    );
  }

  const rawBody =
    await request.text();

  if (!rawBody) {
    return NextResponse.json(
      {
        error:
          "PADDLE_WEBHOOK_BODY_MISSING",
      },
      {
        status: 400,
      },
    );
  }

  let eventData: unknown;

  try {
    eventData =
      await getPaddleClient()
        .webhooks
        .unmarshal(
          rawBody,
          requiredEnv(
            "PADDLE_WEBHOOK_SECRET",
          ),
          signature,
        );
  } catch {
    return NextResponse.json(
      {
        error:
          "PADDLE_SIGNATURE_INVALID",
      },
      {
        status: 400,
      },
    );
  }

  const metadata =
    eventData as PaddleEventMetadata;

  const payload =
    JSON.parse(
      JSON.stringify(eventData),
    ) as Record<string, unknown>;

  const eventId =
    text(metadata.eventId) ??
    text(payload.event_id);

  const eventType =
    text(metadata.eventType) ??
    text(payload.event_type);

  const notificationId =
    text(metadata.notificationId) ??
    text(payload.notification_id);

  const occurredAt =
    dateText(metadata.occurredAt) ??
    dateText(payload.occurred_at);

  if (!eventId || !eventType) {
    return NextResponse.json(
      {
        error:
          "PADDLE_EVENT_METADATA_INVALID",
      },
      {
        status: 400,
      },
    );
  }

  const supabase =
    createSupabaseAdminClient();

  const { error } =
    await supabase
      .from(
        "paddle_webhook_events",
      )
      .insert({
        event_id: eventId,
        notification_id:
          notificationId,
        event_type: eventType,
        occurred_at: occurredAt,
        status: "received",
        payload,
      });

  if (error?.code === "23505") {
    return NextResponse.json({
      received: true,
      duplicate: true,
      eventId,
      eventType,
    });
  }

  if (error) {
    console.error(
      "PADDLE_WEBHOOK_STORAGE_FAILED",
      {
        code: error.code,
        message: error.message,
      },
    );

    return NextResponse.json(
      {
        error:
          "PADDLE_WEBHOOK_STORAGE_FAILED",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    received: true,
    duplicate: false,
    eventId,
    eventType,
  });
}
