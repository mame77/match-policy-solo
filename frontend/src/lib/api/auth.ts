const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ログイン
export async function login(
  username: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('ログインに失敗しました');
  }

  const data = await res.json();
  return data.access_token;
}
// サインアップ
export async function signup(
  username: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('サインアップ失敗:', data);
    throw new Error('登録に失敗しました');
  }

  return data.access_token;
}
