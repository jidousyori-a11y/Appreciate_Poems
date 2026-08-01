import type { Poem } from "../types";

/**
 * 全角/半角(「３」と「3」、「：」と「:」など)の表記ゆれを区別せずに照合するための正規化。
 * NFKCは全角英数記号を対応する半角に、半角カナを全角にといった互換分解+正規化を行う。
 */
export function normalizeForSearch(s: string): string {
  return s.normalize("NFKC").toLowerCase();
}

/**
 * 日本語は単語間に空白がないため、トークン単位で照合するライブラリ(MiniSearchなど)では
 * 「本文中の一部分」にしか出現しない語がヒットしないことがある。
 * そのため単純な部分一致(複数キーワードはAND)で実装する。
 */
export function searchPoems(poems: Poem[], query: string, mode: "titleAuthor" | "full"): Poem[] {
  const q = query.trim();
  if (!q) return poems;

  const terms = normalizeForSearch(q).split(/\s+/).filter(Boolean);
  return poems.filter((p) => {
    const haystack = normalizeForSearch(
      mode === "titleAuthor" ? `${p.title}\n${p.author}` : `${p.title}\n${p.author}\n${p.content}`
    );
    return terms.every((t) => haystack.includes(t));
  });
}
