"use client";

import {
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";
import { useState } from "react";

let paddlePromise:
  | Promise<Paddle | undefined>
  | null = null;

function getPaddle(clientToken: string) {
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
  locale: "ar" | "en";
  featured?: boolean;
};

export function PaddlePricingButton({
  clientToken,
  priceId,
  planSlug,
  locale,
  featured = false,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function openCheckout() {
    setLoading(true);
    setError(null);

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
            "webempire_pricing_sandbox",
        },
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          theme: "light",
          locale,
          showAddDiscounts: false,
          successUrl:
            `${window.location.origin}` +
            `/${locale}/pricing` +
            "?paddle_checkout=completed",
        },
      });
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "PADDLE_CHECKOUT_FAILED",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`we-pricing-card-action ${
          featured
            ? "we-button-primary"
            : "we-button-ghost"
        }`}
        onClick={openCheckout}
        disabled={loading}
      >
        {loading
          ? locale === "ar"
            ? "جارٍ فتح الدفع..."
            : "Opening checkout..."
          : locale === "ar"
            ? "جرّب الدفع"
            : "Test checkout"}
      </button>

      {error ? (
        <small
          role="alert"
          style={{
            display: "block",
            marginTop: 8,
            color: "#b91c1c",
          }}
        >
          {error}
        </small>
      ) : null}
    </>
  );
}
