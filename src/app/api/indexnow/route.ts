import blogPosts from "@/content/blog/index.json";

const key = "9f3a64d2b57e41c8a06d9237fe18bc55";
const siteUrl = "https://webempire.site";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const releasedToday = blogPosts
    .filter((post) => post.publish_date === today)
    .map((post) => `${siteUrl}/ar/blog/${post.slug}`);
  const urlList = [siteUrl, `${siteUrl}/ar/blog`, ...releasedToday];

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "webempire.site",
      key,
      keyLocation: `${siteUrl}/${key}.txt`,
      urlList,
    }),
  });

  return Response.json(
    { submitted: urlList.length, date: today, indexNowStatus: response.status },
    { status: response.ok || response.status === 202 ? 200 : 502 },
  );
}
