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
    paddlePromise =
      initializePaddle({
        token: clientToken,
        environment: "sandbox",
      });
  }

  return paddlePromise;
}

type Props = {
  clientToken: string;
  planId: string;
  locale: "ar" | "en";
  featured?: boolean;
};

type TransactionResponse = {
  transactionId?: string;
  error?: string;
};

export function PaddlePricingButton({
  clientToken,
  planId,
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
        !clientToken.startsWith(
          "test_",
        )
      ) {
        throw new Error(
          "PADDLE_SANDBOX_TOKEN_INVALID",
        );
      }

      const response = await fetch(
        "/api/billing/paddle/transaction",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            planId,
            locale,
          }),
        },
      );

      if (response.status === 401) {
        const pricingPath =
          `/${locale}/pricing`;

        const loginUrl =
          `/${locale}/auth/login` +
          `?next=${encodeURIComponent(
            pricingPath,
          )}`;

        window.location.assign(
          loginUrl,
        );

        return;
      }

      const payload =
        await response.json() as
          TransactionResponse;

      if (!response.ok) {
        throw new Error(
          payload.error ??
            "PADDLE_TRANSACTION_FAILED",
        );
      }

      if (
        !payload.transactionId
          ?.startsWith("txn_")
      ) {
        throw new Error(
          "PADDLE_TRANSACTION_ID_INVALID",
        );
      }

      const paddle =
        await getPaddle(
          clientToken,
        );

      if (!paddle) {
        throw new Error(
          "PADDLE_INITIALIZATION_FAILED",
        );
      }

      paddle.Checkout.open({
        transactionId:
          payload.transactionId,
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          theme: "light",
          locale,
          showAddDiscounts: false,
          successUrl:
            `${window.location.origin}` +
            `/${locale}/dashboard` +
            "?billing=paddle_success",
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
            ? "جارٍ تجهيز الدفع..."
            : "Preparing checkout..."
          : locale === "ar"
            ? "اشترك الآن"
            : "Subscribe now"}
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
