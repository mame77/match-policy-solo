const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Post = {
  id: number;
  username: string;
  content: string;
};

export async function fetchMatchingPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/matching`);
  if (!res.ok) throw new Error('投稿の取得に失敗しました');
  return res.json();
}
