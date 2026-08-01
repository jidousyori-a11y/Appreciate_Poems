import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
export const POEMS_DIR = path.join(ROOT, "content", "poems");
export const OUTPUT_FILE = path.join(ROOT, "src", "generated", "poems.json");

export function generateIndex() {
  if (!fs.existsSync(POEMS_DIR)) {
    fs.mkdirSync(POEMS_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(POEMS_DIR)
    .filter((f) => f.endsWith(".md"));

  const poems = files.map((file) => {
    const raw = fs.readFileSync(path.join(POEMS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      id: data.id ?? file.replace(/\.md$/, ""),
      title: data.title ?? "(無題)",
      author: typeof data.author === "string" ? data.author : "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
      content: content.trim(),
      source: typeof data.source === "string" ? data.source : "",
      note: typeof data.note === "string" ? data.note : "",
    };
  });

  poems.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(poems, null, 2), "utf-8");

  return poems;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const poems = generateIndex();
  console.log(`generated ${poems.length} poem(s) -> ${path.relative(ROOT, OUTPUT_FILE)}`);
}
