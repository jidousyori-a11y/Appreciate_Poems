import { useMemo, useState } from "react";
import { usePoems } from "../hooks/usePoems";
import { TagFilter } from "../components/TagFilter";
import { PoemList } from "../components/PoemList";
import { PoemViewer } from "../components/PoemViewer";
import type { Poem } from "../types";

type Mode = "random" | "recent";

function pickRandom(poems: Poem[], count: number): Poem[] {
  const shuffled = [...poems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function BrowsePage() {
  const { poems, allTags } = usePoems();
  const [mode, setMode] = useState<Mode>("random");
  const [tags, setTags] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<Poem[] | null>(null);

  const filtered = useMemo(() => {
    if (tags.length === 0) return poems;
    return poems.filter((p) => p.tags.some((t) => tags.includes(t)));
  }, [poems, tags]);

  const recent = useMemo(
    () => [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, count),
    [filtered, count]
  );

  const startViewing = () => {
    setSession(pickRandom(filtered, count));
  };

  const isViewing = mode === "random" && session !== null;

  const recentlyAdded = useMemo(
    () => [...poems].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10),
    [poems]
  );

  return (
    <section className="page">
      <h2>鑑賞</h2>

      {!isViewing && (
        <div className="browse-tabs">
          <button className={mode === "random" ? "active" : ""} onClick={() => setMode("random")}>
            ランダム鑑賞
          </button>
          <button className={mode === "recent" ? "active" : ""} onClick={() => setMode("recent")}>
            最近登録した順
          </button>
        </div>
      )}

      {isViewing ? (
        <PoemViewer
          poems={session}
          onExit={() => setSession(null)}
          onPoemUpdated={(updated) =>
            setSession((prev) => (prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : prev))
          }
        />
      ) : (
        <>
          <TagFilter allTags={allTags} selected={tags} onChange={setTags} />

          <div className="browse-count">
            <label>
              件数:
              <input
                type="number"
                min={1}
                max={200}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
              />
            </label>
            {mode === "random" && <button onClick={startViewing}>抽選して鑑賞する</button>}
          </div>

          {mode === "recent" && (
            <>
              <p className="result-count">{recent.length}件</p>
              <PoemList poems={recent} />
            </>
          )}
        </>
      )}

      {!isViewing && (
        <div className="browse-recent">
          <h3>最近登録した詩</h3>
          <PoemList poems={recentlyAdded} />
        </div>
      )}
    </section>
  );
}
