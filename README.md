# 🗳 政治エンゲージメント Web アプリケーション

若者に政治への関心を持ってもらうことを目的としたソーシャルプラットフォーム。
投票に関する話題や対話のきっかけを提供し、政治への一歩を踏み出すハードルを下げることを目指しています。

---
<img width="308" height="652" alt="image" src="https://github.com/user-attachments/assets/fea5cb32-8f34-487a-bfcc-62274128e206" />

発表資料: https://www.canva.com/design/DAGyiaWL9dg/ryJbHLJeH3ZemKth7kbtcQ/edit

## 📋 主要機能

-  ユーザー登録・認証（JWT ベース）
-  プロフィール作成・管理（画像アップロード対応）
-  投稿機能（政治的意見の共有）
-  マッチング機能（他ユーザーの投稿閲覧）
-  ダイレクトメッセージ（DM）機能
-  リアルタイムメッセージング（WebSocket）

## 🏗 システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                    Next.js 15 + React 19                    │
│                      (TypeScript)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API / WebSocket
                       │ JWT Authentication
┌──────────────────────┴──────────────────────────────────────┐
│                         Backend                             │
│                      FastAPI (Python)                       │
└───────┬─────────────────────────────────────┬───────────────┘
        │                                     │
┌───────▼──────────┐                  ┌───────▼──────────┐
│   PostgreSQL     │                  │      MinIO       │
│   (Database)     │                  │  (Object Store)  │
└──────────────────┘                  └──────────────────┘
```

## 🛠 技術スタック

### フロントエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| フレームワーク | Next.js | 15.3.3 | SSR/SSG、App Router |
| UI ライブラリ | React | 19.1.0 | コンポーネントベース UI |
| 言語 | TypeScript | - | 型安全性 |
| スタイリング | TailwindCSS | 4.x | ユーティリティファースト CSS |
| 画像処理 | react-easy-crop | - | プロフィール画像のクロップ |
| 日付処理 | dayjs | - | タイムスタンプ表示 |
| リアルタイム通信 | WebSocket API | ネイティブ | DM のリアルタイム送受信 |

### バックエンド

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| フレームワーク | FastAPI | 高速な API サーバー、自動 API ドキュメント生成 |
| 言語 | Python 3 | - |
| データベース | PostgreSQL | 15 | リレーショナルデータ永続化 |
| DB ドライバ | psycopg2-binary | PostgreSQL 接続 |
| 認証 | JWT (python-jose) | トークンベース認証 |
| パスワード | bcrypt (passlib) | パスワードハッシュ化 |
| ファイルストレージ | MinIO (boto3) | S3 互換オブジェクトストレージ |
| WebSocket | FastAPI WebSocket | リアルタイム双方向通信 |
| バリデーション | Pydantic | リクエスト/レスポンスの型安全性 |

### インフラストラクチャ

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| コンテナ化 | Docker Compose | ローカル開発環境 |
| デプロイ（予定） | Vercel | フロントエンド |
| デプロイ（予定） | Render/Railway | バックエンド |
| UIカタログ | Storybook | コンポーネントカタログ |
| 開発品質ツール | ESLint, Prettier | コード整形・静的解析 |

---

## ⚙️ セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/mame77/match-policy-solo.git
cd match-policy-solo
```

### 2. データベースとストレージの起動

```bash
# Docker Compose で PostgreSQL と MinIO を起動
docker compose up -d
```

### 3. バックエンドのセットアップ

```bash
cd backend

# Python 仮想環境の作成
python3 -m venv .venv

# 仮想環境の有効化
# macOS/Linux の場合:
source .venv/bin/activate
# Windows の場合:
# .venv\Scripts\activate

# 依存パッケージのインストール
pip install fastapi "uvicorn[standard]" SQLAlchemy alembic psycopg2-binary \
  python-jose passlib python-dotenv pydantic-settings bcrypt boto3 python-multipart
```

#### バックエンド環境変数の設定

`backend/.env` ファイルを作成し、以下の内容を記述：

```bash
# セキュリティ
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# MinIO (S3互換ストレージ)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=avatars
MINIO_USE_SSL=False

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. フロントエンドのセットアップ

```bash
cd frontend

# 依存パッケージのインストール
npm install
```

#### フロントエンド環境変数の設定

`frontend/.env.local` ファイルを作成し、以下の内容を記述：

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 5. アプリケーションの起動

#### バックエンド

```bash
cd backend
source .venv/bin/activate  # 仮想環境が有効化されていない場合
uvicorn app.main:app --reload
```

- API ドキュメント: http://localhost:8000/docs

#### フロントエンド

```bash
cd frontend
npm run dev
```

- アプリケーション: http://localhost:3000

### 6. MinIO の初期設定

1. MinIO コンソールにアクセス: http://localhost:9001
2. ログイン（デフォルト: minioadmin / minioadmin）
3. `avatars` バケットを作成（初回のみ）
4. バケットのアクセスポリシーを「Public」に設定

---

## 📚 ドキュメント

- **設計ドキュメント**: [DESIGN_DOC.md](./DESIGN_DOC.md) - 詳細なシステム設計、API仕様、データベース設計
- **API ドキュメント**: http://localhost:8000/docs (FastAPI 自動生成)

---

## 💡 今後の展望

### Phase 1: 基本機能の改善（短期）
- [ ] プロフィール編集機能
- [ ] 投稿の削除・編集機能
- [ ] DM の削除機能
- [ ] 通知機能（新しい DM、新しいフォロワー等）
- [ ] ユーザー検索機能

### Phase 2: ソーシャル機能の強化（中期）
- [ ] フォロー/フォロワー機能
- [ ] いいね・コメント機能
- [ ] ハッシュタグ機能
- [ ] トレンド表示
- [ ] ユーザーブロック機能

### Phase 3: 政治エンゲージメント機能（長期）
- [ ] **投票体験の疑似診断コンテンツ**
  - 政治クイズ
  - 価値観診断テスト
  - 投票シミュレーション
- [ ] **政治的価値観に基づくマッチング**
  - 価値観プロフィール（経済政策、社会政策等）
  - マッチングスコア算出
  - 相性の良いユーザー推薦
- [ ] **匿名の意見投票やグラフ表示**
  - トピックごとの投票機能
  - リアルタイム集計グラフ
  - 年代別・地域別の分析

---

## 📦 デプロイメント

### 開発環境
- フロントエンド: `localhost:3000` (Next.js dev server)
- バックエンド: `localhost:8000` (uvicorn --reload)
- データベース: Docker Compose (PostgreSQL)
- オブジェクトストレージ: Docker Compose (MinIO)


## 🧪 開発サポート

- **コード整形・静的解析**: ESLint, Prettier
- **UI カタログ**: Storybook
- **API ドキュメント**: FastAPI 自動生成（Swagger UI）
- **型安全性**: TypeScript (フロントエンド), Pydantic (バックエンド)

---

## 🔒 セキュリティ

- **認証**: JWT トークンベース認証（24時間有効期限）
- **パスワード**: bcrypt によるハッシュ化
- **ファイルアップロード**: MinIO 署名付き URL（15分有効）
- **CORS**: 適切なオリジン制限
- **SQL インジェクション対策**: パラメータ化クエリ使用

---

