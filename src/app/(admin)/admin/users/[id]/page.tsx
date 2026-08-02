import Link from "next/link";
import { notFound } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type UserRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  profile_status: "active" | "suspended" | "blocked";
  created_at: string;
  last_sign_in_at: string | null;
  balance: number;
  plan_slug: string | null;
  plan_name_ar: string | null;
  run_count: number;
  credits_consumed: number;
  total_count: number;
};

type RunRow = {
  id: string;
  status: string | null;
  credits_charged: number | null;
  created_at: string;
  tools:
    | { title_ar: string | null; engine_type: string | null }
    | Array<{ title_ar: string | null; engine_type: string | null }>
    | null;
};

const dateFormatter = new Intl.DateTimeFormat("ar-SA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Riyadh",
});

function formatDate(value: string | null | undefined) {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

function formatNumber(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString("ar-SA");
}

function statusLabel(status: UserRow["profile_status"]) {
  if (status === "suspended") return "موقوف";
  if (status === "blocked") return "محظور";
  return "نشط";
}

function runStatusLabel(status: string | null) {
  if (status === "completed") return "مكتمل";
  if (status === "failed") return "فشل";
  if (status === "processing") return "قيد التنفيذ";
  if (status === "queued") return "في الانتظار";
  return status || "غير معروف";
}

function providerLabel(provider: string | undefined) {
  if (provider === "google") return "Google";
  if (provider === "azure") return "Microsoft";
  if (provider === "email") return "البريد وكلمة المرور";
  return provider || "غير محدد";
}

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const [listResult, runsResult, adminResult, authResult] = await Promise.all([
    supabase.rpc("admin_list_users", {
      p_search: id,
      p_status: null,
      p_plan: null,
      p_limit: 20,
      p_offset: 0,
    }),
    supabase
      .from("tool_runs")
      .select(
        "id, status, credits_charged, created_at, tools(title_ar, engine_type)",
      )
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("admin_users")
      .select("role, is_active")
      .eq("user_id", id)
      .maybeSingle(),
    supabase.auth.admin.getUserById(id),
  ]);

  if (listResult.error) throw new Error(listResult.error.message);
  if (runsResult.error) throw new Error(runsResult.error.message);

  const users = (listResult.data ?? []) as UserRow[];
  const user = users.find((item) => item.user_id === id);

  if (!user) notFound();

  const runs = (runsResult.data ?? []) as RunRow[];
  const authUser = authResult.data.user;
  const provider =
    authUser?.app_metadata?.provider ||
    authUser?.identities?.[0]?.provider ||
    undefined;
  const identity = user.display_name || user.email || user.user_id;
  const initial = identity.slice(0, 1).toUpperCase();

  const stats = [
    {
      label: "الرصيد الحالي",
      value: formatNumber(user.balance),
      helper: "نقطة متاحة",
      tone: "blue",
    },
    {
      label: "إجمالي التشغيلات",
      value: formatNumber(user.run_count),
      helper: "عملية مسجلة",
      tone: "indigo",
    },
    {
      label: "النقاط المستهلكة",
      value: formatNumber(user.credits_consumed),
      helper: "خلال عمر الحساب",
      tone: "cyan",
    },
    {
      label: "الباقة الحالية",
      value: user.plan_name_ar || "مجاني",
      helper: user.plan_slug || "free",
      tone: "green",
    },
  ];

  return (
    <div className="adminud-page">
      <section className="adminud-hero">
        <div className="adminud-user-heading">
          <span className="adminud-avatar">{initial}</span>
          <div>
            <Link href="/admin/users" className="adminud-back-link">
              ← العودة إلى المستخدمين
            </Link>
            <h1>{user.display_name || "بدون اسم"}</h1>
            <p dir="ltr">{user.email || user.user_id}</p>
          </div>
        </div>

        <div className="adminud-hero-status">
          <span className={`adminu-status is-${user.profile_status}`}>
            <i aria-hidden="true" />
            {statusLabel(user.profile_status)}
          </span>
          {adminResult.data ? (
            <span className="adminud-admin-badge">
              {adminResult.data.is_active ? "صلاحية إدارية نشطة" : "صلاحية إدارية معطلة"}
            </span>
          ) : null}
        </div>
      </section>

      <section className="adminud-stats-grid">
        {stats.map((stat) => (
          <article data-tone={stat.tone} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.helper}</small>
          </article>
        ))}
      </section>

      <section className="adminud-primary-grid">
        <article className="adminud-card">
          <header>
            <div>
              <span>معلومات الحساب</span>
              <h2>الهوية والتسجيل</h2>
            </div>
          </header>

          <dl className="adminud-details-list">
            <div>
              <dt>الاسم</dt>
              <dd>{user.display_name || "غير مسجل"}</dd>
            </div>
            <div>
              <dt>البريد الإلكتروني</dt>
              <dd dir="ltr">{user.email || "—"}</dd>
            </div>
            <div>
              <dt>معرّف المستخدم</dt>
              <dd dir="ltr">{user.user_id}</dd>
            </div>
            <div>
              <dt>طريقة التسجيل</dt>
              <dd>{providerLabel(provider)}</dd>
            </div>
            <div>
              <dt>تأكيد البريد</dt>
              <dd>{authUser?.email_confirmed_at ? "مؤكد" : "غير مؤكد"}</dd>
            </div>
            <div>
              <dt>تاريخ التسجيل</dt>
              <dd>{formatDate(user.created_at)}</dd>
            </div>
            <div>
              <dt>آخر دخول</dt>
              <dd>{formatDate(user.last_sign_in_at)}</dd>
            </div>
            <div>
              <dt>الباقة</dt>
              <dd>{user.plan_name_ar || "مجاني"}</dd>
            </div>
          </dl>
        </article>

        <article className="adminud-card">
          <header>
            <div>
              <span>الوصول الإداري</span>
              <h2>الصلاحيات</h2>
            </div>
          </header>

          {adminResult.data ? (
            <div className="adminud-role-panel">
              <span>الدور الإداري</span>
              <strong>{adminResult.data.role}</strong>
              <small>
                الحالة: {adminResult.data.is_active ? "نشطة" : "معطلة"}
              </small>
            </div>
          ) : (
            <div className="adminud-empty-panel">
              هذا الحساب مستخدم عادي ولا يملك صلاحيات إدارية.
            </div>
          )}

          <div className="adminud-note">
            تعديلات الرصيد والحالة والصلاحيات ستُفعّل في خطوة الإدارة الآمنة
            بعد ربطها بسجل الإجراءات.
          </div>
        </article>
      </section>

      <section className="adminud-card adminud-runs-card">
        <header>
          <div>
            <span>النشاط الأخير</span>
            <h2>عمليات التشغيل</h2>
            <p>آخر 12 عملية نفذها هذا المستخدم.</p>
          </div>
          <Link href={`/admin/runs?user=${user.user_id}`}>
            عرض سجل التشغيلات
          </Link>
        </header>

        <div className="adminud-runs-list">
          {runs.length ? (
            runs.map((run) => {
              const tool = Array.isArray(run.tools)
                ? run.tools[0]
                : run.tools;

              return (
                <div className="adminud-run-row" key={run.id}>
                  <span
                    className={`adminud-run-status is-${run.status ?? "unknown"}`}
                  >
                    {run.status === "completed"
                      ? "✓"
                      : run.status === "failed"
                        ? "!"
                        : "•"}
                  </span>
                  <div>
                    <strong>{tool?.title_ar || "تشغيل أداة"}</strong>
                    <small>{tool?.engine_type || "محرك غير محدد"}</small>
                  </div>
                  <span>{runStatusLabel(run.status)}</span>
                  <b>{formatNumber(run.credits_charged)} نقطة</b>
                  <time>{formatDate(run.created_at)}</time>
                </div>
              );
            })
          ) : (
            <div className="adminud-empty-panel">
              لا توجد عمليات تشغيل مسجلة لهذا المستخدم حتى الآن.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
