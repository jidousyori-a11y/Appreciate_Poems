import { Link } from "react-router-dom";
import type { Poem } from "../types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function PoemListItem({ poem }: { poem: Poem }) {
  return (
    <Link to={`/poems/${poem.id}`} className="poem-list-item">
      <div className="poem-list-item__title">
        {poem.title}
        {poem.author && <span className="poem-list-item__author"> / {poem.author}</span>}
      </div>
      <div className="poem-list-item__meta">
        <span>{formatDate(poem.createdAt)}</span>
        {poem.tags.length > 0 && <span className="poem-list-item__tags">{poem.tags.join(" / ")}</span>}
      </div>
    </Link>
  );
}

export function PoemList({ poems }: { poems: Poem[] }) {
  if (poems.length === 0) {
    return <p className="empty">該当する詩がありません。</p>;
  }
  return (
    <ul className="poem-list">
      {poems.map((p) => (
        <li key={p.id}>
          <PoemListItem poem={p} />
        </li>
      ))}
    </ul>
  );
}
