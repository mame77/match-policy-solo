# Design Document: 政治エンゲージメント Web アプリケーション

## 1. プロジェクト概要

### 1.1 目的
若者に政治への関心を持ってもらうことを目的としたソーシャルプラットフォーム。投票に関する話題や対話のきっかけを提供し、政治への一歩を踏み出すハードルを下げることを目指す。

### 1.2 ターゲットユーザー
- 日本の若年層（主に18-30代）
- 政治に関心はあるが、参加方法がわからない、または参加しにくいと感じている層
- 同じような価値観を持つ人とつながりたいと考えている人々

### 1.3 主要機能
- ユーザー登録・認証
- プロフィール作成・管理
- 投稿機能（政治的意見の共有）
- マッチング機能（他ユーザーの投稿閲覧）
- ダイレクトメッセージ（DM）機能
- リアルタイムメッセージング（WebSocket）

---

## 2. システムアーキテクチャ

### 2.1 全体構成

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
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Routers   │  │   Services   │  │   WebSockets     │  │
│  │  (API層)    │  │  (ビジネス   │  │  (リアルタイム)  │  │
│  │             │  │   ロジック)  │  │                  │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
└───────┬─────────────────────────────────────┬───────────────┘
        │                                     │
        │                                     │
┌───────▼──────────┐                  ┌───────▼──────────┐
│   PostgreSQL     │                  │      MinIO       │
│   (Database)     │                  │  (Object Store)  │
│                  │                  │  (画像保存)      │
└──────────────────┘                  └──────────────────┘
```

### 2.2 アーキテクチャの特徴

#### レイヤー構造
1. **Presentation Layer (Frontend)**
   - Next.js App Router によるページベースルーティング
   - React Context による WebSocket 接続管理
   - TailwindCSS によるスタイリング

2. **API Layer (Backend Routers)**
   - RESTful API エンドポイント
   - JWT ベースの認証ミドルウェア
   - WebSocket エンドポイント

3. **Business Logic Layer (Services)**
   - ドメインロジックのカプセル化
   - データベース操作の抽象化
   - 外部サービス（MinIO）との連携

4. **Data Layer (Database/Storage)**
   - PostgreSQL によるリレーショナルデータ管理
   - MinIO による画像ファイルストレージ

---

## 3. 技術スタック

### 3.1 フロントエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| フレームワーク | Next.js | 15.3.3 | SSR/SSG、App Router |
| UI ライブラリ | React | 19.1.0 | コンポーネントベース UI |
| 言語 | TypeScript | - | 型安全性 |
| スタイリング | TailwindCSS | 4.x | ユーティリティファースト CSS |
| 画像処理 | react-easy-crop | - | プロフィール画像のクロップ |
| 日付処理 | dayjs | - | タイムスタンプ表示 |
| リアルタイム通信 | WebSocket API | ネイティブ | DM のリアルタイム送受信 |

### 3.2 バックエンド

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

### 3.3 インフラストラクチャ

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| コンテナ化 | Docker Compose | ローカル開発環境 |
| デプロイ（予定） | Vercel | フロントエンド |
| デプロイ（予定） | Render/Railway | バックエンド |

---

## 4. データベース設計

### 4.1 ER 図

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │───┐
│ username     │   │
│ hashed_pwd   │   │
└──────────────┘   │
                   │
    ┌──────────────┴───────────────┬───────────────┬──────────────┐
    │                              │               │              │
    │                              │               │              │
┌───▼─────────┐            ┌───────▼──────┐  ┌───▼─────┐   ┌───▼─────┐
│  profiles   │            │    posts     │  │   dms   │   │   dms   │
├─────────────┤            ├──────────────┤  ├─────────┤   ├─────────┤
│ user_id(PK) │            │ id (PK)      │  │ id (PK) │   │ id (PK) │
│ (FK→users)  │            │ user_id (FK) │  │ sender  │   │receiver │
│ bio         │            │ content      │  │ (FK)    │   │ (FK)    │
│ avatar_url  │            │ created_at   │  │ content │   │         │
└─────────────┘            └──────────────┘  │ created │   │         │
                                             └─────────┘   └─────────┘
```

