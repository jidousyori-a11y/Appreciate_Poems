# 詩の鑑賞

俳句・短歌・詩・辞世の句・漢詩などを登録し、検索・閲覧(鑑賞)するための個人用Webシステム。
「情報カード」と同じ構成で作られている。

## 構成

- 検索・閲覧・詩の詳細はすべて静的サイトとして動作し、GitHub Pagesで公開する
- **登録・編集はローカルの開発サーバー(`npm run dev`)でのみ行う**。GitHub Pagesにデプロイされた本番サイトには登録機能自体が含まれない
- 各作品は `content/poems/*.md` に1ファイル1作品(YAML frontmatter + 本文)として保存する
- カテゴリ(俳句・短歌・詩・辞世の句・漢詩)は固定の分類ではなく「タグ」として管理する。登録画面から自由に新しいカテゴリ・タグを追加できる

## 使い方

### 詩を登録・編集する(ローカル)

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:10508` を開き、「登録」タブから作品を作成・編集する。保存すると `content/poems/` にMarkdownファイルが作成・更新される。

内容を確認したら、通常のgit操作で反映する:

```bash
git add content/poems
git commit -m "add: ○○を追加"
git push
```

pushすると GitHub Actions (`.github/workflows/deploy.yml`) が自動でビルドし、GitHub Pagesに反映される。

### 検索・閲覧(鑑賞)のみ(外出先・スマホなど)

GitHub PagesのURLにアクセスするだけでよい。

## GitHub Pagesの設定

1. GitHubにリポジトリを作成しこのプロジェクトをpush
2. リポジトリの Settings → Pages → Build and deployment → Source を **GitHub Actions** に設定
3. `master` ブランチにpushすると自動でデプロイされる

## 補足

- 本文はMarkdownとして解釈せず、改行をそのまま表示する(俳句・短歌・詩は改行そのものが意味を持つため)
- 初期カテゴリ: 俳句・短歌・詩・辞世の句・漢詩(登録画面から自由に追加可能)
