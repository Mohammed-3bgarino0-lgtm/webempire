import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDirectory = path.join(root, "src", "content", "blog", "posts");
const targetCount = Number(process.argv[2] || 9000);

const files = (await fs.readdir(postsDirectory))
  .filter((name) => /^article-\d+\.json$/u.test(name));

const ids = new Set(
  files.map((name) => Number(name.match(/\d+/u)?.[0] || 0)).filter(Boolean),
);

const missing = [];
for (let id = 1; id <= targetCount; id += 1) {
  if (!ids.has(id)) missing.push(id);
}

const ranges = [];
for (const id of missing) {
  const last = ranges.at(-1);
  if (last && id === last[1] + 1) {
    last[1] = id;
  } else {
    ranges.push([id, id]);
  }
}

console.log(`Article JSON files: ${ids.size}`);
console.log(`Target library: ${targetCount}`);
console.log(`Missing articles: ${missing.length}`);
console.log(
  "Missing ranges:",
  ranges.length
    ? ranges.map(([from, to]) => (from === to ? `${from}` : `${from}-${to}`)).join(", ")
    : "none",
);
