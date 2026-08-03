"use client";

import {
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";
import { useState } from "react";

let paddlePromise:
  | Promise<Paddle | undefined>
  | null = null;

function getPaddle(
  clientToken: string,
) {
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      token: clientToken,
      environment: "sandbox",
    });
  }

  return paddlePromise;
}

type Props = {
  clientToken: string;
  priceId: string;
  planSlug: "pro" | "business";
  planName: string;
  amountLabel: string;
};

export function PaddleSandboxCheckout({
  clientToken,
  priceId,
  planSlug,
  planName,
  amountLabel,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  async function openCheckout() {
    setLoading(true);
    setMessage(null);

    try {
      if (
        !clientToken.startsWith("test_")
      ) {
        throw new Error(
          "PADDLE_SANDBOX_TOKEN_INVALID",
        );
      }

      if (!priceId.startsWith("pri_")) {
        throw new Error(
          "PADDLE_PRICE_ID_INVALID",
        );
      }

      const paddle =
        await getPaddle(clientToken);

      if (!paddle) {
        throw new Error(
          "PADDLE_INITIALIZATION_FAILED",
        );
      }

      paddle.Checkout.open({
        items: [
          {
            priceId,
            quantity: 1,
          },
        ],
        customData: {
          plan_slug: planSlug,
          source:
            "webempire_admin_sandbox",
        },
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          theme: "light",
          locale: "ar",
          showAddDiscounts: false,
          successUrl:
            `${window.location.origin}` +
            "/admin/billing" +
            "?paddle_checkout=completed",
        },
      });

      setMessage(
        "تم فتح Paddle Sandbox Checkout.",
      );
    } catch (error) {
      const text =
        error instanceof Error
          ? error.message
          : "PADDLE_CHECKOUT_FAILED";

      setMessage(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="panel">
      <div className="eyebrow">
        PADDLE SANDBOX
      </div>

      <h3>{planName}</h3>

      <p>
        {amountLabel} شهريًا — عملية
        تجريبية دون أموال حقيقية.
      </p>

      <button
        type="button"
        className="button button-primary"
        onClick={openCheckout}
        disabled={loading}
      >
        {loading
          ? "جارٍ التحميل..."
          : "فتح الدفع التجريبي"}
      </button>

      {message ? (
        <small
          style={{
            display: "block",
            marginTop: 12,
          }}
        >
          {message}
        </small>
      ) : null}
    </article>
  );
}
