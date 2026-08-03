import {
  Environment,
  Paddle,
} from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getRequestUserId } from "@/lib/request-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  planId: z.string().uuid(),
  locale: z.enum(["ar", "en"]),
});

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

  if (requiredEnv("PADDLE_ENV") !== "sandbox") {
    throw new Error(
      "PADDLE_SANDBOX_ENVIRONMENT_REQUIRED",
    );
  }

  const apiKey = requiredEnv(
    "PADDLE_API_KEY",
  );

  if (
    !apiKey.startsWith(
      "pdl_sdbx_apikey_",
    )
  ) {
    throw new Error(
      "PADDLE_SANDBOX_API_KEY_INVALID",
    );
  }

  paddleClient = new Paddle(apiKey, {
    environment: Environment.sandbox,
  });

  return paddleClient;
}

function getPriceId(
  planSlug: string,
): string {
  const envName =
    planSlug === "pro"
      ? "PADDLE_PRO_MONTHLY_PRICE_ID"
      : planSlug === "business"
        ? "PADDLE_BUSINESS_MONTHLY_PRICE_ID"
        : "";

  if (!envName) {
    throw new Error(
      "PADDLE_PLAN_NOT_SUPPORTED",
    );
  }

  const priceId = requiredEnv(envName);

  if (!priceId.startsWith("pri_")) {
    throw new Error(
      "PADDLE_PRICE_ID_INVALID",
    );
  }

  return priceId;
}

export async function POST(
  request: Request,
) {
  try {
    const userId =
      await getRequestUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          error: "LOGIN_REQUIRED",
        },
        {
          status: 401,
        },
      );
    }

    const body = requestSchema.parse(
      await request.json(),
    );

    const supabase =
      createSupabaseAdminClient();

    const {
      data: plan,
      error: planError,
    } = await supabase
      .from("plans")
      .select(
        "id, slug, monthly_credits, is_active",
      )
      .eq("id", body.planId)
      .eq("is_active", true)
      .maybeSingle();

    if (planError) {
      throw new Error(
        planError.message,
      );
    }

    if (!plan) {
      throw new Error(
        "BILLING_PLAN_NOT_FOUND",
      );
    }

    const planSlug = String(
      plan.slug,
    );

    if (
      planSlug !== "pro" &&
      planSlug !== "business"
    ) {
      throw new Error(
        "PADDLE_PLAN_NOT_SUPPORTED",
      );
    }

    const priceId =
      getPriceId(planSlug);

    const transaction =
      await getPaddleClient()
        .transactions
        .create({
          items: [
            {
              priceId,
              quantity: 1,
            },
          ],
          customData: {
            web_empire_user_id:
              userId,
            web_empire_plan_id:
              String(plan.id),
            web_empire_plan_slug:
              planSlug,
            web_empire_locale:
              body.locale,
            web_empire_monthly_credits:
              Number(
                plan.monthly_credits,
              ),
            source:
              "webempire_authenticated_checkout",
          },
        });

    if (
      !transaction.id?.startsWith(
        "txn_",
      )
    ) {
      throw new Error(
        "PADDLE_TRANSACTION_ID_MISSING",
      );
    }

    return NextResponse.json({
      transactionId:
        transaction.id,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "PADDLE_TRANSACTION_FAILED";

    console.error(
      "PADDLE_TRANSACTION_FAILED",
      {
        message,
      },
    );

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}
