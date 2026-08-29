import type { NextRequest } from "next/server";

import { isReviewedPublicToolSlug } from "./src/lib/reviewed-tools";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const response = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "";

  if (section === "auth" || section === "dashboard") {
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  if (section === "tools") {
    const slug = parts[2];
    if (slug && !isReviewedPublicToolSlug(slug)) {
      response.headers.set("X-Robots-Tag", "noindex, follow");
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
