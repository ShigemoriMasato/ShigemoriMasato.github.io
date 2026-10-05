# Shigemori's Portfolio

薫森将人（シゲモリマサト）のゲームプログラマー向けポートフォリオです。GitHub Pages と Jekyll で公開します。トップページはカスタム HTML/CSS で構成し、追加フォントとして Google Fonts の Manrope、Noto Sans JP、DM Mono を読み込みます。接続できない環境ではシステムフォントにフォールバックします。

## 公開設定

GitHub リポジトリの **Settings → Pages** で、公開元を `Deploy from a branch`、既定ブランチの `/ (root)` に設定してください。ユーザーサイトの URL は `https://ShigemoriMasato.github.io/` です。

## プロフィールの編集

プロフィールや実績は `index.html` に記載しています。連絡先など公開範囲を限定したい情報は掲載しないでください。

## トップ画像の変更

トップ右側の画像は `index.html` の `hero-art` 内にある `<img>` で指定しています。現在は `images/test.png` を表示しています。差し替える場合は画像を `images/` に追加し、この `<img>` の `src` を `{{ '/images/新しい画像.png' | relative_url }}` に変更してください。

## 技術ハイライトのリンク先

「技術への取り組み」セクションのカードはホバー時に拡大し、左側グリッドをダブルクリックするとリンクを開きます。遷移先は `index.html` の `id="engine-link"` 要素にある `data-url` 属性で変更できます。現在は動作確認用に Google を指定しています。

## 作品の追加

`index.html` の `work-grid` 内にあるコメント付き `<article class="work-card">` テンプレートを複製し、HTML コメントの外に置いて編集してください。`data-category` には `game`、`engine`、`tool` のいずれかを指定すると一覧の絞り込みに対応します。`data-title`、`data-period`、`data-description`、`data-image` に作品情報を設定すると、カードをクリックしたときに全画面詳細が開きます。画像は `images/` に追加してください。

詳細画面のリンクアイコンは任意で指定できます。GitHub リンクは `data-github="https://github.com/..."`、ダウンロードリンクは `data-download="{{ '/downloads/作品.zip' | relative_url }}"` に URL を設定してください。不要なリンクは属性を空にするか削除すると、アイコンも表示されません。作品名、説明、技術タグなどもテンプレートから編集できます。カードをクリックして開く詳細画面は Esc キー、閉じるボタン、背景クリックで閉じられます。

画像は `images/` に置き、カードの `work-image` に `style="background-image:url('{{ '/images/ファイル名.png' | relative_url }}')"` を設定します。作品カードを追加すると件数表示も自動で更新されます。カテゴリ絞り込みや件数表示は `assets/js/site.js` が担当しています。

## 設定

サイト名と説明文は `_config.yml` で変更できます。変更を GitHub に push すると Pages のビルド後に反映されます。
