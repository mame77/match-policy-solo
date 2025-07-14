const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createPost(
  content: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('投稿失敗レスポンス:', errorText);
    throw new Error('投稿に失敗しました');
  }
}
