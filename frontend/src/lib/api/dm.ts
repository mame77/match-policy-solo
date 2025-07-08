// lib/api/dm.ts
export type DmUser = {
  id: number;
  name: string;
  lastMessage: string;
  avatarUrl?: string;
};

export type Message = {
  id: string;
  sender: 'me' | 'partner';
  content: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDmUsers(): Promise<DmUser[]> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_URL}/api/dm/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('DMユーザーの取得に失敗しました');
  }
  return res.json();
}

export async function fetchMessages(userId: string): Promise<Message[]> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_URL}/api/dm/messages/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('メッセージ取得失敗');
  return res.json();
}
export async function sendMessageToUser(
  userId: string,
  content: string,
): Promise<void> {
  const token = localStorage.getItem('access_token');
  await fetch(`${API_URL}/api/dm/messages/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
}
