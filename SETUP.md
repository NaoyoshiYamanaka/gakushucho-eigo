# 学習帖・英語 — iPhone 配備ガイド

このフォルダ（`アプリ/`）を GitHub Pages に置いて、息子さんの iPhone のホーム画面にアプリのように追加するまでの手順です。
所要時間: 約 15 分 / 必要なもの: 無料の GitHub アカウントだけ。

---

## このフォルダの中身

```
アプリ/
├── 英語.html            ← 本体（全機能ここに入っている）
├── index.html           ← トップURLから 英語.html に自動転送
├── manifest.json        ← PWA 設定（アプリ名・アイコン・起動URLなど）
├── service-worker.js    ← オフラインキャッシュ
└── icons/
    ├── icon.svg
    ├── icon-180.png  (apple-touch-icon)
    ├── icon-192.png  icon-256.png  icon-384.png  icon-512.png
    ├── icon-512-maskable.png
    ├── apple-touch-icon.png
    └── favicon.png
```

---

## ステップ 1. GitHub アカウントを用意

1. <https://github.com/signup> でアカウントを作成（ユーザー名・メール・パスワード）
2. メール認証を済ませる
3. 以下では、ユーザー名を仮に `nao-papa` とします（自分のものに置き換えてください）

---

## ステップ 2. 新しいリポジトリを作る

1. GitHub にログインした状態で右上の **＋ → New repository** をクリック
2. 次のように入力：
   - **Repository name**: `gakushucho-eigo`（半角英数字推奨。URL に出ます）
   - **Description**: お好みで（例: 学習帖・英語）
   - **Public** を選択（GitHub Pages は Free プランでは Public のみ無料）
   - **Add a README file** にチェック
3. 一番下の緑色 **Create repository** をクリック

---

## ステップ 3. ファイルをアップロード

1. 作成したリポジトリのページで、**Add file → Upload files** をクリック
2. Mac の Finder で `アプリ/` フォルダを開く
3. **`アプリ/` フォルダの中身**（`英語.html` `index.html` `manifest.json` `service-worker.js` `icons` フォルダ）を **すべて選択** してブラウザにドラッグ＆ドロップ
   - フォルダ自体ではなく、**中身だけ** をアップロードしてください
4. 一番下まで下がり、**Commit changes** をクリック

> **確認**: リポジトリのトップに `英語.html` `index.html` `manifest.json` `service-worker.js` `icons` が表示されていれば OK。

---

## ステップ 4. GitHub Pages を有効化

1. リポジトリの **Settings** タブを開く
2. 左メニューの **Pages** を開く
3. **Build and deployment** の **Source** を **Deploy from a branch** に設定
4. **Branch** で **main** ・ **/(root)** を選択し、**Save** をクリック
5. 1〜2 分待つと、ページ上部に
   `✅ Your site is live at https://nao-papa.github.io/gakushucho-eigo/`
   のような URL が表示されます

> **メモ**: 初回は反映まで最大 5 分かかることがあります。

---

## ステップ 5. iPhone でアクセスしてホーム画面に追加

1. iPhone の **Safari**（必ず Safari。Chrome では Add to Home Screen の PWA 動作が一部効きません）でステップ 4 の URL を開く
2. ページが表示されたら、画面下の **共有ボタン（□↑）** をタップ
3. メニューを下にスクロール → **ホーム画面に追加**
4. 名前を確認（既定は「学習帖・英語」）して **追加** をタップ

> ホーム画面に「学習帖・英語」アイコンが追加され、タップすると Safari の UI なしでフルスクリーン起動します。

---

## ステップ 6. オフライン動作の確認（推奨）

1. ホーム画面のアイコンから一度アプリを起動して、Lesson 1 など適当に開く
   （Service Worker が中身をキャッシュします）
2. 機内モードをオンにしてアプリを起動 → 通信なしでも全機能が使えれば成功
3. 進捗・復習帳は iPhone の中（localStorage）に保存されるので、機内モードでも記録される

---

## あとから問題を追加・修正したいとき

1. 編集したいファイル（例: `英語.html`）を GitHub のリポジトリ上で開く
2. 右上の **鉛筆アイコン** で編集 → **Commit changes**
3. **service-worker.js** の `CACHE_VERSION` を新しい日付に書き換える
   （例: `v1-2026-05-18` → `v2-2026-05-19`）
   - これで iPhone 側の古いキャッシュが破棄され、新バージョンが取得される
4. iPhone でアプリを起動。最初の起動時に裏で更新が完了し、次回起動から新バージョンが反映

---

## トラブルシュート

| 症状 | 対策 |
|---|---|
| ページが 404 になる | GitHub Pages の反映待ち（最大 5 分）。URL の末尾に `/` を付けて再アクセス。 |
| アイコンが iPhone で出ない | Safari のキャッシュを削除（設定 → Safari → 履歴とWebサイトデータを消去）してから再追加 |
| オフラインで動かない | 一度オンラインでアプリを最後まで開き、Service Worker がキャッシュ完了するのを待つ |
| 文字が小さい / レイアウトが崩れる | iOS の Safari で `aA` から拡大率を 100% に戻す |
| 更新が反映されない | `service-worker.js` の `CACHE_VERSION` を変更してから再 push |

---

## URL のメモ

GitHub Pages 反映後の URL を控えておくと便利です。
ホーム画面のアイコンから起動する場合は意識する必要はありません。

- 公開URL: `https://<ユーザー名>.github.io/gakushucho-eigo/`
- 直接 英語.html を開く場合: `https://<ユーザー名>.github.io/gakushucho-eigo/英語.html`

---

## プライバシー

- 学習データ（進捗・復習帳）は iPhone の中（localStorage）にだけ保存され、GitHub には送られません
- リポジトリを Public にしてもアプリ本体（HTML）が公開されるだけで、学習履歴は公開されません

---

困ったら Claude に「`SETUP.md` のステップ X が動かない」と聞いてください。