### 4.2 テーブル定義

#### users テーブル
ユーザーアカウント情報を管理

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| id | SERIAL | PRIMARY KEY | ユーザー ID（自動採番） |
| username | VARCHAR(50) | NOT NULL, UNIQUE | ユーザー名（ログイン用） |
| hashed_password | TEXT | NOT NULL | bcrypt ハッシュ化されたパスワード |

#### profiles テーブル
ユーザーの公開プロフィール情報

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| user_id | INTEGER | PRIMARY KEY, FK → users(id) | ユーザー ID（1対1） |
| bio | TEXT | NULL | 自己紹介文 |
| avatar_url | TEXT | NULL | MinIO 上のアバター画像 URL |

**設計判断**: users と profiles を分離することで、認証情報と公開情報を分離し、セキュリティとデータアクセスパターンを最適化。

#### posts テーブル
ユーザーの投稿内容

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| id | SERIAL | PRIMARY KEY | 投稿 ID |
| user_id | INTEGER | NOT NULL, FK → users(id) | 投稿者 |
| content | TEXT | NOT NULL | 投稿本文 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 投稿日時 |

**インデックス候補**: `user_id`, `created_at` (DESC) - ユーザー別投稿取得、時系列ソートのため

#### dms テーブル
ダイレクトメッセージ

| カラム | 型 | 制約 | 説明 |
|-------|-----|------|------|
| id | SERIAL | PRIMARY KEY | メッセージ ID |
| sender_id | INTEGER | NOT NULL, FK → users(id) | 送信者 |
| receiver_id | INTEGER | NOT NULL, FK → users(id) | 受信者 |
| content | TEXT | NOT NULL | メッセージ本文 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 送信日時 |

**インデックス候補**:
- `(sender_id, receiver_id, created_at)` - 会話履歴取得用
- `(receiver_id, sender_id, created_at)` - 双方向検索用

### 4.3 外部キー制約

すべての外部キーに `ON DELETE CASCADE` を設定:
- ユーザー削除時に関連するプロフィール、投稿、DM を自動削除
- データ整合性を保証

---

## 5. API 設計

### 5.1 認証エンドポイント

#### POST /auth/signup
新規ユーザー登録

**リクエスト**:
```json
{
  "username": "string",
  "password": "string"
}
```

**レスポンス** (201 Created):
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

**処理フロー**:
1. ユーザー名の重複チェック
2. パスワードを bcrypt でハッシュ化
3. users テーブルに INSERT
4. JWT トークン生成（有効期限: 24時間）

#### POST /auth/login
ログイン

**リクエスト**:
```json
{
  "username": "string",
  "password": "string"
}
```

**レスポンス** (200 OK):
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

**処理フロー**:
1. ユーザー名でユーザー検索
2. bcrypt でパスワード検証
3. JWT トークン生成

---

### 5.2 プロフィールエンドポイント

#### POST /profiles/upload-url
画像アップロード用の署名付き URL 取得

**認証**: 必要（JWT）

**レスポンス** (200 OK):
```json
{
  "presignedUrl": "https://minio.../...",
  "objectKey": "avatars/user123_timestamp.jpg"
}
```

**処理フロー**:
1. JWT から user_id 取得
2. MinIO に 15 分間有効な署名付き PUT URL を生成
3. objectKey を生成（`avatars/{user_id}_{timestamp}.jpg`）

**設計判断**:
- フロントエンドから MinIO への直接アップロードで、バックエンドの負荷を軽減
- 署名付き URL により、セキュアなアップロードを実現

#### POST /profiles/setup
プロフィール作成・更新

**認証**: 必要（JWT）

**リクエスト**:
```json
{
  "bio": "string",
  "objectKey": "avatars/user123_timestamp.jpg"
}
```

**レスポンス** (200 OK):
```json
{
  "user_id": 123,
  "bio": "string",
  "avatar_url": "https://minio.../avatars/user123_timestamp.jpg"
}
```

#### GET /profiles/{user_id}
指定ユーザーのプロフィール取得

**認証**: 必要（JWT）

