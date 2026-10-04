# Shigemori's Portfolio

薫森将人（シゲモリマサト）のゲームプログラマー向けポートフォリオです。GitHub Pages と Jekyll で公開します。トップページはカスタム HTML/CSS で構成し、追加フォントとして Google Fonts の Manrope、Noto Sans JP、DM Mono を読み込みます。接続できない環境ではシステムフォントにフォールバックします。

## 公開設定

GitHub リポジトリの **Settings → Pages** で、公開元を `Deploy from a branch`、既定ブランチの `/ (root)` に設定してください。ユーザーサイトの URL は `https://ShigemoriMasato.github.io/` です。

## プロフィールの編集

プロフィールや実績は `index.html` に記載しています。連絡先など公開範囲を限定したい情報は掲載しないでください。

## 作品の追加

`index.html` の `work-grid` 内にあるコメント付き `<article class="work-card">` テンプレートを複製し、HTML コメントの外に置いて編集してください。`data-category` には `game`、`engine`、`tool` のいずれかを指定すると一覧の絞り込みに対応します。作品名、制作期間、概要、担当、使用技術、公開リンクなどを記入してください。

画像は `images/` に置き、カードの `work-image` に `style="background-image:url('{{ '/images/ファイル名.png' | relative_url }}')"` を設定します。作品カードを追加すると件数表示も自動で更新されます。カテゴリ絞り込みや件数表示は `assets/js/site.js` が担当しています。

## 設定

サイト名と説明文は `_config.yml` で変更できます。変更を GitHub に push すると Pages のビルド後に反映されます。
