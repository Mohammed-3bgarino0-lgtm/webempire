import { corsJson, corsOptions } from "@/lib/api-cors";

export function OPTIONS() {
  return corsOptions();
}

export async function POST() {
  return corsJson(
    { error: "PRICING_DISABLED" },
    { status: 410 },
  );
}
