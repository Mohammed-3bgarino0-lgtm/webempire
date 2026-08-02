import Link from "next/link";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  PRODUCT_CORE_VERSION,
  PRODUCT_DESIGN_VERSION,
  formatProductVersion,
} from "@/lib/product-version";

export const dynamic = "force-dynamic";

const RIYADH_TIME_ZONE = "Asia/Riyadh";
const RIYADH_OFFSET = "+03:00";

function getRiyadhDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: RIYADH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function getRiyadhStartOfDayIso(dateKey: string) {
  return `${dateKey}T00:00:00${RIYADH_OFFSET}`;
}

function getRecentRiyadhDateKeys(days: number) {
  const todayKey = getRiyadhDateKey();
  const todayStart = new Date(getRiyadhStartOfDayIso(todayKey));
  const keys: string[] = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const current = new Date(todayStart);
    current.setUTCDate(current.getUTCDate() - index);
    keys.push(getRiyadhDateKey(current));
  }

  return keys;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

function formatActivityTime(value: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    timeZone: RIYADH_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: string | null) {
  switch (status) {
    case "completed":
      return "مكتمل";
    case "failed":
      return "فشل";
    case "processing":
      return "قيد التنفيذ";
    case "queued":
      return "في الانتظار";
    default:
      return status || "غير معروف";
  }
}

function getStatusClass(status: string | null) {
  if (status === "completed") return "is-success";
  if (status === "failed") return "is-failed";
  return "is-pending";
}

