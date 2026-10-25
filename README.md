# 公式サイト（kyobashi-ent.com）公開用

**このリポジトリはビルド後の公開用ファイルです。直接編集しないでください**（ビルドのたびに上書きされます）。
push すると Cloudflare Pages が自動で本番に反映します。

## 編集元はこちら（2026-10-25〜）

編集元の日本語HTML・画像・ビルドスクリプトは、非公開リポジトリにあります。

- https://github.com/akihitonojima1987-cmyk/kyobashi-ent-site-src （非公開）
- 見えないとき（「見つからない」と出るとき）は、GitHub に **akihitonojima1987-cmyk** でログインしているか確認してください。
  別のアカウントでログインしていると、非公開リポジトリは表示されません。

## 新しいPCで更新できるようにする手順

1. Git と Python 3 を入れる
2. GitHub に akihitonojima1987-cmyk でログインできる状態にする
3. 編集元を取り込む

   ```
   git clone https://github.com/akihitonojima1987-cmyk/kyobashi-ent-site-src.git C:\dev\kyobashi-ent-site-src
   ```

4. 準備スクリプトを実行する（このリポジトリを隣に取り込み、動作確認まで行う）

   ```
   powershell -ExecutionPolicy Bypass -File C:\dev\kyobashi-ent-site-src\スクリプト\setup_new_pc.ps1
   ```

5. 以降の作業は `C:\dev\kyobashi-ent-site-src` で行い、そこの `CLAUDE.md` と `README.md` に従う
   （作業前に両方のリポジトリを pull、作業後に両方を push）
