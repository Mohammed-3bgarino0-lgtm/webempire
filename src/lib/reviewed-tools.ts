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

const reviewedPublicToolSlugs = new Set<string>(REVIEWED_PUBLIC_TOOL_SLUGS);

export function isReviewedPublicToolSlug(slug: string) {
  return reviewedPublicToolSlugs.has(slug);
}