export default async function AdminPage() {
  const supabase = createSupabaseAdminClient();
  const todayDateKey = getRiyadhDateKey();
  const todayLowerBoundIso = getRiyadhStartOfDayIso(todayDateKey);
  const recentDateKeys = getRecentRiyadhDateKeys(7);
  const recentLowerBoundIso = getRiyadhStartOfDayIso(
    recentDateKeys[0] ?? todayDateKey,
  );

  const [
    activeToolsResult,
    usersResult,
    todayRunsResult,
    todayProviderUsageResult,
    recentRunsResult,
    recentProviderUsageResult,
    latestRunsResult,
  ] = await Promise.all([
    supabase
      .from("tools")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("tool_runs")
      .select("id, status, credits_charged, created_at, user_id")
      .gte("created_at", todayLowerBoundIso)
      .limit(5000),
    supabase
      .from("provider_usage")
      .select("id, estimated_cost_usd, created_at")
      .gte("created_at", todayLowerBoundIso)
      .limit(5000),
    supabase
      .from("tool_runs")
      .select(
        "id, status, created_at, tool_id, credits_charged, user_id, tools(title_ar, engine_type)",
      )
      .gte("created_at", recentLowerBoundIso)
      .limit(5000),
    supabase
      .from("provider_usage")
      .select("id, estimated_cost_usd, created_at")
      .gte("created_at", recentLowerBoundIso)
      .limit(5000),
    supabase
      .from("tool_runs")
      .select(
        "id, status, credits_charged, created_at, tools(title_ar, engine_type), user_id",
      )
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const activeToolsAvailable = !activeToolsResult.error;
  const usersAvailable = !usersResult.error;
  const runsTodayAvailable = !todayRunsResult.error;
  const aiUsageTodayAvailable = !todayProviderUsageResult.error;
  const recentRunsAvailable = !recentRunsResult.error;
  const recentAiUsageAvailable = !recentProviderUsageResult.error;
  const latestRunsAvailable = !latestRunsResult.error;

  const todayRunRows = runsTodayAvailable ? todayRunsResult.data ?? [] : [];
  const todayProviderUsage = aiUsageTodayAvailable
    ? todayProviderUsageResult.data ?? []
    : [];
  const recentRuns = recentRunsAvailable ? recentRunsResult.data ?? [] : [];
  const recentProviderUsage = recentAiUsageAvailable
    ? recentProviderUsageResult.data ?? []
    : [];
  const latestRuns = latestRunsAvailable ? latestRunsResult.data ?? [] : [];

  const latestUserIds = Array.from(
    new Set(
      latestRuns
        .map((run) => run.user_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const profileRowsResult = latestUserIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", latestUserIds)
    : {
        data: [] as Array<{ id: string; display_name: string | null }>,
        error: null,
      };

  const profileMap = new Map(
    (profileRowsResult.data ?? []).map((profile) => [
      profile.id,
      profile.display_name,
    ]),
  );

  const activeToolsCount = activeToolsAvailable
    ? activeToolsResult.count ?? 0
    : 0;
  const usersCount = usersAvailable ? usersResult.count ?? 0 : 0;

  const runsTodayCount = todayRunRows.length;
  const completedToday = todayRunRows.filter(
    (run) => run.status === "completed",
  ).length;
  const failedToday = todayRunRows.filter(
    (run) => run.status === "failed",
  ).length;
  const finalizedToday = completedToday + failedToday;
  const successRateToday =
    finalizedToday > 0 ? (completedToday / finalizedToday) * 100 : 0;

  const creditsConsumedToday = todayRunRows.reduce(
    (sum, row) => sum + Number(row.credits_charged ?? 0),
    0,
  );
  const aiRequestsToday = todayProviderUsage.length;
  const estimatedAiCostToday = todayProviderUsage.reduce(
    (sum, row) => sum + Number(row.estimated_cost_usd ?? 0),
    0,
  );

  const totalRecentRuns = recentRuns.length;
  const completedRecentRuns = recentRuns.filter(
    (run) => run.status === "completed",
  ).length;
  const failedRecentRuns = recentRuns.filter(
    (run) => run.status === "failed",
  ).length;
  const finalizedRecentRuns = completedRecentRuns + failedRecentRuns;
  const successRateRecent =
    finalizedRecentRuns > 0
      ? (completedRecentRuns / finalizedRecentRuns) * 100
      : 0;
  const activeUsersRecent = new Set(
    recentRuns
      .map((run) => run.user_id)
      .filter((value): value is string => Boolean(value)),
  ).size;
  const creditsConsumedRecent = recentRuns.reduce(
    (sum, row) => sum + Number(row.credits_charged ?? 0),
    0,
  );
  const estimatedAiCostRecent = recentProviderUsage.reduce(
    (sum, row) => sum + Number(row.estimated_cost_usd ?? 0),
    0,
  );

  const averageCostPerRequest =
    recentProviderUsage.length > 0
      ? estimatedAiCostRecent / recentProviderUsage.length
      : 0;

  const runsByDayMap = new Map<
    string,
    { total: number; completed: number; failed: number }
  >();

  for (const dayKey of recentDateKeys) {
    runsByDayMap.set(dayKey, { total: 0, completed: 0, failed: 0 });
  }

  for (const run of recentRuns) {
    const key = getRiyadhDateKey(new Date(run.created_at));
    const current = runsByDayMap.get(key);

    if (!current) continue;

    current.total += 1;
    if (run.status === "completed") current.completed += 1;
    if (run.status === "failed") current.failed += 1;
  }

  const runsByDay = recentDateKeys.map((day) => ({
    day,
    ...(runsByDayMap.get(day) ?? {
      total: 0,
      completed: 0,
      failed: 0,
    }),
  }));
  const maxRunsByDay = Math.max(1, ...runsByDay.map((item) => item.total));

  const topToolsMap = new Map<string, number>();

  for (const run of recentRuns) {
    const toolRef = Array.isArray(run.tools) ? run.tools[0] : run.tools;
    const title = toolRef?.title_ar ?? "أداة غير معروفة";
    topToolsMap.set(title, (topToolsMap.get(title) ?? 0) + 1);
  }

  const topTools = Array.from(topToolsMap.entries())
    .map(([name, runs]) => ({ name, runs }))
    .sort((first, second) => second.runs - first.runs)
    .slice(0, 5);

  const maxTopToolRuns = Math.max(1, ...topTools.map((item) => item.runs));

  const healthSources = [
    { label: "قاعدة بيانات الأدوات", healthy: activeToolsAvailable },
    { label: "حسابات المستخدمين", healthy: usersAvailable },
    { label: "سجل عمليات التشغيل", healthy: recentRunsAvailable },
    { label: "قياس استخدام الذكاء الاصطناعي", healthy: recentAiUsageAvailable },
  ];

  const allHealthy = healthSources.every((source) => source.healthy);
  const productVersion = activeToolsAvailable
    ? formatProductVersion(activeToolsCount)
    : "VERSION UNAVAILABLE";

  const metrics = [
    {
      label: "إجمالي المستخدمين",
      value: usersAvailable ? formatNumber(usersCount) : "—",
      helper: "جميع الحسابات المسجلة",
      icon: "م",
      tone: "blue",
    },
    {
      label: "الأدوات النشطة",
      value: activeToolsAvailable ? formatNumber(activeToolsCount) : "—",
      helper: "متاحة للمستخدمين الآن",
      icon: "أ",
      tone: "cyan",
    },
    {
      label: "تشغيلات اليوم",
      value: runsTodayAvailable ? formatNumber(runsTodayCount) : "—",
      helper: `${formatNumber(completedToday)} مكتملة · ${formatNumber(failedToday)} فاشلة`,
      icon: "ت",
      tone: "indigo",
    },
    {
      label: "نسبة نجاح اليوم",
      value:
        runsTodayAvailable && finalizedToday > 0
          ? formatPercent(successRateToday)
          : "—",
      helper: "من العمليات المكتملة والفاشلة",
      icon: "ن",
      tone: successRateToday >= 95 ? "green" : "orange",
    },
    {
      label: "مستخدمون نشطون",
      value: recentRunsAvailable ? formatNumber(activeUsersRecent) : "—",
      helper: "شغّلوا أدوات خلال 7 أيام",
      icon: "ش",
      tone: "blue",
    },
    {
      label: "النقاط المستهلكة",
      value: runsTodayAvailable
        ? formatNumber(creditsConsumedToday)
        : "—",
      helper: "إجمالي استهلاك اليوم",
      icon: "ق",
      tone: "cyan",
    },
    {
      label: "طلبات AI اليوم",
      value: aiUsageTodayAvailable
        ? formatNumber(aiRequestsToday)
        : "—",
      helper: "طلبات مسجلة لدى المزودين",
      icon: "AI",
      tone: "indigo",
    },
    {
      label: "تكلفة AI اليوم",
      value: aiUsageTodayAvailable
        ? formatUsd(estimatedAiCostToday)
        : "—",
      helper: "تكلفة تقديرية مباشرة",
      icon: "$",
      tone: "green",
    },
  ];

  return (
    <div className="adminv4-dashboard">
      <section className="adminv4-overview">
        <div className="adminv4-overview-copy">
          <span className="adminv4-eyebrow">مركز العمليات</span>
          <h2>نظرة تنفيذية على إمبراطورية الويب</h2>
          <p>
            مؤشرات تشغيل مباشرة للمستخدمين والأدوات واستهلاك النقاط ومزودي
            الذكاء الاصطناعي، محسوبة بتوقيت الرياض.
          </p>
        </div>

        <div className="adminv4-overview-actions">
          <span
            className={`adminv4-health-badge ${
              allHealthy ? "is-healthy" : "is-warning"
            }`}
          >
            <i aria-hidden="true" />
            {allHealthy
              ? "جميع مصادر البيانات متصلة"
              : "بعض مصادر البيانات تحتاج مراجعة"}
          </span>
          <Link href="/admin/runs" className="adminv4-action-secondary">
            مراقبة التشغيلات
          </Link>
          <Link href="/admin/tools/new" className="adminv4-action-primary">
            + إضافة أداة
          </Link>
        </div>
      </section>

      <section className="adminv4-kpi-grid" aria-label="المؤشرات الرئيسية">
        {metrics.map((metric) => (
          <article
            className="adminv4-kpi-card"
            data-tone={metric.tone}
            key={metric.label}
          >
            <div className="adminv4-kpi-head">
              <span>{metric.label}</span>
              <span className="adminv4-kpi-icon">{metric.icon}</span>
            </div>
            <strong>{metric.value}</strong>
            <small>{metric.helper}</small>
          </article>
        ))}
      </section>

      <section className="adminv4-primary-grid">
        <article className="adminv4-card adminv4-chart-card">
          <header className="adminv4-card-header">
            <div>
              <span className="adminv4-card-kicker">الأداء التشغيلي</span>
              <h3>نشاط آخر 7 أيام</h3>
              <p>إجمالي التشغيلات مع توضيح الناجح والفاشل لكل يوم.</p>
            </div>
            <div className="adminv4-summary-pills">
              <span>
                <b>{formatNumber(totalRecentRuns)}</b>
                تشغيل
              </span>
              <span>
                <b>{formatPercent(successRateRecent)}</b>
                نجاح
              </span>
            </div>
          </header>

          <div className="adminv4-chart-legend">
            <span className="is-total">إجمالي التشغيلات</span>
            <span className="is-success">مكتمل</span>
            <span className="is-failed">فشل</span>
          </div>

          <div className="adminv4-chart">
            {runsByDay.map((item) => {
              const height = Math.max(
                item.total > 0 ? 10 : 3,
                (item.total / maxRunsByDay) * 100,
              );
              const completedShare =
                item.total > 0 ? (item.completed / item.total) * 100 : 0;
              const failedShare =
                item.total > 0 ? (item.failed / item.total) * 100 : 0;

              return (
                <div className="adminv4-chart-column" key={item.day}>
                  <strong>{item.total}</strong>
                  <div className="adminv4-chart-track">
                    <div
                      className="adminv4-chart-stack"
                      style={{ height: `${height}%` }}
                      title={`${item.completed} مكتمل · ${item.failed} فشل`}
                    >
                      <span
                        className="is-success"
                        style={{ height: `${completedShare}%` }}
                      />
                      <span
                        className="is-failed"
                        style={{ height: `${failedShare}%` }}
                      />
                    </div>
                  </div>
                  <time>{item.day.slice(5)}</time>
                </div>
              );
            })}
          </div>
        </article>

        <article className="adminv4-card adminv4-live-card">
          <header className="adminv4-card-header">
            <div>
              <span className="adminv4-card-kicker">مباشر</span>
              <h3>آخر عمليات التشغيل</h3>
              <p>أحدث النشاطات المسجلة على المنصة.</p>
            </div>
            <Link href="/admin/runs" className="adminv4-text-link">
              عرض الكل
            </Link>
          </header>

          <div className="adminv4-activity-list">
            {!latestRunsAvailable ? (
              <div className="adminv4-empty">
                تعذر قراءة أحدث عمليات التشغيل.
              </div>
            ) : latestRuns.length ? (
              latestRuns.map((run) => {
                const toolRef = Array.isArray(run.tools)
                  ? run.tools[0]
                  : run.tools;
                const userDisplay = run.user_id
                  ? profileMap.get(run.user_id) ?? run.user_id.slice(0, 8)
                  : "مستخدم غير معروف";

                return (
                  <div className="adminv4-activity-item" key={run.id}>
                    <span
                      className={`adminv4-activity-status ${getStatusClass(
                        run.status,
                      )}`}
                    >
                      {run.status === "completed"
                        ? "✓"
                        : run.status === "failed"
                          ? "!"
                          : "•"}
                    </span>
                    <span className="adminv4-activity-copy">
                      <strong>{toolRef?.title_ar ?? "تشغيل أداة"}</strong>
                      <small>{userDisplay}</small>
                    </span>
                    <span
                      className={`adminv4-status-pill ${getStatusClass(
                        run.status,
                      )}`}
                    >
                      {getStatusLabel(run.status)}
                    </span>
                    <time>{formatActivityTime(run.created_at)}</time>
                  </div>
                );
              })
            ) : (
              <div className="adminv4-empty">
                لا توجد عمليات تشغيل حديثة حتى الآن.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="adminv4-secondary-grid">
        <article className="adminv4-card">
          <header className="adminv4-card-header">
            <div>
              <span className="adminv4-card-kicker">آخر 7 أيام</span>
              <h3>كفاءة التشغيل</h3>
              <p>ملخص الاستهلاك والنجاح والتكلفة.</p>
            </div>
          </header>

          <div className="adminv4-efficiency-list">
            <div>
              <span>نسبة النجاح</span>
              <strong>{formatPercent(successRateRecent)}</strong>
              <div className="adminv4-progress">
                <span style={{ width: `${Math.min(successRateRecent, 100)}%` }} />
              </div>
            </div>
            <div>
              <span>النقاط المستهلكة</span>
              <strong>{formatNumber(creditsConsumedRecent)}</strong>
            </div>
            <div>
              <span>طلبات مزودي AI</span>
              <strong>{formatNumber(recentProviderUsage.length)}</strong>
            </div>
            <div>
              <span>تكلفة AI التقديرية</span>
              <strong>{formatUsd(estimatedAiCostRecent)}</strong>
            </div>
            <div>
              <span>متوسط تكلفة الطلب</span>
              <strong>{formatUsd(averageCostPerRequest)}</strong>
            </div>
          </div>
        </article>

        <article className="adminv4-card">
          <header className="adminv4-card-header">
            <div>
              <span className="adminv4-card-kicker">الطلب</span>
              <h3>الأدوات الأكثر استخدامًا</h3>
              <p>ترتيب الأدوات حسب تشغيلات آخر 7 أيام.</p>
            </div>
            <Link href="/admin/tools" className="adminv4-text-link">
              إدارة الأدوات
            </Link>
          </header>

          <div className="adminv4-ranking">
            {topTools.length ? (
              topTools.map((tool, index) => (
                <div className="adminv4-ranking-row" key={tool.name}>
                  <span className="adminv4-rank-number">{index + 1}</span>
                  <span className="adminv4-rank-copy">
                    <strong>{tool.name}</strong>
                    <span className="adminv4-progress">
                      <span
                        style={{
                          width: `${(tool.runs / maxTopToolRuns) * 100}%`,
                        }}
                      />
                    </span>
                  </span>
                  <b>{formatNumber(tool.runs)}</b>
                </div>
              ))
            ) : (
              <div className="adminv4-empty">
                لا توجد بيانات استخدام كافية حتى الآن.
              </div>
            )}
          </div>
        </article>

        <article className="adminv4-card">
          <header className="adminv4-card-header">
            <div>
              <span className="adminv4-card-kicker">البنية التحتية</span>
              <h3>حالة النظام</h3>
              <p>فحص مباشر لمصادر البيانات الأساسية.</p>
            </div>
            <span
              className={`adminv4-mini-health ${
                allHealthy ? "is-healthy" : "is-warning"
              }`}
            >
              {allHealthy ? "سليم" : "يحتاج متابعة"}
            </span>
          </header>

          <div className="adminv4-health-list">
            {healthSources.map((source) => (
              <div className="adminv4-health-row" key={source.label}>
                <span>{source.label}</span>
                <strong className={source.healthy ? "is-online" : "is-offline"}>
                  <i aria-hidden="true" />
                  {source.healthy ? "متصل" : "غير متاح"}
                </strong>
              </div>
            ))}
            <div className="adminv4-health-row">
              <span>العمليات الفاشلة — 7 أيام</span>
              <strong className={failedRecentRuns === 0 ? "is-online" : ""}>
                {formatNumber(failedRecentRuns)}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section className="adminv4-footer-grid">
        <article className="adminv4-card adminv4-quick-card">
          <header className="adminv4-card-header">
            <div>
              <span className="adminv4-card-kicker">اختصارات</span>
              <h3>إجراءات سريعة</h3>
            </div>
          </header>

          <div className="adminv4-quick-actions">
            <Link href="/admin/users">
              <span>01</span>
              إدارة المستخدمين
            </Link>
            <Link href="/admin/tools/new">
              <span>02</span>
              إضافة أداة
            </Link>
            <Link href="/admin/providers">
              <span>03</span>
              مزودو الذكاء الاصطناعي
            </Link>
            <Link href="/admin/audit">
              <span>04</span>
              سجل الإجراءات
            </Link>
          </div>
        </article>

        <article className="adminv4-card adminv4-version-card">
          <div>
            <span className="adminv4-card-kicker">النظام</span>
            <h3>إصدار المنصة</h3>
            <strong>{productVersion}</strong>
            <p>
              Core {PRODUCT_CORE_VERSION} · Design {PRODUCT_DESIGN_VERSION}
            </p>
          </div>
          <Link href="/admin/audit" className="adminv4-action-secondary">
            مراجعة السجل
          </Link>
        </article>
      </section>
    </div>
  );
}