**レスポンス** (200 OK):
```json
{
  "user_id": 123,
  "username": "string",
  "bio": "string",
  "avatar_url": "https://..."
}
```

#### GET /profiles/me
自分のプロフィール取得

**認証**: 必要（JWT）

---

### 5.3 投稿エンドポイント

#### POST /posts
新規投稿作成

**認証**: 必要（JWT）

**リクエスト**:
```json
{
  "content": "string"
}
```

**レスポンス** (201 Created):
```json
{
  "id": 456,
  "user_id": 123,
  "content": "string",
  "created_at": "2025-01-15T10:30:00"
}
```

#### GET /posts
全投稿取得（時系列）

**認証**: 必要（JWT）

**レスポンス** (200 OK):
```json
[
  {
    "id": 456,
    "user_id": 123,
    "username": "string",
    "avatar_url": "https://...",
    "content": "string",
    "created_at": "2025-01-15T10:30:00"
  }
]
```

**SQL クエリ例**:
```sql
SELECT p.*, u.username, pr.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN profiles pr ON p.user_id = pr.user_id
ORDER BY p.created_at DESC
```

#### GET /posts/user/{user_id}
特定ユーザーの投稿取得

**認証**: 必要（JWT）

---

### 5.4 マッチングエンドポイント

#### GET /matching/feed
マッチングフィード（全ユーザーの投稿）

**認証**: 必要（JWT）

**レスポンス**: `/posts` と同一形式

**設計判断**: 現状は `/posts` と同一だが、将来的に以下の機能を追加予定:
- ユーザーの政治的価値観に基づくフィルタリング
- マッチングスコアに基づくソート
- レコメンデーション機能

---

### 5.5 DM エンドポイント

#### GET /dm/conversations
DM 会話一覧取得

**認証**: 必要（JWT）

**レスポンス** (200 OK):
```json
[
  {
    "user_id": 456,
    "username": "string",
    "avatar_url": "https://...",
    "last_message": "最新のメッセージ内容",
    "last_message_at": "2025-01-15T12:00:00"
  }
]
```

**SQL ロジック**:
1. 自分が送信または受信したメッセージを持つユーザーを取得
2. 各ユーザーとの最新メッセージを取得
3. 最新メッセージの時刻でソート

#### GET /dm/messages/{user_id}
特定ユーザーとのメッセージ履歴

**認証**: 必要（JWT）

**レスポンス** (200 OK):
```json
[
  {
    "id": 789,
    "sender_id": 123,
    "receiver_id": 456,
    "content": "メッセージ",
    "created_at": "2025-01-15T12:00:00",
    "is_mine": true
  }
]
```

#### POST /dm/messages/{user_id}
メッセージ送信

**認証**: 必要（JWT）

**リクエスト**:
```json
{
  "content": "メッセージ本文"
}
```

**処理フロー**:
1. JWT から sender_id 取得
2. dms テーブルに INSERT
3. WebSocket 経由で送信者・受信者双方にブロードキャスト

---

### 5.6 WebSocket エンドポイント

#### WS /ws/dm/{user_id}
リアルタイムメッセージング

**認証**: クエリパラメータで JWT トークン受け取り

**接続時**:
- ConnectionManager に接続を登録
- `{user_id: WebSocket}` のマッピングを保持

**メッセージ受信時** (POST /dm/messages 経由):
```json
{
  "type": "dm",
  "sender_id": 123,
  "sender_username": "string",
  "content": "メッセージ",
  "created_at": "2025-01-15T12:00:00"
}
```

**切断時**:
- ConnectionManager から接続を削除

---

## 6. 認証・認可

### 6.1 認証フロー

