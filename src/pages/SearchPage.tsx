import { useMemo, useState } from "react";
import { usePoems } from "../hooks/usePoems";
import { TagFilter } from "../components/TagFilter";
import { PoemList } from "../components/PoemList";
import { searchPoems, normalizeForSearch } from "../lib/search";

export function SearchPage() {
  const { poems, allTags } = usePoems();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"titleAuthor" | "full">("full");
  const [tags, setTags] = useState<string[]>([]);
  const [sourceQuery, setSourceQuery] = useState("");

  const results = useMemo(() => {
    let list = searchPoems(poems, query, mode);
    if (tags.length > 0) {
      list = list.filter((p) => p.tags.some((t) => tags.includes(t)));
    }
    if (sourceQuery.trim()) {
      const target = normalizeForSearch(sourceQuery.trim());
      list = list.filter((p) => normalizeForSearch(p.source).includes(target));
    }
    return list;
  }, [poems, query, mode, tags, sourceQuery]);

  return (
    <section className="page">
      <h2>検索</h2>
      <div className="search-controls">
        <input
          type="search"
          placeholder="キーワードを入力"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-controls__mode">
          <label>
            <input type="radio" name="mode" checked={mode === "full"} onChange={() => setMode("full")} />
            全文検索(本文含む)
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "titleAuthor"}
              onChange={() => setMode("titleAuthor")}
            />
            タイトル・作者のみ
          </label>
        </div>
      </div>
      <TagFilter allTags={allTags} selected={tags} onChange={setTags} />
      <label className="field">
        出典の部分一致検索
        <input
          type="search"
          placeholder="例: 万葉集"
          value={sourceQuery}
          onChange={(e) => setSourceQuery(e.target.value)}
        />
      </label>
      <p className="result-count">{results.length}件</p>
      <PoemList poems={results} />
    </section>
  );
}
