const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 投稿データの型定義
export type Post = {
  id: number;
  user_id: number; 
  username: string;
  avatar_url: string | null; 
  content: string;
  created_at: string;        
};

// マッチング用の投稿一覧を取得
export async function fetchMatchingPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/matching`);
  if (!res.ok) throw new Error('投稿の取得に失敗しました');
  return res.json();
}
