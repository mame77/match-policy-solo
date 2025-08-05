const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 投稿データの型定義
export type Post = {
  id: number;
  username: string;
  avatar_url: string | null; // ← 追加（null の可能性があるならこう）
  content: string;
  created_at: string;        // ← 追加（ISO文字列として返ってくる）
};

// マッチング用の投稿一覧を取得
export async function fetchMatchingPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/matching`);
  if (!res.ok) throw new Error('投稿の取得に失敗しました');
  return res.json();
}
