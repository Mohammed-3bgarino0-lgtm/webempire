import Link from "next/link";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  status?: string;
  plan?: string;
  page?: string;
};

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

const dateFormatter = new Intl.DateTimeFormat("ar-SA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Riyadh",
});

function formatDate(value: string | null) {
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

function buildUsersHref(
  query: SearchParams,
  overrides: Partial<SearchParams>,
) {
  const next = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (next.q) params.set("q", next.q);
  if (next.status) params.set("status", next.status);
  if (next.plan) params.set("plan", next.plan);
  if (next.page) params.set("page", next.page);

  const search = params.toString();
  return search ? `/admin/users?${search}` : "/admin/users";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const pageSize = 20;
  const supabase = createSupabaseAdminClient();

  const [usersResult, summaryResult, plansResult] = await Promise.all([
    supabase.rpc("admin_list_users", {
      p_search: query.q?.trim() || null,
      p_status: query.status?.trim() || null,
      p_plan: query.plan?.trim() || null,
      p_limit: pageSize,
      p_offset: (page - 1) * pageSize,
    }),
    supabase.rpc("admin_user_summary"),
    supabase.from("plans").select("slug, name_ar").order("sort_order"),
  ]);

  if (usersResult.error) throw new Error(usersResult.error.message);
  if (summaryResult.error) throw new Error(summaryResult.error.message);

  const users = (usersResult.data ?? []) as UserRow[];
  const summary = Array.isArray(summaryResult.data)
    ? summaryResult.data[0]
    : summaryResult.data;
  const total = Number(users[0]?.total_count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilterCount = [query.q, query.status, query.plan].filter(
    Boolean,
  ).length;

  const summaryCards = [
    {
      label: "إجمالي المستخدمين",
      value: formatNumber(summary?.total_users),
      helper: "جميع الحسابات المسجلة",
      tone: "blue",
      icon: "م",
    },
    {
      label: "الحسابات النشطة",
      value: formatNumber(summary?.active_users),
      helper: "متاحة لاستخدام المنصة",
      tone: "green",
      icon: "ن",
    },
    {
      label: "الحسابات الموقوفة",
      value: formatNumber(summary?.suspended_users),
      helper: "تحتاج مراجعة إدارية",
      tone: "orange",
      icon: "و",
    },
    {
      label: "إجمالي الأرصدة",
      value: formatNumber(summary?.total_credits),
      helper: "نقاط متاحة لدى المستخدمين",
      tone: "cyan",
      icon: "ق",
    },
    {
      label: "إجمالي التشغيلات",
      value: formatNumber(summary?.total_runs),
      helper: "كل عمليات الأدوات المسجلة",
      tone: "indigo",
      icon: "ت",
    },
  ];

  return (
    <div className="adminu-page">
      <section className="adminu-hero">
        <div>
          <span className="adminu-eyebrow">إدارة الحسابات</span>
          <h1>المستخدمون</h1>
          <p>
            استعرض الحسابات والأرصدة والباقات وسجل الاستخدام، وانتقل إلى
            ملف المستخدم لمراجعة التفاصيل والنشاطات.
          </p>
        </div>

        <div className="adminu-hero-actions">
          <span className="adminu-count-badge">
            {formatNumber(total)} مستخدم
          </span>
          <Link href="/admin/audit" className="adminu-secondary-button">
            سجل الإجراءات
          </Link>
        </div>
      </section>

      <section className="adminu-summary-grid" aria-label="ملخص المستخدمين">
        {summaryCards.map((card) => (
          <article
            className="adminu-summary-card"
            data-tone={card.tone}
            key={card.label}
          >
            <div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.helper}</small>
            </div>
            <span className="adminu-summary-icon">{card.icon}</span>
          </article>
        ))}
      </section>

      <section className="adminu-filter-card">
        <div className="adminu-filter-heading">
          <div>
            <h2>البحث والتصفية</h2>
            <p>ابحث بالاسم أو البريد أو المعرّف وحدد الحالة أو الباقة.</p>
          </div>
          {activeFilterCount > 0 ? (
            <span>{formatNumber(activeFilterCount)} عوامل تصفية نشطة</span>
          ) : (
            <span>عرض جميع الحسابات</span>
          )}
        </div>

        <form method="get" className="adminu-filters">
          <label className="adminu-search-field">
            <span>البحث</span>
            <input
              name="q"
              defaultValue={query.q ?? ""}
              placeholder="الاسم، البريد الإلكتروني أو المعرّف"
            />
          </label>

          <label>
            <span>الحالة</span>
            <select name="status" defaultValue={query.status ?? ""}>
              <option value="">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">موقوف</option>
              <option value="blocked">محظور</option>
            </select>
          </label>

          <label>
            <span>الباقة</span>
            <select name="plan" defaultValue={query.plan ?? ""}>
              <option value="">كل الباقات</option>
              {(plansResult.data ?? []).map((plan) => (
                <option key={plan.slug} value={plan.slug}>
                  {plan.name_ar}
                </option>
              ))}
            </select>
          </label>

          <button className="adminu-primary-button" type="submit">
            تطبيق التصفية
          </button>
          <Link className="adminu-secondary-button" href="/admin/users">
            مسح
          </Link>
        </form>

        {activeFilterCount > 0 ? (
          <div className="adminu-active-filters">
            {query.q ? (
              <Link href={buildUsersHref(query, { q: undefined, page: "1" })}>
                البحث: {query.q} ×
              </Link>
            ) : null}
            {query.status ? (
              <Link
                href={buildUsersHref(query, {
                  status: undefined,
                  page: "1",
                })}
              >
                الحالة: {statusLabel(query.status as UserRow["profile_status"])} ×
              </Link>
            ) : null}
            {query.plan ? (
              <Link
                href={buildUsersHref(query, {
                  plan: undefined,
                  page: "1",
                })}
              >
                الباقة: {query.plan} ×
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="adminu-table-card">
        <header className="adminu-table-heading">
          <div>
            <span className="adminu-eyebrow">دليل المستخدمين</span>
            <h2>الحسابات</h2>
            <p>
              صفحة {formatNumber(page)} من {formatNumber(totalPages)}
            </p>
          </div>

          <span className="adminu-results-count">
            {formatNumber(total)} نتيجة
          </span>
        </header>

        <div className="adminu-table-scroll">
          <table className="adminu-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>الحالة</th>
                <th>الباقة</th>
                <th>الرصيد</th>
                <th>التشغيلات</th>
                <th>النقاط المستهلكة</th>
                <th>آخر دخول</th>
                <th aria-label="الإجراء" />
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="adminu-empty-state">
                      <span>لا توجد نتائج مطابقة</span>
                      <p>عدّل البحث أو امسح عوامل التصفية الحالية.</p>
                      <Link href="/admin/users">عرض جميع المستخدمين</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const identity =
                    user.display_name || user.email || user.user_id;
                  const initial = identity.slice(0, 1).toUpperCase();

                  return (
                    <tr key={user.user_id}>
                      <td>
                        <div className="adminu-user-cell">
                          <span className="adminu-avatar">{initial}</span>
                          <div>
                            <Link href={`/admin/users/${user.user_id}`}>
                              {user.display_name || "بدون اسم"}
                            </Link>
                            <small dir="ltr">
                              {user.email || user.user_id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`adminu-status is-${user.profile_status}`}
                        >
                          <i aria-hidden="true" />
                          {statusLabel(user.profile_status)}
                        </span>
                      </td>
                      <td>
                        <span className="adminu-plan">
                          {user.plan_name_ar || "مجاني"}
                        </span>
                      </td>
                      <td>
                        <strong className="adminu-number">
                          {formatNumber(user.balance)}
                        </strong>
                      </td>
                      <td>
                        <span className="adminu-number">
                          {formatNumber(user.run_count)}
                        </span>
                      </td>
                      <td>
                        <span className="adminu-number">
                          {formatNumber(user.credits_consumed)}
                        </span>
                      </td>
                      <td>
                        <time>{formatDate(user.last_sign_in_at)}</time>
                      </td>
                      <td>
                        <Link
                          className="adminu-view-button"
                          href={`/admin/users/${user.user_id}`}
                          aria-label={`عرض حساب ${identity}`}
                        >
                          عرض
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="adminu-pagination">
          <div>
            عرض حتى {formatNumber(pageSize)} حسابًا في الصفحة
          </div>
          <nav aria-label="ترقيم صفحات المستخدمين">
            {page > 1 ? (
              <Link href={buildUsersHref(query, { page: String(page - 1) })}>
                السابق
              </Link>
            ) : (
              <span aria-disabled="true">السابق</span>
            )}

            <strong>{formatNumber(page)}</strong>

            {page < totalPages ? (
              <Link href={buildUsersHref(query, { page: String(page + 1) })}>
                التالي
              </Link>
            ) : (
              <span aria-disabled="true">التالي</span>
            )}
          </nav>
        </footer>
      </section>
    </div>
  );
}
