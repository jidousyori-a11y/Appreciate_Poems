import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePoems } from "../hooks/usePoems";
import { TagFilter } from "../components/TagFilter";

export function RegisterPage() {
  const { id: routeId } = useParams<{ id?: string }>();
  const { poems, allTags } = usePoems();
  const [editingId, setEditingId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [status, setStatus] = useState("");

  const sortedPoems = useMemo(
    () => [...poems].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [poems]
  );

  const loadForEdit = (id: string) => {
    setEditingId(id);
    setStatus("");
    if (!id) {
      setTitle("");
      setAuthor("");
      setContent("");
      setSource("");
      setNote("");
      setTags([]);
      return;
    }
    const poem = poems.find((p) => p.id === id);
    if (poem) {
      setTitle(poem.title);
      setAuthor(poem.author);
      setContent(poem.content);
      setSource(poem.source);
      setNote(poem.note);
      setTags(poem.tags);
    }
  };

  useEffect(() => {
    if (routeId) {
      loadForEdit(routeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId, poems]);

  const addNewTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setNewTag("");
  };

  const submit = async () => {
    setStatus("送信中...");
    const payload = { title, author, content, tags, source, note };
    const url = editingId ? `/api/poems/${editingId}` : "/api/poems";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus("保存しました。ページを再読み込みします...");
        setTimeout(() => {
          location.hash = `/poems/${data.id}`;
          location.reload();
        }, 500);
      } else {
        setStatus("保存に失敗しました。");
      }
    } catch {
      setStatus("保存に失敗しました(ローカル開発サーバーが起動しているか確認してください)。");
    }
  };

  const deletePoem = async () => {
    if (!editingId) return;
    if (!confirm(`「${title}」を削除します。この操作は元に戻せません。よろしいですか?`)) {
      return;
    }
    setStatus("削除中...");
    try {
      const res = await fetch(`/api/poems/${editingId}`, { method: "DELETE" });
      if (res.ok) {
        setStatus("削除しました。ページを再読み込みします...");
        setTimeout(() => location.reload(), 500);
      } else {
        setStatus("削除に失敗しました。");
      }
    } catch {
      setStatus("削除に失敗しました(ローカル開発サーバーが起動しているか確認してください)。");
    }
  };

  return (
    <section className="page register-page">
      <h2>登録・編集</h2>
      <p className="register-page__note">
        このページはローカル開発時のみ利用できます。保存すると content/poems/ 配下にMarkdownファイルが作成・更新されます。反映後は
        git commit / push して公開サイトに反映してください。
      </p>

      <label className="field">
        編集対象
        <select value={editingId} onChange={(e) => loadForEdit(e.target.value)}>
          <option value="">(新規登録)</option>
          {sortedPoems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        タイトル
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="field">
        作者(任意)
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="例: 松尾芭蕉" />
      </label>

      <label className="field">
        本文
        <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <p className="register-page__hint">改行はそのまま表示に反映されます。</p>

      <label className="field">
        出典(任意)
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="詩集名・書籍名・URLなど" />
      </label>

      <label className="field">
        鑑賞メモ(任意)
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="感想・気づいたことなど"
        />
      </label>

      <TagFilter allTags={allTags} selected={tags} onChange={setTags} />

      <div className="register-page__new-tag">
        <input
          placeholder="新しいカテゴリ・タグを追加"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNewTag()}
        />
        <button type="button" onClick={addNewTag}>
          追加
        </button>
      </div>

      <div className="register-page__actions">
        <button className="register-page__submit" onClick={submit} disabled={!title.trim()}>
          {editingId ? "更新する" : "登録する"}
        </button>
        {editingId && (
          <button type="button" className="register-page__delete" onClick={deletePoem}>
            この詩を削除
          </button>
        )}
      </div>
      {status && <p className="register-page__status">{status}</p>}
    </section>
  );
}
