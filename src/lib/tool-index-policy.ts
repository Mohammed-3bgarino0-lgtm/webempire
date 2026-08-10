const priorityToolSlugPatterns = [
  "vat",
  "tax",
  "discount",
  "margin",
  "roi",
  "percentage",
  "percent",
  "bmi",
  "gpa",
  "loan",
  "zakat",
  "gosi",
  "convert",
  "converter",
  "millimeter",
  "inch",
] as const;

export function isPriorityToolSlug(slug: string) {
  const value = slug.toLowerCase();
  return priorityToolSlugPatterns.some((pattern) => value.includes(pattern));
}