```
┌─────────┐                    ┌─────────┐                ┌──────────┐
│ Client  │                    │ Backend │                │   DB     │
└────┬────┘                    └────┬────┘                └────┬─────┘
     │                              │                          │
     │ POST /auth/signup            │                          │
     │ {username, password}         │                          │
     ├─────────────────────────────>│                          │
     │                              │ bcrypt.hash(password)    │
     │                              │                          │
     │                              │ INSERT users             │
     │                              ├─────────────────────────>│
     │                              │                          │
     │                              │ generate JWT             │
     │                              │ (sub: user_id,           │
     │                              │  exp: 24h)               │
     │                              │                          │
     │ {access_token}               │                          │
     │<─────────────────────────────┤                          │
     │                              │                          │
     │ localStorage.setItem()       │                          │
     │                              │                          │
     │ GET /profiles/me             │                          │
     │ Header: Authorization:       │                          │
     │         Bearer <token>       │                          │
     ├─────────────────────────────>│                          │
     │                              │ verify JWT               │
     │                              │ extract user_id          │
     │                              │                          │
     │                              │ SELECT profiles          │
     │                              ├─────────────────────────>│
     │                              │                          │
     │ {profile data}               │                          │
     │<─────────────────────────────┤                          │
     │                              │                          │
```

### 6.2 JWT 構造

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "123",  // user_id
  "exp": 1736950800  // 24時間後のタイムスタンプ
}
```

**Signature**:
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  SECRET_KEY
)
```

### 6.3 認可パターン

#### 依存性注入による認証
```python
from fastapi import Depends
from app.api.deps import get_current_user

@router.get("/profiles/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    # current_user["id"] で user_id を取得
    ...
```

**deps.py の実装**:
1. `Authorization` ヘッダーから JWT 取得
2. JWT 検証（署名、有効期限）
3. payload から user_id 抽出
4. ユーザー情報を返却

---

## 7. フロントエンド設計

### 7.1 ディレクトリ構造

```
frontend/src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   ├── login/
│   │   └── page.tsx         # ログインページ
│   ├── signup/
│   │   └── page.tsx         # サインアップページ
│   ├── setup/
│   │   └── page.tsx         # プロフィール設定
│   ├── profile/
│   │   ├── page.tsx         # 自分のプロフィール
│   │   └── [userId]/
│   │       └── page.tsx     # 他ユーザーのプロフィール
│   ├── posts/
│   │   ├── page.tsx         # 投稿一覧
│   │   └── new/
│   │       └── page.tsx     # 新規投稿
│   └── dm/
│       ├── page.tsx         # DM 一覧
│       └── [userId]/
│           └── page.tsx     # DM 会話
├── components/
│   ├── Footer.tsx           # ナビゲーションフッター
│   └── WebSocketProvider.tsx # WebSocket Context
├── lib/
│   └── api/                 # API クライアント
│       ├── auth.ts
│       ├── profile.ts
│       ├── posts.ts
│       ├── matching.ts
│       └── dm.ts
└── utils/
    └── cropImage.ts         # 画像クロップユーティリティ
```

### 7.2 状態管理

#### ローカルストレージ
- **JWT トークン**: `localStorage.setItem('token', accessToken)`
- クライアントサイドでのみアクセス（SSR 非対応）

#### React Context
- **WebSocketProvider**: WebSocket 接続をグローバルに管理
  ```typescript
  const WebSocketContext = createContext<WebSocket | null>(null);

  export function WebSocketProvider({ children }) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    // 接続管理ロジック
    return (
      <WebSocketContext.Provider value={ws}>
        {children}
      </WebSocketContext.Provider>
    );
  }
  ```

#### コンポーネントローカル状態
- `useState` によるフォーム入力、UI 状態管理
- サーバーからのデータは都度 fetch（キャッシュなし）

### 7.3 ルーティング

**公開ルート**:
- `/login`
- `/signup`

**認証必須ルート**:
- `/setup` - プロフィール設定
- `/profile` - 自分のプロフィール
- `/profile/[userId]` - 他ユーザーのプロフィール
- `/posts` - 投稿一覧
- `/posts/new` - 新規投稿
- `/dm` - DM 一覧
- `/dm/[userId]` - DM 会話

**認証チェック**:
各ページコンポーネントで `useEffect` によりトークン有効性を確認、未認証時は `/login` へリダイレクト。

### 7.4 API 通信

