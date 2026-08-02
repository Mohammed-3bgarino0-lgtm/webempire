import "@/app/globals.css";
import "@/app/admin-v3.css";

import { AdminShell } from "@/components/admin-shell";
import { requireAdminContext } from "@/lib/auth";
import { formatProductVersion } from "@/lib/product-version";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Admin | Web Empire",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminContext();
  const supabase = createSupabaseAdminClient();

  const [activeToolsResult, profileResult] = await Promise.all([
    supabase
      .from("tools")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", admin.userId)
      .maybeSingle(),
  ]);

  const productVersion = activeToolsResult.error
    ? "VERSION UNAVAILABLE"
    : formatProductVersion(activeToolsResult.count ?? 0);

  const adminName =
    profileResult.data?.display_name?.trim() || "مدير النظام";

  return (
    <html lang="ar" dir="rtl">
      <body className="admin-root">
        <AdminShell
          adminName={adminName}
          adminRole={admin.role}
          productVersion={productVersion}
        >
          {children}
        </AdminShell>
      </body>
    </html>
  );
}
