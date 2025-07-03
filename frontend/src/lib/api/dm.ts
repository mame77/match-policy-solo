// lib/api/dm.ts
export type DmUser = {
  id: number;
  name: string;
  lastMessage: string;
  avatarUrl?: string;
};

export type Message = {
  id: number;
  sender: 'me' | 'partner';
  content: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDmUsers(): Promise<DmUser[]> {
  const res = await fetch(`${API_URL}/api/dm/users`);
  if (!res.ok) {
    throw new Error('DMユーザーの取得に失敗しました');
  }
  return res.json();
}

export async function fetchMessages(userId: string): Promise<Message[]> {
  const res = await fetch(`${API_URL}/api/dm/messages/${userId}`);
  if (!res.ok) throw new Error('メッセージ取得失敗');
  return res.json();
}

export async function sendMessageToUser(
  userId: string,
  content: string,
): Promise<void> {
  await fetch(`${API_URL}/api/dm/messages/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}