#### 共通ヘッダー設定
```typescript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

#### エラーハンドリング
- 401 Unauthorized → `/login` へリダイレクト
- 400/500 エラー → エラーメッセージ表示

---

## 8. リアルタイム機能（WebSocket）

### 8.1 ConnectionManager 設計

```python
class ConnectionManager:
    def __init__(self):
        # {user_id: WebSocket}
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)
```

### 8.2 メッセージ送信フロー

```
┌────────┐                    ┌─────────────┐                  ┌────────┐
│ User A │                    │   Backend   │                  │ User B │
└───┬────┘                    └──────┬──────┘                  └───┬────┘
    │                                │                             │
    │ WS: /ws/dm/123                 │                             │
    │ (接続)                          │         WS: /ws/dm/456      │
    ├───────────────────────────────>│         (接続)              │
    │                                │<────────────────────────────┤
    │                                │                             │
    │ POST /dm/messages/456          │                             │
    │ {content: "Hello"}             │                             │
    ├───────────────────────────────>│                             │
    │                                │                             │
    │                                │ INSERT INTO dms             │
    │                                │                             │
    │                                │ send_personal_message(A)    │
    │ WS: {type:"dm", content:...}   │                             │
    │<───────────────────────────────┤                             │
    │                                │                             │
    │                                │ send_personal_message(B)    │
    │                                │ WS: {type:"dm", content:...}│
    │                                ├────────────────────────────>│
    │                                │                             │
