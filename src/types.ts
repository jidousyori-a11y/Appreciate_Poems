export interface Poem {
  id: string;
  title: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  /** 本文(俳句・短歌・詩・辞世の句・漢詩など)。改行を保持したまま表示する */
  content: string;
  /** 出典・参照元(詩集名、書籍名、URLなど)。未設定の場合は空文字 */
  source: string;
  /** 自分の鑑賞メモ・感想。未設定の場合は空文字 */
  note: string;
}
