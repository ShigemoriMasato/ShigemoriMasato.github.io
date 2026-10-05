# Shigemori's Portfolio

薫森将人（シゲモリマサト）のゲームプログラマー向けポートフォリオです。GitHub Pages と Jekyll で公開します。トップページはカスタム HTML/CSS で構成し、追加フォントとして Google Fonts の Manrope、Noto Sans JP、DM Mono を読み込みます。接続できない環境ではシステムフォントにフォールバックします。

## 公開設定

GitHub リポジトリの **Settings → Pages** で、公開元を `Deploy from a branch`、既定ブランチの `/ (root)` に設定してください。ユーザーサイトの URL は `https://ShigemoriMasato.github.io/` です。

## ローカルで確認する（Windows）

GitHub Pages と同じ Jekyll 環境で確認できます。最初に Ruby と MSYS2 DevKit を入れます。

1. [RubyInstaller のダウンロードページ](https://rubyinstaller.org/downloads/)を開き、**Ruby+Devkit x64** の安定版インストーラーをダウンロードします。ページで推奨されている最新の安定版を選んでください。DevKit は gem の一部をビルドするために使います。
2. インストーラーを実行し、既定の選択肢で進めます。Ruby を PATH に追加する項目を有効にし、最後の画面で **Run 'ridk install'** を選んで完了します。
3. 開いた MSYS2 のセットアップ画面で、推奨項目（通常は `1,2,3`）をインストールします。処理が終わったら画面を閉じます。
4. PowerShell を新しく開き、Ruby と gem が使えることを確認します。

```powershell
ruby -v
gem -v
bundle -v
```

RubyInstaller に Bundler が含まれていない場合は、次で追加します。

```powershell
gem install bundler
```

続いて、このリポジトリのルートで依存 gem をインストールし、サイトを起動します。

```powershell
bundle install
bundle update liquid
bundle exec jekyll serve --livereload
```

表示された `http://127.0.0.1:4000/` をブラウザーで開きます。ファイルを保存するとページが再生成され、ブラウザーも更新されます。終了するときはターミナルで `Ctrl+C` を押してください。

初回の `bundle install` では GitHub Pages が使う gem を取得します。依存 gem は `vendor/bundle` にインストールされ、Git 管理対象には含まれません。`Gemfile.lock` は環境に合わせて生成されます。`bundle` が見つからない場合は RubyInstaller が PATH に追加されているか確認し、PowerShell を開き直してから試してください。

## プロフィールの編集

プロフィールや実績は `index.html` に記載しています。連絡先など公開範囲を限定したい情報は掲載しないでください。

## トップ画像の変更

トップ右側の画像は `index.html` の `hero-art` 内にある `<img>` で指定しています。現在は `images/test.png` を表示しています。差し替える場合は画像を `images/` に追加し、この `<img>` の `src` を `{{ '/images/新しい画像.png' | relative_url }}` に変更してください。

## 技術ハイライトのリンク先

「技術への取り組み」セクションのカードはホバー時に拡大し、左側グリッドをダブルクリックするとリンクを開きます。遷移先は `index.html` の `id="engine-link"` 要素にある `data-url` 属性で変更できます。現在は動作確認用に Google を指定しています。

## 作品の追加

`index.html` の `work-grid` 内にあるコメント付き `<article class="work-card">` テンプレートを複製し、HTML コメントの外に置いて編集してください。`data-category` には `game` または `engine` を指定します。カード一覧では説明文を表示せず、`data-title`、`data-period`、`data-description`、`data-image` の情報はカードをクリックしたときの全画面詳細に表示します。画像は `images/` に追加してください。

お気に入りとして表示する作品には `data-favorite="true"` を追加してください。FAVORITE フィルターは GAME／ENGINE のカテゴリをまたいで、その属性が付いた作品を表示します。現在は受賞作「折り画面」をお気に入りに設定しています。

詳細画面のリンクアイコンは任意で指定できます。GitHub リンクは `data-github="https://github.com/..."`、ダウンロードリンクは `data-download="{{ '/downloads/作品.zip' | relative_url }}"` に URL を設定してください。不要なリンクは属性を空にするか削除すると、アイコンも表示されません。作品名、説明、技術タグなどもテンプレートから編集できます。カードをクリックして開く詳細画面は Esc キー、閉じるボタン、背景クリックで閉じられます。

画像は `images/` に置き、カードの `work-image` に `style="background-image:url('{{ '/images/ファイル名.png' | relative_url }}')"` を設定します。作品カードを追加すると件数表示も自動で更新されます。カテゴリ絞り込みや件数表示は `assets/js/site.js` が担当しています。

## 設定

サイト名と説明文は `_config.yml` で変更できます。変更を GitHub に push すると Pages のビルド後に反映されます。
