import { INDEXING_WAVE_1_TOOL_SLUGS } from "@/lib/indexing-wave1-tools";
import { INDEXING_WAVE_2_TOOL_SLUGS } from "@/lib/indexing-wave2-tools";
import { INDEXING_WAVE_3_TOOL_SLUGS } from "@/lib/indexing-wave3-tools";
import { INDEXING_WAVE_4_TOOL_SLUGS } from "@/lib/indexing-wave4-tools";
import { INDEXING_WAVE_5_TOOL_SLUGS } from "@/lib/indexing-wave5-tools";

export const REVIEWED_PUBLIC_TOOL_SLUGS = [
  "average-calculator",
  "cbm-calculator",
  "celsius-to-fahrenheit-converter",
  "circle-circumference-calculator",
  "concrete-volume-calculator",
  "discount-calculator",
  "millimeter-to-inch-converter",
  "paint-liters-calculator",
  "percentage-calculator",
  "profit-margin-calculator",
  "roi-calculator",
  "vat-calculator",
] as const;

export const INDEXABLE_PUBLIC_TOOL_SLUGS = [
  ...REVIEWED_PUBLIC_TOOL_SLUGS,
  ...INDEXING_WAVE_1_TOOL_SLUGS,
  ...INDEXING_WAVE_2_TOOL_SLUGS,
  ...INDEXING_WAVE_3_TOOL_SLUGS,
  ...INDEXING_WAVE_4_TOOL_SLUGS,
  ...INDEXING_WAVE_5_TOOL_SLUGS,
] as const;

const adReviewedPublicToolSlugs = new Set<string>(REVIEWED_PUBLIC_TOOL_SLUGS);
const indexablePublicToolSlugs = new Set<string>(INDEXABLE_PUBLIC_TOOL_SLUGS);

// Kept for existing SEO call sites. This means reviewed for public indexing.
export function isReviewedPublicToolSlug(slug: string) {
  return indexablePublicToolSlugs.has(slug);
}

export function isIndexablePublicToolSlug(slug: string) {
  return indexablePublicToolSlugs.has(slug);
}

export function isAdReviewedPublicToolSlug(slug: string) {
  return adReviewedPublicToolSlugs.has(slug);
}
