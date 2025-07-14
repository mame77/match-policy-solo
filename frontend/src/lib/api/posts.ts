const API_URL = process.env.NEXT_PUBLIC_API_URL;
//新規投稿を作成
export async function createPost(
  content: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 認証ヘッダー
    },
    body: JSON.stringify({ content }), // 投稿内容をjsonで説明
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('投稿失敗レスポンス:', errorText);
    throw new Error('投稿に失敗しました');
  }
}