```

### 8.3 再接続処理

フロントエンドで WebSocket 切断時の自動再接続:
```typescript
useEffect(() => {
  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:8000/ws/dm/${userId}?token=${token}`);

    ws.onclose = () => {
      // 5秒後に再接続
      setTimeout(() => connectWebSocket(), 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWebSocket(ws);
  };

  connectWebSocket();
}, [userId, token]);
```

---

## 9. セキュリティ考慮事項

### 9.1 認証・認可

#### 実装済み
- **パスワードハッシュ化**: bcrypt（コスト係数デフォルト）
- **JWT トークン**: HS256 アルゴリズム、24時間有効期限
- **トークン検証**: 各保護エンドポイントで JWT 検証

#### 改善が必要な点
- **SECRET_KEY 管理**: 現在は `.env` にハードコード → 環境変数または秘密管理サービスへ移行
- **トークンリフレッシュ**: 現状、24時間後は再ログイン必要 → リフレッシュトークン実装を検討
- **HTTPS 強制**: 本番環境では必須（トークン盗聴防止）

### 9.2 CORS 設定

#### 現状（開発環境）
```python
allow_origins=["*"]  # すべてのオリジンを許可
```

#### 本番環境への推奨設定
```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

### 9.3 入力検証

#### 実装済み
- **Pydantic モデル**: リクエストボディの型検証
- **SQL インジェクション対策**: パラメータ化クエリ使用

#### 追加推奨事項
- **ユーザー名検証**: 長さ制限、許可文字の制限
- **コンテンツ検証**: 投稿・DM の文字数制限
- **XSS 対策**: フロントエンドでのサニタイズ（現状 React が自動エスケープ）

### 9.4 レート制限

#### 現状
未実装

#### 推奨実装
- **ログイン**: 5回/分/IP
- **投稿作成**: 10回/時/ユーザー
- **DM 送信**: 30回/分/ユーザー

**実装方法**: `slowapi` ライブラリまたは Redis ベースのレート制限

### 9.5 ファイルアップロード

#### 実装済み
- **署名付き URL**: MinIO presigned URL（15分有効）
- **直接アップロード**: クライアント → MinIO（バックエンド経由なし）

#### 追加推奨事項
- **ファイルタイプ検証**: MIME タイプチェック（画像のみ許可）
- **ファイルサイズ制限**: 例: 5MB 以下
- **ウイルススキャン**: アップロード後のスキャン

### 9.6 WebSocket セキュリティ

#### 実装済み
- **JWT 認証**: クエリパラメータでトークン受け取り

#### 改善点
- **接続数制限**: ユーザーあたり1接続に制限
- **メッセージレート制限**: 過度なメッセージ送信の防止
- **接続タイムアウト**: 非アクティブ接続の自動切断

---

## 10. パフォーマンス考慮事項

### 10.1 データベース最適化

#### 推奨インデックス
```sql
-- 投稿の時系列取得
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- DM 会話取得
CREATE INDEX idx_dms_sender_receiver_time
  ON dms(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_dms_receiver_sender_time
  ON dms(receiver_id, sender_id, created_at DESC);

-- ユーザー名検索
-- users.username には既に UNIQUE 制約があるため、インデックスが自動作成される
```

#### クエリ最適化
- **N+1 問題回避**: JOIN を使用してユーザー情報を一度に取得
- **ペジネーション**: 投稿・DM 一覧に LIMIT/OFFSET 実装を検討

### 10.2 キャッシュ戦略

#### 現状
キャッシュ未実装

#### 推奨実装
- **プロフィール情報**: Redis に 10分間キャッシュ
- **投稿フィード**: 1分間キャッシュ（頻繁な更新があるため短時間）
- **DM 会話一覧**: ユーザーごとにキャッシュ、新メッセージ時に無効化

### 10.3 フロントエンド最適化

#### 画像最適化
- **Next.js Image コンポーネント**: 自動的な画像最適化、lazy loading
- **アバター画像**: 固定サイズ（例: 200x200px）での保存

#### コード分割
- **Next.js 自動分割**: ページごとに自動コード分割
- **Dynamic Import**: 大きなコンポーネントの遅延ロード

#### API 呼び出し最適化
- **データフェッチング**: React Suspense、SWR または React Query の導入を検討
- **重複リクエスト防止**: フェッチングライブラリによる自動デduplication

---

## 11. テスト戦略

### 11.1 バックエンドテスト

#### 推奨テストレベル
1. **ユニットテスト**
   - Services 層のビジネスロジック
   - パスワードハッシュ、JWT 生成の検証
   - フレームワーク: pytest

2. **統合テスト**
   - API エンドポイントのテスト
   - データベース操作の検証
   - フレームワーク: pytest + FastAPI TestClient

3. **E2Eテスト**
   - 認証フローの完全なテスト
   - メッセージ送受信のテスト

### 11.2 フロントエンドテスト

#### 推奨テストレベル
1. **コンポーネントテスト**
   - フレームワーク: Jest + React Testing Library
   - フォームコンポーネント、UI コンポーネント

2. **統合テスト**
   - ページレベルのテスト
   - API 呼び出しのモック

3. **E2Eテスト**
   - フレームワーク: Playwright または Cypress
   - ユーザーフロー全体のテスト

---

## 12. デプロイメント

### 12.1 環境構成

#### 開発環境
- **フロントエンド**: `localhost:3000` (Next.js dev server)
- **バックエンド**: `localhost:8000` (uvicorn --reload)
- **データベース**: Docker Compose (PostgreSQL)
- **オブジェクトストレージ**: Docker Compose (MinIO)

#### 本番環境（予定）
- **フロントエンド**: Vercel
  - 自動 HTTPS
  - CDN による配信
  - 環境変数: `NEXT_PUBLIC_API_URL`

- **バックエンド**: Render または Railway
  - 自動 HTTPS
  - 環境変数: `SECRET_KEY`, `DATABASE_URL`, `MINIO_ENDPOINT` 等

- **データベース**: マネージド PostgreSQL (Render、AWS RDS 等)

- **オブジェクトストレージ**: AWS S3 または MinIO

### 12.2 CI/CD パイプライン

#### 推奨構成
1. **コードチェック**
   - ESLint / Prettier (フロントエンド)
   - Black / isort (バックエンド)

2. **テスト実行**
   - バックエンド: pytest
   - フロントエンド: Jest

3. **デプロイ**
   - main ブランチへのマージで自動デプロイ
   - Vercel: Git 統合による自動デプロイ
   - バックエンド: GitHub Actions → Render/Railway

### 12.3 環境変数管理

#### バックエンド (.env)
```bash
# セキュリティ
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# MinIO / S3
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=avatars
MINIO_USE_SSL=False

# CORS
FRONTEND_URL=http://localhost:3000
```

#### フロントエンド (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 13. 監視・ロギング

### 13.1 推奨監視項目

#### アプリケーションメトリクス
- **API レスポンスタイム**: 平均、p95、p99
- **エラーレート**: 4xx、5xx レスポンスの割合
- **WebSocket 接続数**: 同時接続ユーザー数

#### インフラメトリクス
- **CPU/メモリ使用率**
- **データベース接続プール**
- **ディスク使用量**（特に MinIO）

#### ビジネスメトリクス
- **DAU/MAU**: アクティブユーザー数
- **投稿数**: 日次投稿数
- **メッセージ数**: 日次 DM 送信数

### 13.2 ロギング戦略

#### ログレベル
- **DEBUG**: 開発環境のみ
- **INFO**: API リクエスト、主要な処理フロー
- **WARNING**: 異常だが処理続行可能な状態
- **ERROR**: エラーが発生した処理
- **CRITICAL**: システム全体に影響する重大エラー

#### 構造化ロギング
```python
import logging
import json

logger = logging.getLogger(__name__)

logger.info(json.dumps({
    "event": "user_login",
    "user_id": 123,
    "ip_address": request.client.host,
    "timestamp": datetime.utcnow().isoformat()
}))
```

---

## 14. 今後の展望

### 14.1 機能拡張

#### Phase 1: 基本機能の改善（短期）
- [ ] プロフィール編集機能
- [ ] 投稿の削除・編集機能
- [ ] DM の削除機能
- [ ] 通知機能（新しい DM、新しいフォロワー等）
- [ ] ユーザー検索機能

#### Phase 2: ソーシャル機能の強化（中期）
- [ ] フォロー/フォロワー機能
- [ ] いいね・コメント機能
- [ ] ハッシュタグ機能
- [ ] トレンド表示
- [ ] ユーザーブロック機能

#### Phase 3: 政治エンゲージメント機能（長期）
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

### 14.2 技術的改善

#### パフォーマンス
- Redis キャッシュ層の導入
- データベースインデックスの最適化
- CDN による静的アセット配信

#### スケーラビリティ
- 水平スケーリング対応（ステートレス化）
- WebSocket のスケーリング（Redis Pub/Sub）
- データベースリードレプリカの導入

#### セキュリティ
- リフレッシュトークンの実装
- 2要素認証（2FA）
- レート制限の導入
- セキュリティヘッダーの強化

#### 開発者体験
- API ドキュメント（FastAPI 自動生成 + カスタマイズ）
- Storybook による UI カタログ（README で言及）
- E2Eテストの導入

---

## 15. 用語集

| 用語 | 説明 |
|-----|------|
| JWT | JSON Web Token。トークンベース認証方式 |
| bcrypt | パスワードハッシュ化アルゴリズム |
| MinIO | S3 互換のオブジェクトストレージ |
| WebSocket | 双方向通信を可能にするプロトコル |
| CORS | Cross-Origin Resource Sharing。異なるオリジン間のリソース共有 |
| SSR | Server-Side Rendering。サーバーサイドでのレンダリング |
| SSG | Static Site Generation。静的サイト生成 |
| App Router | Next.js 13+ の新しいルーティングシステム |
| Presigned URL | 一時的なアクセス権限を持つ署名付き URL |

---

## 16. 参考資料

### 技術ドキュメント
- [FastAPI 公式ドキュメント](https://fastapi.tiangolo.com/)
- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [PostgreSQL 公式ドキュメント](https://www.postgresql.org/docs/)
- [MinIO 公式ドキュメント](https://min.io/docs/)

### 設計原則
- [REST API 設計のベストプラクティス](https://restfulapi.net/)
- [WebSocket セキュリティ](https://owasp.org/www-community/vulnerabilities/WebSocket_Security)
- [JWT ベストプラクティス](https://tools.ietf.org/html/rfc8725)

---

## 改訂履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|-----|-----------|---------|--------|
| 2025-01-15 | 1.0 | 初版作成 | Claude Code |

---

**このドキュメントは、現在のコードベースの実装状況と設計判断を記録したものです。今後の機能追加や変更に伴い、随時更新してください。**
