import "server-only";

type ArticleAdOptions = {
  label: string;
  placeholderText: string;
};

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  "ca-pub-4001237202734263";

function cleanSlot(value: string | undefined) {
  const slot = value?.trim() ?? "";
  return /^\d+$/.test(slot) ? slot : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAdMarkup(
  slotValue: string | undefined,
  placement: string,
  options: ArticleAdOptions,
) {
  const slot = cleanSlot(slotValue);
  const label = escapeHtml(options.label);
  const placeholderText = escapeHtml(options.placeholderText);
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction || !slot) {
    return `<aside class="we-ad-slot we-ad-slot-placeholder" data-ad-placement="${placement}" aria-label="${label}"><span class="we-ad-label">${label}</span><div class="we-ad-placeholder" aria-hidden="true">${placeholderText}</div></aside>`;
  }

  return `<aside class="we-ad-slot" data-ad-placement="${placement}" aria-label="${label}"><span class="we-ad-label">${label}</span><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside>`;
}

export function hasInlineRelatedSection(html: string) {
  return /<h2>\s*مقالات مرتبطة\s*<\/h2>/u.test(html);
}

export function injectAdsIntoArticleHtml(
  html: string,
  options: ArticleAdOptions,
) {
  const parts = html.split(/(?=<section\b)/giu);
  if (parts.length < 2) return html;

  const relatedIndex = parts.findIndex(
    (part, index) =>
      index > 0 && /<h2>\s*مقالات مرتبطة\s*<\/h2>/u.test(part),
  );
  const contentEnd = relatedIndex >= 0 ? relatedIndex : parts.length;
  const middleSectionIndex =
    contentEnd > 2 ? Math.max(1, Math.floor((contentEnd - 1) / 2)) : -1;

  const topAd = renderAdMarkup(
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP,
    "article-top",
    options,
  );
  const middleAd = renderAdMarkup(
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MIDDLE,
    "article-middle",
    options,
  );
  const bottomAd = renderAdMarkup(
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM,
    "article-bottom",
    options,
  );

  let output = `${parts[0]}${topAd}`;

  for (let index = 1; index < parts.length; index += 1) {
    if (index === relatedIndex) output += bottomAd;
    output += parts[index];

    if (index === middleSectionIndex && index < contentEnd - 1) {
      output += middleAd;
    }
  }

  if (relatedIndex < 0) {
    const closingArticle = /<\/article>\s*$/iu;
    output = closingArticle.test(output)
      ? output.replace(closingArticle, `${bottomAd}</article>`)
      : `${output}${bottomAd}`;
  }

  return output;
}
