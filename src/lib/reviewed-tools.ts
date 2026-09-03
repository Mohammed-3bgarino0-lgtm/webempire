import { INDEXING_WAVE_1_TOOL_SLUGS } from "@/lib/indexing-wave1-tools";

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
] as const;

const reviewedPublicToolSlugs = new Set<string>(REVIEWED_PUBLIC_TOOL_SLUGS);
const indexablePublicToolSlugs = new Set<string>(INDEXABLE_PUBLIC_TOOL_SLUGS);

export function isReviewedPublicToolSlug(slug: string) {
  return reviewedPublicToolSlugs.has(slug);
}

export function isIndexablePublicToolSlug(slug: string) {
  return indexablePublicToolSlugs.has(slug);
}
