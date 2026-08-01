import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { usePoems } from "../hooks/usePoems";
import { PoemView } from "../components/PoemView";

export function PoemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { poems } = usePoems();
  const poem = useMemo(() => poems.find((p) => p.id === id), [poems, id]);

  if (!poem) {
    return (
      <section className="page">
        <p>詩が見つかりません。</p>
        <Link to="/search">検索に戻る</Link>
      </section>
    );
  }

  return (
    <section className="page poem-detail">
      <div className="poem-detail__nav">
        <Link to="/search" className="poem-detail__back">
          ← 検索に戻る
        </Link>
        {import.meta.env.DEV && (
          <Link to={`/register/${poem.id}`} className="poem-detail__edit">
            編集する
          </Link>
        )}
      </div>
      <PoemView poem={poem} />
    </section>
  );
}
