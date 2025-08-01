'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDmUsers, DmUser } from '@/lib/api/dm';
import { useGlobalWebSocket } from '@/components/WebSocketProvider';

export default function DmListPage() {
  const router = useRouter();
  const [dmUsers, setDmUsers] = useState<DmUser[]>([]);
  const { lastMessage } = useGlobalWebSocket();

  // ユーザークリックでDMページへ遷移
  const handleClick = (userId: number) => {
    router.push(`/dm/${userId}`);
  };

  // 初回にユーザー一覧を取得
  useEffect(() => {
    fetchDmUsers()
      .then(setDmUsers)
      .catch((err) => console.error('取得失敗:', err));
  }, []);

  // WebSocketで新着メッセージを受信したらDM一覧を更新
  useEffect(() => {
    if (!lastMessage) return;

    setDmUsers((prev) =>
      prev.map((user) =>
        user.id === Number(user.id) // ここは将来的に senderId をつけて比較
          ? { ...user, lastMessage: lastMessage.content }
          : user,
      ),
    );
  }, [lastMessage]);

  return (
    <div className="container">
      <h1 className="title">DM一覧</h1>
      <ul className="dm-list">
        {dmUsers.map((user) => (
          <li
            key={user.id}
            className="dm-item"
            onClick={() => handleClick(user.id)}
          >
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              className="avatar"
            />
            <div className="dm-content">
              <p className="dm-name">{user.name}</p>
              <p className="dm-last">{user.lastMessage}</p>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .container {
          max-width: 480px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        .title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .dm-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dm-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .dm-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          background-color: #fafafa;
        }

        .avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin-right: 16px;
          object-fit: cover;
          border: 2px solid #eee;
        }

        .dm-content {
          flex-grow: 1;
        }

        .dm-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #333;
        }

        .dm-last {
          margin-top: 6px;
          color: #777;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
