export const REVIEWED_PUBLIC_TOOL_SLUGS = [
  "average-calculator",
  "cbm-calculator",
  "celsius-to-fahrenheit-converter",
  "circle-circumference-calculator",
  "compound-interest-calculator",
  "concrete-volume-calculator",
  "discount-calculator",
  "loan-payment-calculator",
  "millimeter-to-inch-converter",
  "minutes-to-decimal-hours",
  "paint-liters-calculator",
  "percentage-calculator",
  "price-with-vat-calculator",
  "profit-margin-calculator",
  "roi-calculator",
  "running-pace-calculator",
  "trip-fuel-cost-calculator",
  "vat-calculator",
  "vehicle-fuel-cost-calculator",
  "weighted-mean-calculator",
] as const;

const reviewedPublicToolSlugs = new Set<string>(REVIEWED_PUBLIC_TOOL_SLUGS);

export function isReviewedPublicToolSlug(slug: string) {
  return reviewedPublicToolSlugs.has(slug);
}
