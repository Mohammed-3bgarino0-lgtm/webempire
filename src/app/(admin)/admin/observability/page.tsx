import Link from "next/link";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOUR_MS = 60 * 60 * 1000;
const STALE_RUN_MINUTES = 15;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("ar-SA", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    timeZone: "Asia/Riyadh",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function sumBy<T>(
  rows: T[],
  selector: (row: T) => number,
) {
  return rows.reduce(
    (total, row) => total + selector(row),
    0,
  );
}

function relationValue(
  value: unknown,
  key: "title_ar" | "name",
) {
  const record = Array.isArray(value)
    ? value[0]
    : value;

  if (
    !record ||
    typeof record !== "object"
  ) {
    return "—";
  }

  const result =
    (record as Record<string, unknown>)[key];

  return typeof result === "string" &&
    result.trim()
    ? result
    : "—";
}

export default async function ObservabilityPage() {
  const supabase =
    createSupabaseAdminClient();

  // The observability window is intentionally calculated at request time.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const since24Hours =
    new Date(
      now - 24 * HOUR_MS,
    ).toISOString();

  const since7Days =
    new Date(
      now - 7 * 24 * HOUR_MS,
    ).toISOString();

  const staleThreshold =
    new Date(
      now -
        STALE_RUN_MINUTES *
          60 *
          1000,
    ).toISOString();

  const [
    runs24Result,
    runs7Result,
    usage24Result,
    usage7Result,
    failuresResult,
  ] = await Promise.all([
    supabase
      .from("tool_runs")
      .select(`
        id,
        status,
        input_tokens,
        output_tokens,
        cached_input_tokens,
        credits_reserved,
        credits_charged,
        error_message,
        created_at,
        tool_id,
        provider_id,
        model_id
      `)
      .gte("created_at", since24Hours)
      .order("created_at", {
        ascending: false,
      })
      .limit(5000),

    supabase
      .from("tool_runs")
      .select(`
        id,
        status,
        credits_charged,
        created_at
      `)
      .gte("created_at", since7Days)
      .limit(5000),

    supabase
      .from("provider_usage")
      .select(`
        id,
        tool_run_id,
        input_tokens,
        output_tokens,
        cached_input_tokens,
        estimated_cost_usd,
        created_at
      `)
      .gte("created_at", since24Hours)
      .limit(5000),

    supabase
      .from("provider_usage")
      .select(`
        id,
        input_tokens,
        output_tokens,
        cached_input_tokens,
        estimated_cost_usd,
        created_at
      `)
      .gte("created_at", since7Days)
      .limit(5000),

    supabase
      .from("tool_runs")
      .select(`
        id,
        status,
        error_message,
        input_tokens,
        output_tokens,
        credits_charged,
        created_at,
        tools(title_ar),
        ai_providers(name),
        ai_models(name)
      `)
      .eq("status", "failed")
      .order("created_at", {
        ascending: false,
      })
      .limit(20),
  ]);

  const runs24 =
    runs24Result.data ?? [];

  const runs7 =
    runs7Result.data ?? [];

  const usage24 =
    usage24Result.data ?? [];

  const usage7 =
    usage7Result.data ?? [];

  const failures =
    failuresResult.data ?? [];

  const runIds24 =
    runs24.map((run) => run.id);

  const reservationsResult =
    runIds24.length > 0
      ? await supabase
          .from("credit_reservations")
          .select(`
            tool_run_id,
            reserved_amount,
            actual_amount,
            status
          `)
          .in("tool_run_id", runIds24)
      : {
          data: [],
          error: null,
        };

  const reservations =
    reservationsResult.data ?? [];

  const completed24 =
    runs24.filter(
      (run) =>
        run.status === "completed",
    ).length;

  const failed24 =
    runs24.filter(
      (run) =>
        run.status === "failed",
    ).length;

  const pending24 =
    runs24.filter(
      (run) =>
        ![
          "completed",
          "failed",
        ].includes(run.status),
    ).length;

  const finalized24 =
    completed24 + failed24;

  const successRate24 =
    finalized24 > 0
      ? (completed24 /
          finalized24) *
        100
      : null;

  const completed7 =
    runs7.filter(
      (run) =>
        run.status === "completed",
    ).length;

  const failed7 =
    runs7.filter(
      (run) =>
        run.status === "failed",
    ).length;

  const finalized7 =
    completed7 + failed7;

  const successRate7 =
    finalized7 > 0
      ? (completed7 /
          finalized7) *
        100
      : null;

  const staleRuns =
    runs24.filter(
      (run) =>
        ![
          "completed",
          "failed",
        ].includes(run.status) &&
        run.created_at <
          staleThreshold,
    );

  const inputTokens24 =
    sumBy(
      usage24,
      (row) =>
        Number(
          row.input_tokens ?? 0,
        ),
    );

  const outputTokens24 =
    sumBy(
      usage24,
      (row) =>
        Number(
          row.output_tokens ?? 0,
        ),
    );

  const cachedTokens24 =
    sumBy(
      usage24,
      (row) =>
        Number(
          row.cached_input_tokens ??
            0,
        ),
    );

  const totalTokens24 =
    inputTokens24 +
    outputTokens24 +
    cachedTokens24;

  const totalTokens7 =
    sumBy(
      usage7,
      (row) =>
        Number(
          row.input_tokens ?? 0,
        ) +
        Number(
          row.output_tokens ?? 0,
        ) +
        Number(
          row.cached_input_tokens ??
            0,
        ),
    );

  const providerCost24 =
    sumBy(
      usage24,
      (row) =>
        Number(
          row.estimated_cost_usd ??
            0,
        ),
    );

  const providerCost7 =
    sumBy(
      usage7,
      (row) =>
        Number(
          row.estimated_cost_usd ??
            0,
        ),
    );

  const creditsCharged24 =
    sumBy(
      runs24,
      (row) =>
        Number(
          row.credits_charged ?? 0,
        ),
    );

  const creditsCharged7 =
    sumBy(
      runs7,
      (row) =>
        Number(
          row.credits_charged ?? 0,
        ),
    );

  const creditsReserved24 =
    sumBy(
      reservations,
      (row) =>
        Number(
          row.reserved_amount ?? 0,
        ),
    );

  const reservationActual24 =
    sumBy(
      reservations,
      (row) =>
        Number(
          row.actual_amount ?? 0,
        ),
    );

  const pendingReservations =
    reservations.filter(
      (row) =>
        ![
          "settled",
          "released",
        ].includes(row.status),
    );

  const reconciliationDelta =
    reservationActual24 -
    creditsCharged24;

  const reconciliationHealthy =
    Math.abs(
      reconciliationDelta,
    ) < 0.0001 &&
    pendingReservations.length === 0;

  const queryErrors = [
    runs24Result.error,
    runs7Result.error,
    usage24Result.error,
    usage7Result.error,
    failuresResult.error,
    reservationsResult.error,
  ].filter(Boolean);

  const systemHealthy =
    queryErrors.length === 0 &&
    staleRuns.length === 0 &&
    reconciliationHealthy;

  const metrics = [
    {
      label: "تشغيلات 24 ساعة",
      value: formatNumber(
        runs24.length,
      ),
      helper: `${completed24} مكتملة · ${failed24} فاشلة`,
      tone: "blue",
    },
    {
      label: "نسبة النجاح",
      value: formatPercent(
        successRate24,
      ),
      helper:
        "من التشغيلات النهائية خلال 24 ساعة",
      tone:
        (successRate24 ?? 100) >=
        95
          ? "green"
          : "orange",
    },
    {
      label: "التشغيلات العالقة",
      value: formatNumber(
        staleRuns.length,
      ),
      helper: `أكثر من ${STALE_RUN_MINUTES} دقيقة`,
      tone:
        staleRuns.length === 0
          ? "green"
          : "red",
    },
    {
      label: "توكنات 24 ساعة",
      value: formatNumber(
        totalTokens24,
      ),
      helper: `${formatNumber(
        inputTokens24,
      )} إدخال · ${formatNumber(
        outputTokens24,
      )} إخراج`,
      tone: "indigo",
    },
    {
      label: "تكلفة المزود",
      value: formatUsd(
        providerCost24,
      ),
      helper:
        "التكلفة التقديرية خلال 24 ساعة",
      tone: "cyan",
    },
    {
      label: "النقاط المخصومة",
      value: formatNumber(
        creditsCharged24,
      ),
      helper:
        "إجمالي النقاط خلال 24 ساعة",
      tone: "blue",
    },
    {
      label: "حجوزات معلقة",
      value: formatNumber(
        pendingReservations.length,
      ),
      helper:
        reconciliationHealthy
          ? "التسوية المالية متطابقة"
          : "تحتاج مراجعة",
      tone:
        reconciliationHealthy
          ? "green"
          : "red",
    },
    {
      label: "أخطاء الاستعلام",
      value: formatNumber(
        queryErrors.length,
      ),
      helper:
        queryErrors.length === 0
          ? "جميع مصادر البيانات متصلة"
          : "مصدر بيانات غير متاح",
      tone:
        queryErrors.length === 0
          ? "green"
          : "red",
    },
  ];

  return (
    <div className="admin-observability-page">
      <section className="admin-page-hero admin-observability-hero">
        <div>
          <p className="admin-eyebrow">
            PRODUCTION OBSERVABILITY
          </p>

          <h1>
            مراقبة الإنتاج والاستقرار
          </h1>

          <p>
            متابعة التشغيلات والتوكنات
            وتكلفة المزود وتسوية النقاط
            والأخطاء التشغيلية.
          </p>
        </div>

        <div className="admin-observability-actions">
          <span
            className={`admin-observability-health ${
              systemHealthy
                ? "is-healthy"
                : "is-degraded"
            }`}
          >
            <i aria-hidden="true" />

            {systemHealthy
              ? "النظام مستقر"
              : "النظام يحتاج مراجعة"}
          </span>

          <Link
            href="/admin/runs"
            className="admin-observability-link"
          >
            جميع التشغيلات
          </Link>

          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="admin-observability-link"
          >
            Health API
          </a>
        </div>
      </section>

      <section className="admin-observability-metrics">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className={`admin-observability-metric is-${metric.tone}`}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.helper}</small>
          </article>
        ))}
      </section>

      <section className="admin-observability-grid">
        <article className="admin-table-card">
          <div className="admin-observability-card-head">
            <div>
              <h2>مقارنة الفترات</h2>
              <p>
                الأداء خلال آخر 24 ساعة
                وآخر 7 أيام.
              </p>
            </div>
          </div>

          <div className="admin-table-scroll">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>المؤشر</th>
                  <th>24 ساعة</th>
                  <th>7 أيام</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>إجمالي التشغيلات</td>
                  <td>{formatNumber(runs24.length)}</td>
                  <td>{formatNumber(runs7.length)}</td>
                </tr>

                <tr>
                  <td>المكتملة</td>
                  <td>{formatNumber(completed24)}</td>
                  <td>{formatNumber(completed7)}</td>
                </tr>

                <tr>
                  <td>الفاشلة</td>
                  <td>{formatNumber(failed24)}</td>
                  <td>{formatNumber(failed7)}</td>
                </tr>

                <tr>
                  <td>نسبة النجاح</td>
                  <td>{formatPercent(successRate24)}</td>
                  <td>{formatPercent(successRate7)}</td>
                </tr>

                <tr>
                  <td>استهلاك التوكنات</td>
                  <td>{formatNumber(totalTokens24)}</td>
                  <td>{formatNumber(totalTokens7)}</td>
                </tr>

                <tr>
                  <td>تكلفة المزود</td>
                  <td>{formatUsd(providerCost24)}</td>
                  <td>{formatUsd(providerCost7)}</td>
                </tr>

                <tr>
                  <td>النقاط المخصومة</td>
                  <td>{formatNumber(creditsCharged24)}</td>
                  <td>{formatNumber(creditsCharged7)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-table-card">
          <div className="admin-observability-card-head">
            <div>
              <h2>تسوية النقاط</h2>
              <p>
                مطابقة الحجوزات مع الخصم
                الفعلي خلال 24 ساعة.
              </p>
            </div>

            <span
              className={`admin-observability-status ${
                reconciliationHealthy
                  ? "is-success"
                  : "is-failed"
              }`}
            >
              {reconciliationHealthy
                ? "متطابقة"
                : "غير متطابقة"}
            </span>
          </div>

          <dl className="admin-observability-reconciliation">
            <div>
              <dt>النقاط المحجوزة</dt>
              <dd>{formatNumber(creditsReserved24)}</dd>
            </div>

            <div>
              <dt>القيمة الفعلية</dt>
              <dd>{formatNumber(reservationActual24)}</dd>
            </div>

            <div>
              <dt>النقاط المخصومة</dt>
              <dd>{formatNumber(creditsCharged24)}</dd>
            </div>

            <div>
              <dt>فرق التسوية</dt>
              <dd>{formatNumber(reconciliationDelta)}</dd>
            </div>

            <div>
              <dt>عمليات معلقة</dt>
              <dd>{formatNumber(pending24)}</dd>
            </div>

            <div>
              <dt>حجوزات معلقة</dt>
              <dd>
                {formatNumber(
                  pendingReservations.length,
                )}
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="admin-table-card">
        <div className="admin-observability-card-head">
          <div>
            <h2>آخر أخطاء التشغيل</h2>
            <p>
              آخر 20 تشغيلًا فاشلًا دون عرض
              مدخلات المستخدم أو المخرجات.
            </p>
          </div>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>الأداة</th>
                <th>المزود</th>
                <th>النموذج</th>
                <th>التوكنات</th>
                <th>النقاط</th>
                <th>الخطأ</th>
                <th>الوقت</th>
              </tr>
            </thead>

            <tbody>
              {failures.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="admin-empty-state">
                      <strong>
                        لا توجد تشغيلات فاشلة
                      </strong>
                    </div>
                  </td>
                </tr>
              ) : (
                failures.map((run) => (
                  <tr key={run.id}>
                    <td>
                      {relationValue(
                        run.tools,
                        "title_ar",
                      )}
                    </td>

                    <td>
                      {relationValue(
                        run.ai_providers,
                        "name",
                      )}
                    </td>

                    <td>
                      {relationValue(
                        run.ai_models,
                        "name",
                      )}
                    </td>

                    <td dir="ltr">
                      {formatNumber(
                        Number(
                          run.input_tokens ?? 0,
                        ) +
                          Number(
                            run.output_tokens ?? 0,
                          ),
                      )}
                    </td>

                    <td>
                      {formatNumber(
                        Number(
                          run.credits_charged ??
                            0,
                        ),
                      )}
                    </td>

                    <td
                      className="admin-observability-error"
                      title={
                        run.error_message ?? ""
                      }
                    >
                      {run.error_message
                        ? run.error_message.slice(
                            0,
                            120,
                          )
                        : "—"}
                    </td>

                    <td>
                      {formatDate(
                        run.created_at,
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
