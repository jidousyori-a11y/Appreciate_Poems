import type { Poem } from "../types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function PoemView({ poem }: { poem: Poem }) {
  return (
    <>
      <h2>{poem.title}</h2>
      {poem.author && <p className="poem-detail__author">{poem.author}</p>}
      <div className="poem-detail__tags">
        {poem.tags.map((t) => (
          <span key={t} className="tag-pill">
            {t}
          </span>
        ))}
      </div>
      <dl className="poem-detail__meta">
        <dt>登録日</dt>
        <dd>{formatDate(poem.createdAt)}</dd>
        <dt>最終更新日</dt>
        <dd>{formatDate(poem.updatedAt)}</dd>
        {poem.source && (
          <>
            <dt>出典</dt>
            <dd>{poem.source}</dd>
          </>
        )}
      </dl>
      <div className="poem-detail__content">{poem.content}</div>
      {poem.note && (
        <div className="poem-detail__note">
          <h3>鑑賞メモ</h3>
          <p>{poem.note}</p>
        </div>
      )}
    </>
  );
}
