# 🗳 若者に少しでも政治に興味を持ってもらいたい Webアプリ

#このアプリは、投票に関する話題や対話のきっかけを提供することで、  
#若者が政治に一歩踏み出すきっかけを作ることを目指しています。

---

## 🛠 技術スタック

| 項目                 | 使用技術            |
| -------------------- | ------------------- |
| フレームワーク・言語 | Next.js, TypeScript |
| API通信              | fetch               |
| 認証方式             | JWT認証             |
| コンポーネント設計   | Atomic Design       |
| データベース         | PostgreSQL          |
| UIカタログ           | Storybook           |
| デプロイ先           | Vercel              |
| 開発品質ツール       | ESLint, Prettier    |

---

## ⚙️ セットアップ手順

### フロントエンド

```bash

##postgresを動かす
docker compose up

cd frontend
npm install next react react-dom react-easy-crop
npm install -D typescript @types/react @types/node


### バックエンド
cd backend

# Python環境構築
sudo apt update && sudo apt install -y python3-venv
python3 -m venv .venv

#macの場合
source .venv/bin/activate

#windowsの場合
.venv/Scripts/activate

# 必要パッケージのインストール
pip install fastapi "uvicorn[standard]" SQLAlchemy alembic psycopg2-binary python-jose passlib python-dotenv pydantic-settings bcrypt


#frontendの実行コマンド
npm run dev
#backendの実行コマンド
uvicorn app.main:app --reload

```

```💡
###今後の展望


    投票体験の疑似診断コンテンツ

    ユーザー同士の政治的価値観に基づくマッチング

    DM機能・投稿機能による対話促進

    匿名の意見投票やグラフ表示

    📦 デプロイ

    フロントエンド：Vercel

    バックエンド：（FastAPI用ホスティング or Render, Railway などを予定）

    🧪 開発サポート

    ESLint / Prettier によるコード整形・静的解析

    Storybook による UI カタログ作成
```

