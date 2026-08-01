import { useEffect, useState } from "react";
import { PoemView } from "./PoemView";
import { TagFilter } from "./TagFilter";
import { usePoems } from "../hooks/usePoems";
import type { Poem } from "../types";

interface PoemViewerProps {
  poems: Poem[];
  onExit: () => void;
  onPoemUpdated: (poem: Poem) => void;
}

export function PoemViewer({ poems, onExit, onPoemUpdated }: PoemViewerProps) {
  const { allTags } = usePoems();
  const [index, setIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const current = poems[index];
  const isLast = index === poems.length - 1;

  useEffect(() => {
    setEditing(false);
    setStatus("");
  }, [current]);

  if (!current) {
    return (
      <div className="poem-viewer">
        <p className="empty">該当する詩がありません。</p>
        <button type="button" className="poem-viewer__next" onClick={onExit}>
          戻る
        </button>
      </div>
    );
  }

  const startEditing = () => {
    setEditTitle(current.title);
    setEditAuthor(current.author);
    setEditContent(current.content);
    setEditSource(current.source);
    setEditNote(current.note);
    setEditTags(current.tags);
    setStatus("");
    setEditing(true);
  };

  const save = async () => {
    setStatus("送信中...");
    try {
      const res = await fetch(`/api/poems/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          content: editContent,
          tags: editTags,
          source: editSource,
          note: editNote,
        }),
      });
      if (res.ok) {
        onPoemUpdated({
          ...current,
          title: editTitle,
          author: editAuthor,
          content: editContent,
          source: editSource,
          note: editNote,
          tags: editTags,
          updatedAt: new Date().toISOString(),
        });
        setEditing(false);
      } else {
        setStatus("保存に失敗しました。");
      }
    } catch {
      setStatus("保存に失敗しました(ローカル開発サーバーが起動しているか確認してください)。");
    }
  };

  if (editing) {
    return (
      <div className="poem-viewer">
        <p className="poem-viewer__position">
          {index + 1} / {poems.length}
        </p>
        <div className="poem-viewer__card poem-viewer__edit">
          <label className="field">
            タイトル
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </label>
          <label className="field">
            作者
            <input value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} />
          </label>
          <label className="field">
            本文
            <textarea rows={10} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          </label>
          <label className="field">
            出典(任意)
            <input value={editSource} onChange={(e) => setEditSource(e.target.value)} placeholder="詩集名・書籍名・URLなど" />
          </label>
          <label className="field">
            鑑賞メモ(任意)
            <textarea rows={3} value={editNote} onChange={(e) => setEditNote(e.target.value)} />
          </label>
          <TagFilter allTags={allTags} selected={editTags} onChange={setEditTags} />
          {status && <p className="register-page__status">{status}</p>}
        </div>
        <div className="poem-viewer__edit-actions">
          <button type="button" className="poem-viewer__next" onClick={save} disabled={!editTitle.trim()}>
            上書き保存
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="poem-viewer">
      <p className="poem-viewer__position">
        {index + 1} / {poems.length}
      </p>
      <div className="poem-viewer__card">
        <PoemView poem={current} />
      </div>
      <div className="poem-viewer__actions">
        {import.meta.env.DEV && (
          <button type="button" className="poem-viewer__edit-entry" onClick={startEditing}>
            編集する
          </button>
        )}
        <button
          type="button"
          className="poem-viewer__next"
          onClick={() => (isLast ? onExit() : setIndex((i) => i + 1))}
        >
          {isLast ? "終了" : "次へ"}
        </button>
      </div>
    </div>
  );
}
